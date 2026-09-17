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
import ResearchIntegrity from "@/components/orbidoc/pages/ResearchIntegrity";
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

const STAGE_TO_STEP = { 1: 1, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 };
const STEP_TO_STAGE = { 1: 1, 2: 2, 3: 3, 4: 5, 5: 6, 6: 7, 7: 8 };

function OrbidocApp() {
  const [stage, setStage] = useState(1);
  const [maxStage, setMaxStage] = useState(1);
  const [demoMode, setDemoMode] = useState(true);
  const [file, setFile] = useState(null);

  const go = (next) => {
    setStage(next);
    setMaxStage((m) => Math.max(m, next));
  };

  const reset = () => {
    setFile(null);
    setMaxStage(1);
    setStage(1);
  };

  return (
    <div className="min-h-screen font-sans text-foreground">
      <Starfield />
      <TopBar
        step={STAGE_TO_STEP[stage]}
        maxStep={STAGE_TO_STEP[maxStage]}
        onStep={(s) => setStage(STEP_TO_STAGE[s])}
        demoMode={demoMode}
        onToggleDemo={() => setDemoMode((d) => !d)}
      />

      <main>
        {stage === 1 ? (
          <Home
            onUpload={() => go(2)}
            onLoadSample={() => {
              setDemoMode(true);
              setFile(demoService.getSampleFile());
              go(2);
            }}
          />
        ) : null}
        {stage === 2 ? <Scanner file={file} onFile={setFile} onComplete={() => go(3)} /> : null}
        {stage === 3 ? <DocumentDna demoMode={demoMode} file={file} onNext={() => go(4)} /> : null}
        {stage === 4 ? <StructureIntelligence onNext={() => go(5)} /> : null}
        {stage === 5 ? <OrbitEngine onComplete={() => go(6)} /> : null}
        {stage === 6 ? <Verification onNext={() => go(7)} /> : null}
        {stage === 7 ? <ResearchIntegrity demoMode={demoMode} onNext={() => go(8)} /> : null}
        {stage === 8 ? <PublicationReady file={file} onReset={reset} /> : null}
      </main>


      <footer className="border-t border-border/50 px-5 py-8 text-center font-mono text-[11px] text-muted-foreground">
        ORBiDOC · offline local processing · no cloud AI · ready to pair with a local Python engine
      </footer>
    </div>
  );
}
