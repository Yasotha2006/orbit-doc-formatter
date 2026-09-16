import { demoService } from "@/lib/demoService";
import { Chip, GlassCard, OrbitButton, SectionTitle } from "../ui";

export default function Verification({ onNext }) {
  const integrity = demoService.getIntegrity();
  const refs = demoService.getCrossRefs();
  const missing = refs.filter((r) => r.status === "missing");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <SectionTitle
        eyebrow="Content guardian"
        title="Document Verification"
        subtitle="Before/after integrity check plus cross-reference sweep — nothing silently disappears in the formatting orbit."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Lost Element Detector</h2>
            <Chip tone="cyan">100% text preserved</Chip>
          </div>

          <div className="mt-4 space-y-2 font-mono text-[11px] break-all text-muted-foreground">
            <p>
              before sha1 <span className="text-foreground">{integrity.beforeHash}</span>
            </p>
            <p>
              after&nbsp; sha1 <span className="text-foreground">{integrity.afterHash}</span>
            </p>
            <p className="text-primary">content hash match — no text mutation detected</p>
          </div>

          <table className="mt-5 w-full text-left text-sm">
            <thead className="font-mono text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Element</th>
                <th className="py-2">Before</th>
                <th className="py-2">After</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {integrity.elements.map((e) => (
                <tr key={e.label} className="border-t border-border/40">
                  <td className="py-2">{e.label}</td>
                  <td className="py-2 font-mono text-xs">{e.before}</td>
                  <td className="py-2 font-mono text-xs">{e.after}</td>
                  <td className="py-2 text-primary">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Cross-Reference Guardian</h2>
            <Chip tone={missing.length ? "amber" : "cyan"}>{missing.length} unresolved</Chip>
          </div>

          <ul className="mt-5 space-y-3">
            {refs.map((r) => (
              <li
                key={r.ref}
                className="flex items-start justify-between gap-4 rounded-lg border border-border/50 px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm">{r.ref}</p>
                  <p className="text-xs text-muted-foreground">{r.target}</p>
                </div>
                {r.status === "resolved" ? (
                  <Chip tone="cyan">Resolved</Chip>
                ) : (
                  <Chip tone="danger">Missing citation</Chip>
                )}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <OrbitButton className="mt-8" onClick={onNext}>
        Proceed to Publication Orbit
      </OrbitButton>
    </div>
  );
}
