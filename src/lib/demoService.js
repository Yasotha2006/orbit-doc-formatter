// demoService — simulates the offline local processing engine.
// Every function here maps 1:1 to a future REST endpoint served by the
// local Python engine (default http://127.0.0.1:8765).

import { buildDocx } from "./docxBuilder";
import {
  CLASSIFICATIONS,
  CONSTELLATION,
  CROSS_REFS,
  DEMO_FILE,
  DNA,
  FORMAT_SPEC,
  FORMAT_STAGES,
  INTEGRITY,
  PRECHECK,
  SCAN_PHASES,
} from "./demoData";

export const ENGINE_ENDPOINTS = {
  scan: "/api/engine/scan",
  dna: "/api/engine/dna",
  classify: "/api/engine/classify",
  format: "/api/engine/format",
  verify: "/api/engine/verify",
  precheck: "/api/engine/precheck",
  export: "/api/engine/export",
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoService = {
  getSampleFile: () => ({ ...DEMO_FILE }),
  getScanPhases: () => SCAN_PHASES,
  getDna: () => DNA,
  getConstellation: () => CONSTELLATION,
  getClassifications: () => CLASSIFICATIONS,
  getFormatSpec: () => FORMAT_SPEC,
  getFormatStages: () => FORMAT_STAGES,
  getIntegrity: () => INTEGRITY,
  getCrossRefs: () => CROSS_REFS,

  // Returns the pre-check report. When a local engine is connected this should
  // call ENGINE_ENDPOINTS.precheck; until then the demo report is returned and
  // flagged with source: "demo" so the UI never presents it as real analysis.
  getPrecheck: () => PRECHECK,

  // Derives the checklist + issue list from a pre-check report plus the
  // existing Cross-Reference Guardian and Lost Element Detector results.
  buildPrecheckSummary(report = PRECHECK) {
    const refs = CROSS_REFS.map((r) => ({
      ...r,
      status: r.status === "resolved" ? "pass" : "review",
    }));

    const worst = (items) => (items.some((i) => i.status === "fail") ? "fail" : items.some((i) => i.status === "review") ? "review" : "pass");
    const headings = report.formatting.filter((f) => f.label.startsWith("Heading"));
    const captions = report.placement.filter((p) => /caption/i.test(p.checks.join(" ")));

    const checklist = [
      { label: "Formatting consistency", status: worst(report.formatting) },
      { label: "Heading hierarchy", status: worst(headings) },
      { label: "Figure placement", status: worst(report.placement.filter((p) => /figure/i.test(p.label))) },
      { label: "Table placement", status: worst(report.placement.filter((p) => /table/i.test(p.label))) },
      { label: "Caption consistency", status: worst(captions) },
      { label: "Cross-reference validation", status: worst(refs) },
      { label: "Content preservation", status: report.content.status },
      { label: "Element preservation", status: worst(report.preservation) },
    ];

    const issues = [];
    report.formatting
      .filter((f) => f.status !== "pass")
      .forEach((f) =>
        issues.push({
          kind: "Formatting Issue",
          detail: `${f.label}: ${f.note}`,
          location: f.page ? `Page ${f.page}` : "Document-wide",
          action: "Review formatting",
          status: f.status,
        }),
      );
    refs
      .filter((r) => r.status !== "pass")
      .forEach((r) =>
        issues.push({
          kind: "Cross-Reference Issue",
          detail: `"${r.ref}" is referenced but the corresponding object could not be found.`,
          location: r.target,
          action: "Review reference",
          status: r.status,
        }),
      );
    report.placement
      .filter((p) => p.status !== "pass")
      .forEach((p) =>
        issues.push({
          kind: "Layout Issue",
          detail: `${p.label}: ${p.checks[p.checks.length - 1]}.`,
          location: p.page ? `Page ${p.page}` : "Unknown page",
          action: "Review placement",
          status: p.status,
        }),
      );
    report.preservation
      .filter((p) => p.status !== "pass")
      .forEach((p) =>
        issues.push({
          kind: "Element Issue",
          detail: `${p.label} could not be confirmed as preserved.`,
          location: "Document-wide",
          action: "Review element",
          status: p.status,
        }),
      );
    if (report.content.status !== "pass") {
      issues.push({
        kind: "Content Difference",
        detail: report.content.note,
        location: "Document-wide",
        action: "Review content",
        status: report.content.status,
      });
    }

    return { report, refs, checklist, issues };
  },

  async runPhases(items, onStep, stepMs = 620) {
    for (let i = 0; i < items.length; i += 1) {
      onStep(i);
      await wait(stepMs);
    }
    onStep(items.length);
  },
};

// Real OOXML .docx generated fully client-side (no cloud, no upload).
export function buildPublicationBlob(fileName) {
  const title = fileName.replace(/\.docx$/i, "");
  return buildDocx(title, [
    { text: title, style: "Heading1" },
    { text: "Formatted by ORBiDOC Orbit Engine — offline local processing, no cloud AI." },
    { text: "1. Publication Specification Applied", style: "Heading2" },
    {
      text: "Times New Roman 12pt, justified, 1.5 line spacing, 1.27cm first-line indent, margins 1.52cm top and bottom, 1.97cm left and right, gutter left, Heading 1 at 16pt bold.",
    },
    { text: "Figure 1: Structure preserved at 100% content integrity.", style: "Caption" },
  ]);
}

// Legacy HTML preview builder (kept for reference; not used for export).
export function buildPublicationHtml(fileName) {
  const title = fileName.replace(/\.docx$/i, "");
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">
<style>
@page { size: 21cm 29.7cm; margin: 1.52cm 1.97cm; }
body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; text-align: justify; }
p { text-indent: 1.27cm; margin: 0 0 6pt 0; }
h1 { font-size: 16pt; font-weight: bold; }
h2 { font-size: 14pt; font-weight: bold; }
.caption { font-size: 10pt; font-style: italic; text-align: center; text-indent: 0; }
</style></head><body>
<h1>${title}</h1>
<p>Formatted by ORBiDOC Orbit Engine — offline local processing, no cloud AI.</p>
<h2>1. Publication Specification Applied</h2>
<p>Times New Roman 12pt, justified, 1.5 line spacing, 1.27cm first-line indent,
margins 1.52cm top and bottom, 1.97cm left and right, gutter left,
Heading 1 at 16pt bold.</p>
<p class="caption">Figure 1: Structure preserved at 100% content integrity.</p>
</body></html>`;
  return new Blob(["\ufeff", html], { type: "application/vnd.ms-word" });
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
