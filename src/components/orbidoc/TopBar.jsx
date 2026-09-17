import { cn } from "@/lib/utils";
import { Chip } from "./ui";

export const STEPS = [
  { id: 1, label: "Upload" },
  { id: 2, label: "Scan" },
  { id: 3, label: "Understand" },
  { id: 4, label: "Format" },
  { id: 5, label: "Verify" },
  { id: 6, label: "Research Integrity" },
  { id: 7, label: "Export" },
];

export default function TopBar({ step, maxStep, onStep, demoMode, onToggleDemo }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-4">
        <button
          onClick={() => onStep(1)}
          className="font-display text-lg font-semibold tracking-tight"
          aria-label="ORBiDOC home"
        >
          ORB<span className="text-primary">i</span>DOC
        </button>

        <Chip tone="cyan" className="hidden sm:inline-flex">
          <span className="text-primary">●</span> Offline Intelligence | Local Processing Active | No Cloud AI
        </Chip>

        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wide">Demo mode</span>
          <span
            role="switch"
            aria-checked={demoMode}
            tabIndex={0}
            onClick={onToggleDemo}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggleDemo()}
            className={cn(
              "relative h-5 w-10 rounded-full border transition-colors",
              demoMode ? "border-primary/50 bg-primary/30" : "border-border bg-secondary",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-foreground transition-all",
                demoMode ? "left-5" : "left-0.5",
              )}
            />
          </span>
        </label>
      </div>

      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-3">
        {STEPS.map((s) => {
          const reachable = s.id <= maxStep;
          const active = s.id === step;
          return (
            <button
              key={s.id}
              disabled={!reachable}
              onClick={() => onStep(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                active
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : reachable
                    ? "border-border text-muted-foreground hover:bg-secondary/60"
                    : "border-border/40 text-muted-foreground/40",
              )}
            >
              <span className="font-mono">{s.id}</span>
              {s.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
