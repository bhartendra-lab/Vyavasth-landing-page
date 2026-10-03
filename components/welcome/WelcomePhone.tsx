import Image from "next/image";
import { HERO_GUEST, HERO_TILES, type HeroTile } from "@/lib/landing-content";
import styles from "./WelcomePhone.module.css";

const tile = (id: HeroTile["id"]) => HERO_TILES.find((t) => t.id === id) as HeroTile;

// The two columns of the phone's grid, top to bottom, with the same aspect
// ratios as the hero (3:4, 1:1, 4:3 ...), because the layout depends on them.
const COLUMNS: Array<Array<{ id: HeroTile["id"]; ratio: string }>> = [
  [{ id: "haldi", ratio: "3/4" }, { id: "dadi", ratio: "1" }, { id: "mehendi", ratio: "4/3" }],
  [{ id: "sangeet", ratio: "4/3" }, { id: "varmala", ratio: "3/4" }, { id: "baraat", ratio: "1" }],
];

/**
 * A still of the hero's phone gallery: a guest's "For you" tab with the
 * placeholder wedding photos. Decorative, cropped and faded by its wrapper.
 */
export default function WelcomePhone() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.phone}>
        <div className={styles.bezel} />
        <div className={styles.screen}>
          <div className={styles.island} />
          <div className={styles.hd}>
            <div className={styles.row}>
              <span className={styles.brand}>
                <span className={styles.ap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="9.2" /><path d="M12 2.8l4.6 8M21 10.4h-9.2M19.4 17.5l-4.6-8M12 21.2l-4.6-8M3 13.6h9.2M4.6 6.5l4.6 8" /></svg>
                </span>
                <b>Your Studio</b>
              </span>
              <span className={styles.ava}>
                <Image src={HERO_GUEST.src} alt="" fill sizes="24px" unoptimized />
              </span>
            </div>
            <div className={styles.ttl}>
              Riya <em>&amp;</em> Arjun
            </div>
            <div className={styles.chip}>
              <span className={styles.ok}>
                <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3.2 8.4l3.1 3.1 6.5-7" /></svg>
              </span>
              <span><b>128</b> photos of you</span>
            </div>
            <div className={styles.tabs}>
              <span className={styles.on}>For you</span>
              <span>All photos</span>
              <span>Haldi</span>
              <span>Sangeet</span>
            </div>
          </div>
          <div className={styles.grid}>
            {COLUMNS.map((col, i) => (
              <div className={styles.col} key={i}>
                {col.map(({ id, ratio }) => (
                  <div className={styles.tile} key={id} style={{ aspectRatio: ratio }}>
                    <Image src={tile(id).src} alt="" fill sizes="90px" unoptimized />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
