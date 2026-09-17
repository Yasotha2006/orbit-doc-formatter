import { useRef, useState } from "react";
import { demoService } from "@/lib/demoService";
import { analyzeDocx } from "@/lib/docxFormatter";
import { Chip, GlassCard, Meter, OrbitButton, SectionTitle } from "../ui";

export default function Scanner({ file, onFile, onComplete }) {
  const phases = demoService.getScanPhases();
  const [done, setDone] = useState(-1);
  const [running, setRunning] = useState(false);
  const inputRef = useRef(null);

  const [error, setError] = useState("");

  const pick = async (f) => {
    if (!f) return;
    setError("");
    const base = {
      name: f.name,
      sizeLabel: `${(f.size / 1048576).toFixed(1)} MB`,
      pages: "—",
      words: "—",
      characters: "—",
      createdBy: "Local file",
      lastModified: new Date(f.lastModified).toISOString().slice(0, 10),
    };
    try {
      const bytes = await f.arrayBuffer();
      const analysis = analyzeDocx(bytes);
      onFile({
        ...base,
        bytes,
        analysis,
        pages: analysis.pages,
        words: analysis.words,
        characters: analysis.characters,
      });
    } catch {
      setError("That file could not be read as a .docx package. Please choose a Word .docx file.");
      onFile(base);
    }
  };

  const scan = async () => {
    setRunning(true);
    await demoService.runPhases(phases, setDone);
    setRunning(false);
    onComplete();
  };

  const progress = done < 0 ? 0 : (done / phases.length) * 100;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <SectionTitle
        eyebrow="Telescope"
        title="Manuscript Scanner"
        subtitle="Point the telescope at your .docx. ORBiDOC reads the package structure locally and extracts every typographic signal it needs."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassCard>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pick(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/35 bg-primary/5 px-6 py-14 text-center"
          >
            <span className="font-display text-lg">Drop your .docx here</span>
            <span className="text-xs text-muted-foreground">or click to browse — the file never leaves this machine</span>
            <input
              ref={inputRef}
              type="file"
              accept=".docx"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>

          {error ? <p className="mt-4 text-xs text-destructive">{error}</p> : null}

          {file ? (
            <div className="mt-5 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap gap-2">
                <Chip tone="cyan">{file.name}</Chip>
                <Chip tone="muted">{file.sizeLabel}</Chip>
                <Chip tone="muted">{file.pages} pages</Chip>
              </div>
              <p className="text-muted-foreground">Last modified {file.lastModified} · {file.createdBy}</p>
            </div>
          ) : null}

          <OrbitButton className="mt-6 w-full" disabled={!file || running} onClick={scan}>
            {running ? "Scanning…" : "Begin Telescope Scan"}
          </OrbitButton>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Scan phases</h2>
            <span className="font-mono text-xs text-primary">{Math.round(progress)}%</span>
          </div>
          <Meter value={progress} />
          <ol className="mt-5 space-y-3">
            {phases.map((p, i) => {
              const state = done > i ? "done" : done === i ? "active" : "idle";
              return (
                <li key={p.id} className="flex gap-3">
                  <span
                    className={
                      state === "done"
                        ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                        : state === "active"
                          ? "mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent"
                          : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary"
                    }
                  />
                  <div>
                    <p className={state === "idle" ? "text-sm text-muted-foreground/60" : "text-sm"}>{p.label}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{p.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </GlassCard>
      </div>
    </div>
  );
}
