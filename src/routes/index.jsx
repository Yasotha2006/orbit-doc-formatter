import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Starfield from "@/components/orbidoc/Starfield";
import TopBar from "@/components/orbidoc/TopBar";
import Home from "@/components/orbidoc/pages/Home";
import Scanner from "@/components/orbidoc/pages/Scanner";
import DocumentDna from "@/components/orbidoc/pages/DocumentDna";
import StructureIntelligence from "@/components/orbidoc/pages/StructureIntelligence";
import OrbitEngine from "@/components/orbidoc/pages/OrbitEngine";
import Verification from "@/components/orbidoc/pages/Verification";
import PublicationReady from "@/components/orbidoc/pages/PublicationReady";
import { demoService } from "@/lib/demoService";

const TITLE = "ORBiDOC — From Document Chaos to Publication Orbit";
const DESCRIPTION =
  "Offline intelligent DOCX-to-publication formatting: scan structure, explain classifications, apply journal specs and verify 100% content integrity locally.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrbidocApp,
});

function OrbidocApp() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [demoMode, setDemoMode] = useState(true);
  const [file, setFile] = useState(null);

  const go = (next) => {
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
  };

  const reset = () => {
    setFile(null);
    setMaxStep(1);
    setStep(1);
  };

  return (
    <div className="min-h-screen font-sans text-foreground">
      <Starfield />
      <TopBar
        step={step}
        maxStep={maxStep}
        onStep={setStep}
        demoMode={demoMode}
        onToggleDemo={() => setDemoMode((d) => !d)}
      />

      <main>
        {step === 1 ? (
          <Home
            onUpload={() => go(2)}
            onLoadSample={() => {
              setDemoMode(true);
              setFile(demoService.getSampleFile());
              go(2);
            }}
          />
        ) : null}
        {step === 2 ? <Scanner file={file} onFile={setFile} onComplete={() => go(3)} /> : null}
        {step === 3 ? <DocumentDna demoMode={demoMode} file={file} onNext={() => go(4)} /> : null}
        {step === 4 ? <StructureIntelligence onNext={() => go(5)} /> : null}
        {step === 5 ? <OrbitEngine onComplete={() => go(6)} /> : null}
        {step === 6 && maxStep === 6 ? <Verification onNext={() => go(7)} /> : null}
        {step >= 7 || (step === 6 && maxStep > 6) ? (
          maxStep >= 7 && step >= 6 ? <PublicationReady file={file} onReset={reset} /> : null
        ) : null}
      </main>

      <footer className="border-t border-border/50 px-5 py-8 text-center font-mono text-[11px] text-muted-foreground">
        ORBiDOC · offline local processing · no cloud AI · ready to pair with a local Python engine
      </footer>
    </div>
  );
}
