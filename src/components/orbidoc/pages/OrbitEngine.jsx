import { useState } from "react";
import { demoService } from "@/lib/demoService";
import { Chip, GlassCard, Meter, OrbitButton, SectionTitle } from "../ui";

export default function OrbitEngine({ onComplete }) {
  const spec = demoService.getFormatSpec();
  const stages = demoService.getFormatStages();
  const [done, setDone] = useState(-1);
  const [running, setRunning] = useState(false);

  const apply = async () => {
    setRunning(true);
    await demoService.runPhases(stages, setDone, 520);
    setRunning(false);
    onComplete();
  };

  const progress = done < 0 ? 0 : (done / stages.length) * 100;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <SectionTitle
        eyebrow="Orbit engine"
        title="Publication Formatting"
        subtitle="Raw manuscript in, publication style map out. Deterministic rules, applied identically to every page."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
        <Chip tone="muted">Raw manuscript</Chip>
        <span className="text-primary">→</span>
        <Chip tone="cyan">Structure map</Chip>
        <span className="text-primary">→</span>
        <Chip tone="violet">Style mapping</Chip>
        <span className="text-primary">→</span>
        <Chip tone="cyan">Publication orbit</Chip>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassCard>
          <h2 className="font-display text-lg">Academic publication specification</h2>
          <dl className="mt-4 divide-y divide-border/50">
            {spec.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="text-right font-mono text-xs">{s.value}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Engine stages</h2>
            <span className="font-mono text-xs text-primary">{Math.round(progress)}%</span>
          </div>
          <Meter value={progress} />
          <ol className="mt-5 space-y-3 text-sm">
            {stages.map((s, i) => (
              <li
                key={s}
                className={
                  done > i ? "text-foreground" : done === i ? "text-accent" : "text-muted-foreground/60"
                }
              >
                <span className="mr-2 font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                {s}
                {done > i ? <span className="ml-2 text-primary">✓</span> : null}
              </li>
            ))}
          </ol>
          <OrbitButton className="mt-6 w-full" disabled={running} onClick={apply}>
            {running ? "Applying…" : "Apply Publication Formatting"}
          </OrbitButton>
        </GlassCard>
      </div>
    </div>
  );
}
