const PROOF = [
  "Leads, shoots & payments in one place",
  "AI face-matching for instant discovery",
  "Same-evening delivery, during the event",
  "Originals matched — no folder-hunting",
];

export default function ProofBand() {
  return (
    <section
      style={{
        background: "var(--color-primary)",
        color: "var(--color-bg)",
        padding: "26px var(--gutter)",
      }}
      aria-label="What Vyavasth does"
    >
      <div
        className="mx-auto grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4 lg:grid-cols-4"
        style={{ maxWidth: "var(--max-w)" }}
      >
        {PROOF.map((p) => (
          <div
            key={p}
            className="flex items-center gap-3 text-sm font-medium"
            style={{ color: "rgba(245, 237, 224, 0.9)", lineHeight: 1.3 }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: "var(--color-accent)" }}
              aria-hidden
            />
            <span>{p}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
