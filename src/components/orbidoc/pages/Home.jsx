import OrbitVisual from "../OrbitVisual";
import { Chip, GlassCard, OrbitButton } from "../ui";

const PILLARS = [
  {
    tag: "Offline",
    title: "Local intelligence",
    body: "Every scan, classification and format pass runs on your machine. No upload, no cloud model, no data leaving the desk.",
  },
  {
    tag: "Content safe",
    title: "Nothing is lost",
    body: "Cryptographic before/after checks confirm every paragraph, figure, table and reference survives the formatting orbit.",
  },
  {
    tag: "Publication ready",
    title: "Journal-grade styling",
    body: "Times New Roman 12pt, justified, 1.5 spacing, exact margins and gutter — applied consistently across 400+ pages.",
  },
];

export default function Home({ onUpload, onLoadSample }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-7">
          <Chip tone="violet">Mission control for manuscripts</Chip>
          <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight sm:text-6xl">
            From Document Chaos to <span className="text-primary">Publication Orbit</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            ORBiDOC reads a raw .docx manuscript, maps its structure like a star chart, and applies a
            precise publication format — entirely offline, with verifiable content integrity.
          </p>
          <div className="flex flex-wrap gap-3">
            <OrbitButton onClick={onUpload}>Upload Manuscript</OrbitButton>
            <OrbitButton variant="ghost" onClick={onLoadSample}>
              Load Sample 42-page Manuscript
            </OrbitButton>
          </div>
          <dl className="grid grid-cols-3 gap-4 pt-2 font-mono text-xs text-muted-foreground">
            <div>
              <dt>Benchmark</dt>
              <dd className="text-foreground">400+ pages</dd>
            </div>
            <div>
              <dt>Content preserved</dt>
              <dd className="text-foreground">100%</dd>
            </div>
            <div>
              <dt>Cloud calls</dt>
              <dd className="text-foreground">0</dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-center">
          <OrbitVisual />
        </div>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {PILLARS.map((p) => (
          <GlassCard key={p.tag}>
            <Chip tone="cyan">{p.tag}</Chip>
            <h2 className="mt-4 font-display text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
