// demoService — simulates the offline local processing engine.
// Every function here maps 1:1 to a future REST endpoint served by the
// local Python engine (default http://127.0.0.1:8765).

import {
  CLASSIFICATIONS,
  CONSTELLATION,
  CROSS_REFS,
  DEMO_FILE,
  DNA,
  FORMAT_SPEC,
  FORMAT_STAGES,
  INTEGRITY,
  SCAN_PHASES,
} from "./demoData";

export const ENGINE_ENDPOINTS = {
  scan: "/api/engine/scan",
  dna: "/api/engine/dna",
  classify: "/api/engine/classify",
  format: "/api/engine/format",
  verify: "/api/engine/verify",
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

  async runPhases(items, onStep, stepMs = 620) {
    for (let i = 0; i < items.length; i += 1) {
      onStep(i);
      await wait(stepMs);
    }
    onStep(items.length);
  },
};

// Word-readable document generated fully client-side (no cloud, no upload).
export function buildPublicationBlob(fileName) {
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
