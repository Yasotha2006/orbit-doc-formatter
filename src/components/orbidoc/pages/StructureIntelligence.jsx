import { demoService } from "@/lib/demoService";
import { Chip, GlassCard, OrbitButton, SectionTitle } from "../ui";

export default function StructureIntelligence({ onNext }) {
  const rows = demoService.getClassifications();
  const alerts = rows.filter((r) => r.alert).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <SectionTitle
        eyebrow="Explainable"
        title="Structure Intelligence"
        subtitle="Every classification shows the exact typographic and positional signals behind it — no black box."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Chip tone="cyan">{rows.length} elements sampled</Chip>
        <Chip tone={alerts ? "amber" : "muted"}>{alerts} orbit alerts</Chip>
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border/70 font-mono text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Element</th>
              <th className="px-5 py-4">Detected type</th>
              <th className="px-5 py-4">Confidence</th>
              <th className="px-5 py-4">Why classified</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.element} className="border-b border-border/40 last:border-0 align-top">
                <td className="px-5 py-4 font-medium">
                  {r.element}
                  {r.alert ? (
                    <div className="mt-2">
                      <Chip tone="amber">⚠ Orbit alert — review</Chip>
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{r.detected}</td>
                <td className="px-5 py-4">
                  <span
                    className={
                      r.confidence >= 90
                        ? "font-mono text-primary"
                        : r.confidence >= 75
                          ? "font-mono text-chart-3"
                          : "font-mono text-destructive"
                    }
                  >
                    {r.confidence}%
                  </span>
                </td>
                <td className="max-w-md px-5 py-4 text-xs text-muted-foreground">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <OrbitButton className="mt-8" onClick={onNext}>
        Continue to Orbit Engine
      </OrbitButton>
    </div>
  );
}
