import { useMemo, useState } from "react";
import { demoService } from "@/lib/demoService";
import { Chip, GlassCard, OrbitButton, SectionTitle } from "../ui";

const MARK = { pass: "✓", review: "⚠", fail: "✕" };
const TONE = { pass: "cyan", review: "amber", fail: "danger" };
const TEXT = { pass: "text-primary", review: "text-chart-3", fail: "text-destructive" };

function Status({ status, children }) {
  return (
    <span className={`font-mono text-xs ${TEXT[status]}`}>
      {MARK[status]} {children}
    </span>
  );
}

function ShieldMark() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0" aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeOpacity="0.15" />
      <ellipse cx="60" cy="60" rx="52" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.2" />
      <path
        d="M60 22 L88 34 V62 C88 80 74 92 60 98 C46 92 32 80 32 62 V34 Z"
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeOpacity="0.55"
      />
      <path d="M48 60 L57 69 L74 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ResearchIntegrity({ demoMode, onNext }) {
  const { report, refs, checklist, issues } = useMemo(
    () => demoService.buildPrecheckSummary(demoService.getPrecheck()),
    [],
  );
  const [showIssues, setShowIssues] = useState(false);
  const reviewCount = issues.length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <SectionTitle
        eyebrow="Research integrity"
        title="Research Integrity Pre-Check"
        subtitle="One final check before your manuscript reaches publication."
      />

      {demoMode || report.source === "demo" ? (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Chip tone="amber">Demo mode</Chip>
          <p className="text-xs text-muted-foreground">
            Sample results are being displayed. Connect the local processing engine for real DOCX analysis.
          </p>
        </div>
      ) : null}

      <GlassCard className="mb-6 flex flex-wrap items-center gap-6 text-primary">
        <ShieldMark />
        <p className="max-w-xl text-sm text-muted-foreground">
          ORBiDOC does not judge or rewrite your research. It checks the document itself — typography, placement,
          references and preservation — before you download the publication-ready file.
        </p>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-display text-lg">1 · Formatting consistency</h2>
          <ul className="mt-4 divide-y divide-border/40">
            {report.formatting.map((f) => (
              <li key={f.label} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
                <div>
                  <p className="text-sm">{f.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">Expected: {f.expected}</p>
                </div>
                <Status status={f.status}>{f.note}</Status>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-lg">2 · Figure &amp; table placement</h2>
          <ul className="mt-4 space-y-3">
            {report.placement.map((p) => (
              <li key={p.label} className="rounded-lg border border-border/50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-sm">{p.label}</p>
                  <Chip tone={TONE[p.status]}>{p.status === "pass" ? "Verified" : "Needs review"}</Chip>
                </div>
                <ul className="mt-2 space-y-1">
                  {p.checks.map((c, i) => (
                    <li key={c} className="text-xs text-muted-foreground">
                      <span className={TEXT[i === p.checks.length - 1 ? p.status : "pass"]}>
                        {MARK[i === p.checks.length - 1 ? p.status : "pass"]}
                      </span>{" "}
                      {c}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-lg">3 · Cross-reference validation</h2>
          <p className="mt-1 text-xs text-muted-foreground">From the Cross-Reference Guardian.</p>
          <ul className="mt-4 divide-y divide-border/40">
            {refs.map((r) => (
              <li key={r.ref} className="flex items-center justify-between gap-3 py-2.5">
                <span className="font-mono text-sm">{r.ref}</span>
                <Status status={r.status}>{r.status === "pass" ? "Found" : "Target missing"}</Status>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-lg">4 · Element preservation</h2>
          <p className="mt-1 text-xs text-muted-foreground">From the Lost Element Detector.</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6">
            {report.preservation.map((p) => (
              <li key={p.label} className="flex items-center justify-between gap-3 border-b border-border/40 py-2">
                <span className="text-sm">{p.label}</span>
                <Status status={p.status}>{p.status === "pass" ? "Preserved" : "Review"}</Status>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="font-display text-lg">5 · Content preservation</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Formatting can change appearance. Formatting must not change authorship.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Chip tone={TONE[report.content.status]}>
              {report.content.status === "pass" ? "Content preserved" : "Content difference detected"}
            </Chip>
            <p className="text-sm text-muted-foreground">{report.content.note}</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          External submission checks
        </h2>
        <div className="mt-3 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
          <p>
            <span className="text-foreground">Originality / plagiarism:</span> ORBiDOC does not modify or judge
            authorship. Use your institution-approved originality checker when required.
          </p>
          <p>
            <span className="text-foreground">AI-content detection:</span> AI-content detection is not part of
            ORBiDOC&rsquo;s document formatting engine.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="mt-6">
        <h2 className="font-display text-lg">Research integrity checklist</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {checklist.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm">
              <span className={`font-mono ${TEXT[c.status]}`}>[{MARK[c.status]}]</span>
              {c.label}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {reviewCount ? (
            <>
              <Chip tone="amber">
                [⚠] {reviewCount} item{reviewCount > 1 ? "s" : ""} require review
              </Chip>
              <OrbitButton variant="ghost" onClick={() => setShowIssues((v) => !v)}>
                {showIssues ? "Hide issues" : "Review Issues"}
              </OrbitButton>
            </>
          ) : (
            <Chip tone="cyan">[✓] Document ready for final review</Chip>
          )}
          <OrbitButton onClick={onNext}>Continue to Publication</OrbitButton>
        </div>

        {showIssues && reviewCount ? (
          <ul className="mt-6 divide-y divide-border/40">
            {issues.map((i, idx) => (
              <li key={idx} className="py-4">
                <p className={`font-mono text-xs ${TEXT[i.status]}`}>
                  {MARK[i.status]} {i.kind}
                </p>
                <p className="mt-1 text-sm">{i.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">Location: {i.location}</p>
                <p className="text-xs text-muted-foreground">Action: {i.action}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </GlassCard>
    </div>
  );
}
