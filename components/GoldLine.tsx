// Reusable decorative gold horizontal rule used alongside eyebrow labels.
// Usage: <GoldLine /> renders a 56×1 px warm-gold bar.

export default function GoldLine() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 56,
        height: 1,
        backgroundColor: "#c9a45e",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );
}

/** Eyebrow label with flanking gold rules */
export function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <GoldLine />
      <span className="eyebrow">{children}</span>
      <GoldLine />
    </div>
  );
}
