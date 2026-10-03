// The hero's animation engine, ported from landing_page_v2/hero/src/hero.js.
//
// - First screen: still. Nothing moves until the visitor scrolls or hovers.
// - On scroll: the objects travel into a phone gallery, where the small
//   product loops (notifications, review stars, hearts, live counter) switch on.
// - One requestAnimationFrame loop, raw WebGL for the background (no library).
// - No React state: the component renders the DOM once, hands the elements
//   here, and calls the returned function on unmount.
//
// Differences from the prototype: the ?freeze= debug param and the window.__hero
// debug handle are gone; everything (listeners, timers, rAF, GL objects) is
// cleaned up on dispose; photo tiles and the QR / stars are rendered by React
// instead of injected.

export type HeroEls = {
  hero: HTMLElement;
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  objs: HTMLElement;
  copy: HTMLElement;
  copy2: HTMLElement;
  phone: HTMLElement;
  halo: HTMLElement;
  slotBrand: HTMLElement;
  slotAva: HTMLElement;
  slotChip: HTMLElement;
  liveN: HTMLElement;
  notifMsg: HTMLElement;
  stars: HTMLElement;
  heartPP: HTMLElement;
};

type Spec = readonly [number, number, number, number, number, number];
type Scatter = { x: number; y: number; r: number; s: number; z: number; o: number };
type Gather = { x: number; y: number; r: number; s: number; o: number };
type Obj = {
  id: string;
  el: HTMLElement;
  inn: HTMLElement;
  isTile: boolean;
  marks: HTMLElement[];
  hv: number;
  hvT: number;
  lastT: number;
  lastOn: boolean | null;
  row: number;
  i: number;
  hidden?: boolean;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ORDER = ['mehendi', 'baraat', 'haldi', 'sangeet', 'live', 'dadi', 'varmala', 'selfie', 'chip128', 'notif', 'heart', 'review', 'raw', 'wm', 'qr', 'pass'];
const ROWS = ['haldi', 'selfie', 'chip128', 'sangeet', 'dadi', 'wm', 'varmala', 'heart', 'qr'];

//            x      y      rot  scale depth opacity
// Two ordered rows under the button. Objects with opacity 0 wait below the fold and only join on scroll.
const SCATTER_D: Record<string, Spec> = {
  haldi: [-0.5, 0.34, -4, 0.58, 0.55, 1], selfie: [-0.235, 0.34, 0, 0.94, 0.75, 1],
  chip128: [0.045, 0.34, 0, 0.92, 0.95, 1], sangeet: [0.36, 0.34, 3, 0.6, 0.55, 1],
  dadi: [-0.6, 0.75, 3, 0.78, 0.8, 1], wm: [-0.3, 0.75, 0, 0.92, 0.95, 1],
  varmala: [-0.01, 0.75, -3, 0.55, 0.7, 1], heart: [0.23, 0.75, 0, 1.1, 0.9, 1],
  qr: [0.5, 0.75, 4, 0.76, 0.8, 1],
  mehendi: [-0.7, 1.5, -6, 0.7, 0.6, 0], baraat: [0.7, 1.5, 6, 0.7, 0.6, 0],
  live: [0, -1.3, 0, 1, 0.5, 0], review: [1.3, 0.1, 4, 1, 1, 0],
  raw: [1.3, 0.5, -4, 1, 1, 0], pass: [-1.3, 0.9, -5, 1, 1, 0],
  notif: [1.3, -0.3, -3, 1, 1, 0],
};
const SCATTER_M: Record<string, Spec> = {
  haldi: [-0.62, 0.42, -4, 0.5, 0.5, 1], selfie: [0, 0.42, 0, 0.8, 0.75, 1],
  sangeet: [0.6, 0.42, 3, 0.5, 0.5, 1],
  chip128: [-0.33, 0.79, 0, 0.8, 0.95, 1], dadi: [0.33, 0.8, 3, 0.66, 0.8, 1],
  heart: [0.79, 0.8, 0, 0.9, 0.9, 1],
  varmala: [1.8, 0.9, -3, 0.5, 0.7, 0], wm: [-1.8, 0.7, 0, 0.7, 0.9, 0],
  qr: [1.8, 0.7, 4, 0.7, 0.8, 0],
  mehendi: [-0.7, 1.5, -6, 0.6, 0.6, 0], baraat: [0.7, 1.5, 6, 0.6, 0.6, 0],
  live: [0, -1.3, 0, 0.8, 0.5, 0], review: [-1.9, 0.4, 4, 0.7, 1, 0],
  raw: [1.9, 0.24, -4, 0.7, 1, 0], pass: [-1.9, 0.86, -5, 0.7, 1, 0],
  notif: [1.9, 0.3, -3, 0.74, 1, 0],
};

const NOTES: ReadonlyArray<readonly [string, string]> = [
  ['Your Haldi photos are live', "Tap to open Riya & Arjun's gallery"],
  ['12 new photos of you', 'Just in from the Sangeet stage'],
  ['Dadi found 46 photos', 'She has shared 3 with the family group'],
  ['The Varmala is in', 'Delivered 2 minutes after it happened'],
];

const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time, u_p, u_intro;
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
vec3 ramp(float t){
  vec3 c0=vec3(.169,.078,.051);   // deep brown      #2B140D
  vec3 c1=vec3(.608,.282,.180);   // dark terracotta #9B482E
  vec3 c2=vec3(.761,.353,.227);   // terracotta      #C25A3A
  vec3 c3=vec3(.953,.871,.847);   // peach           #F3DED8
  vec3 c4=vec3(.984,.969,.953);   // page
  vec3 c=mix(c0,c1,smoothstep(-.12,.30,t));
  c=mix(c,c2,smoothstep(.22,.56,t));
  c=mix(c,c3,smoothstep(.56,.90,t));
  c=mix(c,c4,smoothstep(.88,1.04,t));
  return c;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; uv.y=1.-uv.y;
  float asp=u_res.x/u_res.y; vec2 q=vec2(uv.x*asp,uv.y);
  float t=u_time*.018;                       // very slow: the gradient breathes, it does not flow
  float n=fbm(q*.9+vec2(t,-t*.6));
  float y=uv.y+(n-.5)*.16;
  y+=u_p*.88;
  y=mix(y-.25,y,u_intro);
  vec3 col=ramp(y);
  col+=(hash(gl_FragCoord.xy)-.5)*.012;      // static dither, only to stop banding
  gl_FragColor=vec4(col,1.);
}`;

const INTRO_AT = 0.9; // seconds after load before the objects fade up

/**
 * Starts the hero. `cls` is the CSS Module's class map (the prototype toggled
 * plain class names). `tileIds` are the photo tiles, in the order they sit in
 * the phone's two columns' slots (`data-t` on the slot).
 */
export function startHero(
  els: HeroEls,
  cls: Readonly<Record<string, string>>,
  tileIds: readonly string[],
): () => void {
  const { hero, stage, objs: objsEl, copy, copy2, phone, halo, canvas: glc } = els;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let disposed = false;
  let raf = 0;
  const timeouts = new Set<number>();
  const intervals: number[] = [];
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timeouts.delete(id); fn(); }, ms);
    timeouts.add(id);
    return id;
  };

  /* ───────────── object registry ───────────── */
  const objs: Record<string, Obj> = {};
  objsEl.querySelectorAll<HTMLElement>('[data-id]').forEach(el => {
    const id = el.dataset.id as string;
    objs[id] = {
      id, el, inn: el.querySelector<HTMLElement>(':scope > div') as HTMLElement,
      isTile: tileIds.includes(id),
      marks: Array.from(el.querySelectorAll<HTMLElement>('[data-mark]')),
      hv: 0, hvT: 0, lastT: -1, lastOn: null, row: 0, i: 0,
    };
  });
  ORDER.forEach((id, i) => { objs[id].i = i; objs[id].el.style.zIndex = String(10 + i); });
  for (const id in objs) { const k = ROWS.indexOf(id); objs[id].row = k < 0 ? 0 : k; }

  /* ───────────── layout ───────────── */
  let W = 0, H = 0, MOB = false, K = 1;
  let G: Record<string, Gather> = {};
  let S: Record<string, Scatter> = {};
  let PHN = { cx: 0, cy: 0, pw: 0, ph: 0 };

  // rect of el relative to the phone box, ignoring transforms
  function relRect(el: HTMLElement) {
    let x = 0, y = 0;
    let n: HTMLElement | null = el;
    while (n && n !== phone) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }

  /* ───────────── WebGL background ───────────── */
  let gl: WebGLRenderingContext | null = null;
  let prog: WebGLProgram | null = null;
  let glBuf: WebGLBuffer | null = null;
  let GL_OK = false;
  const U: Record<string, WebGLUniformLocation | null> = {};
  let glQ = 1, perfN = 0, perfSum = 0;

  function initGL(): boolean {
    gl = glc.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return false;
    const g = gl;
    const mk = (type: number, src: string) => {
      const s = g.createShader(type);
      if (!s) return null;
      g.shaderSource(s, src); g.compileShader(s);
      if (!g.getShaderParameter(s, g.COMPILE_STATUS)) { console.warn(g.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = mk(g.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
    const fs = mk(g.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    prog = g.createProgram();
    if (!prog) return false;
    g.attachShader(prog, vs); g.attachShader(prog, fs); g.linkProgram(prog);
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) return false;
    g.useProgram(prog);
    glBuf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, glBuf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(prog, 'p');
    g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    ['u_res', 'u_time', 'u_p', 'u_intro'].forEach(n => { U[n] = g.getUniformLocation(prog as WebGLProgram, n); });
    return true;
  }

  function resizeGL() {
    if (!GL_OK || !gl) return;
    const d = Math.min(devicePixelRatio || 1, 2) * (MOB ? 0.8 : 1) * glQ;
    glc.width = Math.round(W * d); glc.height = Math.round(H * d);
    gl.viewport(0, 0, glc.width, glc.height);
  }

  const st = { p: 0, t0: performance.now(), last: performance.now(), intro: 0 };

  function perfTick(rdt: number, now: number) { // drop shader resolution if the GPU can't hold ~45fps
    if (!GL_OK || now - st.t0 < 1500 || glQ <= 0.45) return;
    perfSum += rdt;
    if (++perfN >= 40) { if (perfSum / perfN > 0.024) { glQ *= 0.75; resizeGL(); } perfN = 0; perfSum = 0; }
  }

  function layout() {
    W = stage.clientWidth; H = stage.clientHeight; MOB = W <= 820 || (W <= 1100 && H > W);
    K = MOB ? clamp(W / 390, 0.85, 1.5) : clamp(Math.min(W / 1440, H / 800), 0.62, 1.25);
    const src = MOB ? SCATTER_M : SCATTER_D;
    S = {};
    for (const id in src) {
      const [x, y, r, s, z, o] = src[id];
      S[id] = { x: x * W / 2, y: y * H / 2, r, s: s * K, z, o };
      if (objs[id].isTile) objs[id].el.style.setProperty('--ts', Math.min(1.35, 1 / (s * K)).toFixed(3));
    }

    // phone geometry
    const ph = MOB ? Math.min(H * 0.64, 580) : Math.min(H * 0.8, 660), pw = ph * 0.47;
    const cx = MOB ? 0 : W * 0.095, cy = MOB ? H * 0.125 : H * 0.06;
    PHN = { cx, cy, pw, ph };
    phone.style.setProperty('--pw', pw + 'px'); phone.style.setProperty('--ph', ph + 'px');

    const at = (el: HTMLElement) => {
      const r = relRect(el);
      return { x: cx - pw / 2 + r.x + r.w / 2, y: cy - ph / 2 + r.y + r.h / 2, w: r.w, h: r.h };
    };
    const slotOf = (id: string) => phone.querySelector<HTMLElement>(`[data-t="${id}"]`) as HTMLElement;
    G = {};
    tileIds.forEach(id => {
      const a = at(slotOf(id));
      G[id] = { x: a.x, y: a.y, r: 0, s: a.w / objs[id].inn.offsetWidth, o: 1 };
    });
    const dock = (id: string, slot: HTMLElement, fit: 'w' | 'h' = 'w') => {
      const a = at(slot); const o = objs[id]; const bw = o.inn.offsetWidth, bh = o.inn.offsetHeight;
      G[id] = { x: a.x, y: a.y, r: 0, s: fit === 'w' ? Math.min(a.w / bw, a.h / bh) : a.h / bh, o: 1 };
      return a;
    };
    const b = dock('wm', els.slotBrand); G.wm.x = b.x - b.w / 2 + objs.wm.inn.offsetWidth * G.wm.s / 2;
    dock('selfie', els.slotAva, 'h');
    const c = dock('chip128', els.slotChip); G.chip128.x = c.x - c.w / 2 + objs.chip128.inn.offsetWidth * G.chip128.s / 2;
    const vs = at(slotOf('varmala'));
    G.heart = { x: vs.x + vs.w / 2 - 4, y: vs.y - vs.h / 2 + 6, r: 8, s: (MOB ? 0.5 : 0.62) * K, o: 1 };
    if (MOB) {
      G.live = { x: 0, y: cy - ph / 2 - 24, r: 0, s: 0.74 * K, o: 1 };
      G.notif = { x: pw * 0.14, y: cy + ph / 2 - 6, r: -2, s: 0.74 * K, o: 1 };
      ['review', 'raw', 'pass', 'qr'].forEach(id => { G[id] = { x: S[id].x, y: S[id].y, r: 0, s: S[id].s, o: 0 }; });
    } else {
      const R = cx + pw / 2, Lf = cx - pw / 2;
      G.live = { x: cx, y: cy - ph / 2 - 24, r: 0, s: 0.86 * K, o: (H / 2 + cy - ph / 2) > 124 ? 1 : 0 };
      G.notif = { x: R + 136 * K, y: cy - ph * 0.365, r: 3, s: 0.92 * K, o: 1 };
      G.review = { x: R + 176 * K, y: cy - ph * 0.085, r: -3, s: 0.96 * K, o: 1 };
      G.raw = { x: R + 150 * K, y: cy + ph * 0.155, r: 2, s: 0.96 * K, o: 1 };
      G.qr = { x: R + 122 * K, y: cy + ph * 0.385, r: -5, s: 0.9 * K, o: 1 };
      G.pass = { x: Lf - 34 * K, y: cy + ph * 0.4, r: -5, s: 0.92 * K, o: 1 };
    }
    ORDER.forEach(id => { objs[id].lastT = -1; });
    objs.notif.el.style.zIndex = String(MOB ? 40 : 10 + objs.notif.i);
    resizeGL();
  }

  /* ───────────── input ───────────── */
  const onOver = (e: PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-id]');
    if (el && e.pointerType !== 'touch') objs[el.dataset.id as string].hvT = 1;
  };
  const onOut = (e: PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-id]');
    if (el) objs[el.dataset.id as string].hvT = 0;
  };
  objsEl.addEventListener('pointerover', onOver);
  objsEl.addEventListener('pointerout', onOut);

  /* ───────────── little product loops ───────────── */
  const fmt = (n: number) => n.toLocaleString('en-IN');
  let liveN = 2341;
  const liveEl = els.liveN;
  (function tick() {
    if (disposed) return;
    liveN += 1 + ((Math.random() * 5) | 0);
    liveEl.textContent = fmt(liveN);
    liveEl.classList.remove(cls.tick); void liveEl.offsetWidth; liveEl.classList.add(cls.tick);
    later(tick, 900 + Math.random() * 1500);
  })();

  const starEls = Array.from(els.stars.querySelectorAll('svg'));
  function runStars() {
    starEls.forEach(x => x.classList.remove(cls.on, cls.pop));
    starEls.forEach((x, i) => later(() => {
      x.classList.add(cls.on, cls.pop);
      later(() => x.classList.remove(cls.pop), 260);
    }, 160 * i + 100));
  }

  const noteBox = els.notifMsg;
  const makeNote = (i: number, className?: string) => {
    const d = document.createElement('div');
    if (className) d.className = className;
    const b = document.createElement('b'); b.textContent = NOTES[i][0];
    const s = document.createElement('span'); s.textContent = NOTES[i][1];
    d.append(b, s);
    return d;
  };
  noteBox.replaceChildren(makeNote(0));
  let noteI = 0;
  function nextNote() {
    noteI = (noteI + 1) % NOTES.length;
    const old = noteBox.firstElementChild as HTMLElement, nu = makeNote(noteI, cls.pre);
    noteBox.appendChild(nu);
    void nu.offsetWidth; nu.className = ''; old.className = cls.out;
    later(() => old.remove(), 650);
  }

  const heartPP = els.heartPP;
  function heartPop(n = 3) {
    for (let i = 0; i < n; i++) later(() => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24');
      s.innerHTML = '<path fill="#E8704A" d="M12 21s-7.500-4.700-9.600-9.300C.9 8.300 2.700 4.500 6.300 4.500c2.100 0 3.700 1.200 5.700 3.500 2-2.300 3.600-3.500 5.700-3.500 3.600 0 5.400 3.800 3.900 7.200C19.500 16.300 12 21 12 21z"/>';
      s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px'); s.style.setProperty('--dr', (Math.random() * 60 - 30) + 'deg');
      s.classList.add(cls.go); heartPP.appendChild(s); later(() => s.remove(), 1400);
    }, i * 130);
  }
  function startLoops() {
    later(runStars, 1900); intervals.push(window.setInterval(runStars, 9000));
    intervals.push(window.setInterval(() => { if (st.p > 0.3) nextNote(); }, 4300));
    intervals.push(window.setInterval(() => { if (st.p > 0.5) heartPop(2); }, 3600));
  }

  /* ───────────── main loop ───────────── */
  let calm: boolean | null = null;
  function frame(now: number) {
    if (disposed) return;
    const rdt = Math.min(1, (now - st.last) / 1000), dt = Math.min(0.05, rdt); st.last = now;
    perfTick(rdt, now);
    const time = (now - st.t0) / 1000;

    const r = hero.getBoundingClientRect(), pin = Math.max(1, hero.offsetHeight - H);
    const pRaw = clamp(-r.top / pin);
    st.p += (pRaw - st.p) * (1 - Math.pow(0.0009, rdt));
    const p = Math.abs(pRaw - st.p) < 0.0004 ? pRaw : st.p;
    st.intro = REDUCED ? 1 : easeOutCubic(clamp(time / 1.8));

    // the small product loops only run once the visitor has scrolled into the second beat
    const isCalm = p < 0.12;
    if (isCalm !== calm) { calm = isCalm; stage.classList.toggle(cls.calm, calm); }

    if (r.bottom > 0) {
      if (GL_OK && gl) {
        gl.uniform2f(U.u_res, glc.width, glc.height); gl.uniform1f(U.u_time, REDUCED ? 3 : time);
        gl.uniform1f(U.u_p, sstep(0.08, 0.8, p)); gl.uniform1f(U.u_intro, st.intro);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else {
        stage.style.background = p > 0.5 ? 'linear-gradient(180deg,#F3DED8,#FBF7F3)' : '';
      }

      const co = 1 - sstep(0.05, 0.3, p);
      copy.style.opacity = String(co); copy.style.transform = `translate3d(0,${-p * H * 0.3}px,0)`;
      copy.style.visibility = co < 0.01 ? 'hidden' : 'visible';

      const c2 = sstep(0.56, 0.78, p);
      copy2.style.opacity = String(c2); copy2.style.transform = `translate3d(0,${(1 - c2) * 44}px,0)`;
      const po = sstep(0.24, 0.52, p);
      phone.style.opacity = String(po);
      phone.style.transform = `translate(-50%,-50%) translate3d(${PHN.cx}px,${PHN.cy + (1 - po) * 110}px,0) scale(${0.86 + 0.14 * po})`;
      halo.style.opacity = String(po); halo.style.transform = `translate(-50%,-50%) translate3d(${PHN.cx}px,${PHN.cy}px,0) scale(${0.7 + 0.3 * po})`;

      for (let n = 0; n < ORDER.length; n++) {
        const o = objs[ORDER[n]], a = S[o.id], g = G[o.id];
        const stag = (n % 7) * 0.016;
        const t = easeInOutCubic(clamp((p - (0.13 + stag)) / 0.52));
        const it = REDUCED ? 1 : clamp((time - INTRO_AT - o.row * 0.05) / 0.9);
        const ie = easeOutCubic(it);
        o.hv += (o.hvT - o.hv) * (1 - Math.pow(0.001, dt));

        let x = lerp(a.x, g.x, t), y = lerp(a.y + (1 - ie) * 26, g.y, t);
        const arc = Math.sin(t * Math.PI);
        x += arc * ((n % 2 ? 1 : -1) * 22) * (MOB ? 0.4 : 1);
        y -= arc * (28 + (n % 5) * 12);
        y -= p * 170 * a.z * (1 - t);                       // scroll drift by depth, the only motion on the first screen
        y -= o.hv * 5 * (1 - t);
        const rot = lerp(a.r, g.r, t) + arc * (n % 2 ? 9 : -9);
        const sc = lerp(a.s, g.s, t) * (1 + o.hv * 0.035);
        const op = lerp(a.o, g.o, sstep(0.15, 0.7, t)) * ie;

        o.el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
        o.el.style.opacity = op.toFixed(3);
        if ((op < 0.04) !== o.hidden) { o.hidden = op < 0.04; o.el.style.pointerEvents = o.hidden ? 'none' : ''; }
        if (Math.abs(t - o.lastT) > 0.004) { o.lastT = t; o.el.style.setProperty('--g', t.toFixed(3)); }
        if (o.isTile) {
          const on = it >= 1 && t < 0.35;
          if (on !== o.lastOn) { o.lastOn = on; o.marks.forEach(e => e.classList.toggle(cls.on, on)); }
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  /* ───────────── go ───────────── */
  let rz = 0;
  const onResize = () => { clearTimeout(rz); rz = window.setTimeout(layout, 80); };

  const boot = () => {
    if (disposed) return;
    GL_OK = initGL();
    if (!GL_OK) glc.style.display = 'none';
    layout();
    st.t0 = st.last = performance.now();
    window.addEventListener('resize', onResize);
    startLoops();
    raf = requestAnimationFrame(frame);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(boot);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    clearTimeout(rz);
    timeouts.forEach(id => clearTimeout(id));
    timeouts.clear();
    intervals.forEach(id => clearInterval(id));
    window.removeEventListener('resize', onResize);
    objsEl.removeEventListener('pointerover', onOver);
    objsEl.removeEventListener('pointerout', onOut);
    // The GL context itself is left alone on purpose: a canvas cannot get a
    // fresh context back (React Strict Mode mounts twice in development), so
    // only the objects this run created are released.
    if (gl) {
      if (prog) gl.deleteProgram(prog);
      if (glBuf) gl.deleteBuffer(glBuf);
    }
  };
}
