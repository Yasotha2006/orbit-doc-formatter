const ELEMENTS = [
  { label: "Chapter", glyph: "Planet", r: 96, a: 20, color: "var(--color-cyan-orbit)" },
  { label: "Subheading", glyph: "Moon", r: 96, a: 200, color: "var(--color-violet-orbit)" },
  { label: "Figure", glyph: "Comet", r: 148, a: 100, color: "var(--color-cyan-orbit)" },
  { label: "Table", glyph: "Asteroid", r: 148, a: 280, color: "var(--color-amber-alert)" },
  { label: "Reference", glyph: "Star", r: 196, a: 340, color: "var(--color-violet-orbit)" },
  { label: "Caption", glyph: "Dust", r: 196, a: 150, color: "var(--color-cyan-orbit)" },
];

export default function OrbitVisual({ size = 440 }) {
  const c = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[460px]"
      role="img"
      aria-label="Document universe with orbiting chapters, figures and tables"
    >
      <defs>
        <radialGradient id="core">
          <stop offset="0%" stopColor="var(--color-cyan-orbit)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-violet-orbit)" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      {[96, 148, 196].map((r) => (
        <circle
          key={r}
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="var(--color-cyan-orbit)"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
      ))}
      <g className="orbit-spin" style={{ transformOrigin: "50% 50%" }}>
        {ELEMENTS.map((e) => {
          const rad = (e.a * Math.PI) / 180;
          const x = c + e.r * Math.cos(rad);
          const y = c + e.r * Math.sin(rad);
          return (
            <g key={e.label}>
              <circle cx={x} cy={y} r="7" fill={e.color} />
              <circle cx={x} cy={y} r="14" fill={e.color} fillOpacity="0.15" />
            </g>
          );
        })}
      </g>
      <circle cx={c} cy={c} r="52" fill="url(#core)" />
      <circle cx={c} cy={c} r="52" fill="none" stroke="var(--color-cyan-orbit)" strokeOpacity="0.5" />
      <text
        x={c}
        y={c - 2}
        textAnchor="middle"
        fill="currentColor"
        className="fill-foreground font-display"
        fontSize="14"
      >
        DOCUMENT
      </text>
      <text x={c} y={c + 16} textAnchor="middle" className="fill-muted-foreground" fontSize="10">
        universe
      </text>
    </svg>
  );
}
