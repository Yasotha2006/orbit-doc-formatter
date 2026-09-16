import { demoService } from "@/lib/demoService";
import { Chip, GlassCard, OrbitButton, SectionTitle } from "../ui";

function Constellation() {
  const nodes = demoService.getConstellation();
  const size = 460;
  const c = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="Document constellation map">
      <circle cx={c} cy={c} r="150" fill="none" stroke="var(--color-violet-orbit)" strokeOpacity="0.2" />
      <circle cx={c} cy={c} r="200" fill="none" stroke="var(--color-cyan-orbit)" strokeOpacity="0.15" />
      {nodes.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = c + 150 * Math.cos(rad);
        const y = c + 150 * Math.sin(rad);
        return (
          <g key={n.id}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="var(--color-cyan-orbit)" strokeOpacity="0.18" />
            <circle cx={x} cy={y} r="11" fill="var(--color-cyan-orbit)" fillOpacity="0.85" />
            {Array.from({ length: n.moons }).map((_, i) => {
              const mr = (i / n.moons) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={x + 24 * Math.cos(mr)}
                  cy={y + 24 * Math.sin(mr)}
                  r="3"
                  fill="var(--color-violet-orbit)"
                />
              );
            })}
            <text
              x={x}
              y={y - 20}
              textAnchor="middle"
              fontSize="9"
              className="fill-muted-foreground font-mono"
            >
              {n.label}
            </text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r="40" fill="var(--color-violet-orbit)" fillOpacity="0.25" />
      <circle cx={c} cy={c} r="40" fill="none" stroke="var(--color-cyan-orbit)" strokeOpacity="0.6" />
      <text x={c} y={c + 4} textAnchor="middle" fontSize="11" className="fill-foreground font-display">
        UNIVERSE
      </text>
    </svg>
  );
}

export default function DocumentDna({ demoMode, file, onNext }) {
  const dna = demoService.getDna();
  const stats = [
    { label: "Chapters (Planets)", value: dna.chapters },
    { label: "Subheadings (Moons)", value: dna.subheadings },
    { label: "Figures (Comets)", value: dna.figures },
    { label: "Tables (Asteroids)", value: dna.tables },
    { label: "References", value: dna.references },
    { label: "Equations", value: dna.equations },
    { label: "Captions", value: dna.captions },
    { label: "Footnotes", value: dna.footnotes },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <SectionTitle
        eyebrow="Constellation"
        title="Document DNA"
        subtitle={`Structural fingerprint of ${file?.name ?? "your manuscript"} — every element mapped to its orbit.`}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {demoMode ? <Chip tone="amber">Demo data</Chip> : <Chip tone="cyan">Live local scan</Chip>}
        <Chip tone="violet">400+ page benchmark ready</Chip>
        <Chip tone="muted">{dna.paragraphStyles} paragraph styles</Chip>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassCard className="flex items-center justify-center">
          <Constellation />
        </GlassCard>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-5">
              <p className="font-display text-3xl text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </GlassCard>
          ))}
          <GlassCard className="col-span-2 p-5">
            <p className="text-xs text-muted-foreground">Fonts detected</p>
            <p className="mt-2 font-mono text-sm">{dna.fontsDetected.join("  ·  ")}</p>
          </GlassCard>
        </div>
      </div>

      <OrbitButton className="mt-8" onClick={onNext}>
        Open Structure Intelligence
      </OrbitButton>
    </div>
  );
}
