// Reusable decorative rule used alongside eyebrow labels.
// Uses patriot red to match the rethemed brand palette.

export default function GoldLine() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 56,
        height: 1,
        backgroundColor: "#b22234",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );
}

/** Eyebrow label with flanking red rules */
export function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <GoldLine />
      <span className="eyebrow">{children}</span>
      <GoldLine />
    </div>
  );
}
