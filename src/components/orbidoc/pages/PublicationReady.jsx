import { useState } from "react";
import { buildPublicationBlob, demoService, downloadBlob } from "@/lib/demoService";
import { Chip, GlassCard, OrbitButton, SectionTitle } from "../ui";

export default function PublicationReady({ file, onReset }) {
  const [showCert, setShowCert] = useState(false);
  const integrity = demoService.getIntegrity();
  const name = (file?.name ?? "manuscript.docx").replace(/\.docx$/i, "");

  const download = () => {
    downloadBlob(buildPublicationBlob(name), `${name} — ORBiDOC publication ready.docx`);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 text-center">
      <SectionTitle
        eyebrow="Milestone"
        title="Publication Orbit Reached"
        subtitle="Your manuscript is formatted to specification with verified content integrity — generated entirely on this machine."
      />

      <GlassCard className="mx-auto max-w-2xl text-left">
        <div className="flex flex-wrap gap-2">
          <Chip tone="cyan">Formatting applied</Chip>
          <Chip tone="cyan">Integrity verified</Chip>
          <Chip tone="amber">1 citation to review</Chip>
        </div>
        <p className="mt-5 font-mono text-sm">{name}.docx</p>
        <p className="text-xs text-muted-foreground">
          Times New Roman 12pt · justified · 1.5 spacing · 1.27cm indent · 1.52/1.97cm margins · gutter left
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <OrbitButton onClick={download}>Download publication-ready .docx</OrbitButton>
          <OrbitButton variant="ghost" onClick={() => setShowCert(true)}>
            View verification certificate
          </OrbitButton>
          <OrbitButton variant="ghost" onClick={onReset}>
            Start a new mission
          </OrbitButton>
        </div>
      </GlassCard>

      {showCert ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCert(false)}
        >
          <GlassCard className="max-h-[80vh] w-full max-w-lg overflow-y-auto text-left" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl">ORBiDOC Verification Certificate</h2>
            <p className="mt-1 text-xs text-muted-foreground">Issued offline · local processing engine</p>
            <dl className="mt-5 space-y-2 font-mono text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Document</dt>
                <dd className="text-right">{name}.docx</dd>
              </div>
              <div className="flex justify-between gap-4 break-all">
                <dt className="text-muted-foreground">Content hash</dt>
                <dd className="text-right">{integrity.afterHash}</dd>
              </div>
              {integrity.elements.map((e) => (
                <div key={e.label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{e.label}</dt>
                  <dd>
                    {e.before} → {e.after} ✓
                  </dd>
                </div>
              ))}
            </dl>
            <OrbitButton className="mt-6 w-full" onClick={() => setShowCert(false)}>
              Close
            </OrbitButton>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
