/** Section label: short terracotta rule + uppercase text. */
export default function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.08em]"
      style={{
        color: light ? "var(--color-accent-soft)" : "var(--color-accent)",
      }}
    >
      <span
        className="h-0.5 w-[26px] rounded-full"
        style={{ background: "var(--color-accent)" }}
        aria-hidden
      />
      {children}
    </span>
  );
}
