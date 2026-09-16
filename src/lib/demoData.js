// Rich, realistic demo manuscript data for instant presentation mode.

export const DEMO_FILE = {
  name: "Quantum Computing in Distributed Systems.docx",
  sizeLabel: "4.8 MB",
  pages: 42,
  words: 18432,
  characters: 118974,
  createdBy: "Dr. A. Raghavan, Institute of Advanced Computing",
  lastModified: "2026-08-21",
};

export const SCAN_PHASES = [
  { id: "read", label: "Reading DOCX package structure", detail: "word/document.xml, styles.xml, numbering.xml" },
  { id: "typo", label: "Extracting typography features", detail: "font family, size, weight, spacing runs" },
  { id: "head", label: "Detecting headings", detail: "size deltas, bold runs, numbering patterns" },
  { id: "tab", label: "Detecting tables (asteroids)", detail: "grid spans, header rows, caption proximity" },
  { id: "fig", label: "Detecting figures & captions (comets)", detail: "inline drawings, 'Figure N.N' anchors" },
  { id: "ref", label: "Indexing references & citations", detail: "bracketed keys, bibliography block" },
  { id: "hier", label: "Mapping hierarchy (constellation)", detail: "chapter → section → subsection tree" },
  { id: "plan", label: "Composing formatting plan", detail: "style map for the Orbit Engine" },
];

export const DNA = {
  chapters: 8,
  subheadings: 34,
  figures: 21,
  tables: 12,
  references: 87,
  equations: 19,
  captions: 33,
  footnotes: 14,
  fontsDetected: ["Calibri 11pt", "Cambria 14pt bold", "Consolas 10pt"],
  paragraphStyles: 17,
  listBlocks: 23,
};

export const CONSTELLATION = [
  { id: "c1", label: "Ch. 1 Introduction", type: "planet", moons: 4, angle: 0 },
  { id: "c2", label: "Ch. 2 Qubit Models", type: "planet", moons: 5, angle: 45 },
  { id: "c3", label: "Ch. 3 Entanglement", type: "planet", moons: 6, angle: 90 },
  { id: "c4", label: "Ch. 4 Consensus", type: "planet", moons: 3, angle: 135 },
  { id: "c5", label: "Ch. 5 Error Correction", type: "planet", moons: 5, angle: 180 },
  { id: "c6", label: "Ch. 6 Simulation", type: "planet", moons: 4, angle: 225 },
  { id: "c7", label: "Ch. 7 Benchmarks", type: "planet", moons: 4, angle: 270 },
  { id: "c8", label: "Ch. 8 Conclusion", type: "planet", moons: 3, angle: 315 },
];

export const CLASSIFICATIONS = [
  {
    element: "CHAPTER 3 — ENTANGLEMENT TOPOLOGIES",
    detected: "Chapter (Planet)",
    confidence: 99,
    why: "Cambria 14pt bold, all-caps, page-break before, matches numbering pattern 'CHAPTER \\d+', isolated paragraph with 18pt space after.",
  },
  {
    element: "3.2 Bell-State Distribution",
    detected: "Subheading (Moon)",
    confidence: 97,
    why: "Decimal numbering '3.2' matching parent chapter, 12.5pt bold, left-aligned, followed by body text within 1 paragraph.",
  },
  {
    element: "Figure 3.4: Latency vs. qubit distance",
    detected: "Figure Caption (Comet)",
    confidence: 96,
    why: "Begins with 'Figure N.N', centred, 9.5pt italic, immediately follows an inline drawing anchor.",
  },
  {
    element: "Table 3.2: Gate fidelity by topology",
    detected: "Table Caption (Asteroid)",
    confidence: 95,
    why: "'Table N.N' prefix, positioned directly above a 5-column grid with a shaded header row.",
  },
  {
    element: "Distributed Coherence Window",
    detected: "Subheading (Moon)",
    confidence: 64,
    why: "Bold run but same 11pt size as body, no numbering token, ambiguous spacing — may be an inline emphasis paragraph.",
    alert: true,
  },
  {
    element: "[17] Preskill, J. (2018). Quantum computing in the NISQ era.",
    detected: "Reference Entry",
    confidence: 98,
    why: "Bracketed index key, hanging indent 0.63cm, located inside the terminal bibliography block.",
  },
  {
    element: "λ = ħ / (m·v) …",
    detected: "Equation Block",
    confidence: 88,
    why: "OMML math run, centred with tab-anchored equation number at right margin.",
  },
  {
    element: "Appendix A — Simulation Parameters",
    detected: "Chapter (Planet)",
    confidence: 71,
    why: "Bold 14pt matching chapter typography but uses alphabetic numbering; classified as chapter-level with reduced certainty.",
    alert: true,
  },
];

export const FORMAT_SPEC = [
  { label: "Body font", value: "Times New Roman 12pt" },
  { label: "Alignment", value: "Justified" },
  { label: "Line spacing", value: "1.5 lines" },
  { label: "First-line indent", value: "1.27 cm" },
  { label: "Margins (top / bottom)", value: "1.52 cm" },
  { label: "Margins (left / right)", value: "1.97 cm" },
  { label: "Gutter", value: "Left" },
  { label: "Heading 1", value: "Times New Roman 16pt bold" },
  { label: "Heading 2", value: "Times New Roman 14pt bold" },
  { label: "Captions", value: "10pt italic, centred" },
];

export const FORMAT_STAGES = [
  "Normalising paragraph styles",
  "Applying body typography (TNR 12pt / 1.5)",
  "Rebuilding heading hierarchy",
  "Re-anchoring figures & captions",
  "Reflowing tables to page width",
  "Setting margins, gutter & pagination",
  "Rebuilding cross-references",
  "Sealing publication package",
];

export const INTEGRITY = {
  beforeHash: "a3f9c1d27be40fd8e6c5b0a19d74f2c83e1b6a05",
  afterHash: "a3f9c1d27be40fd8e6c5b0a19d74f2c83e1b6a05",
  elements: [
    { label: "Paragraphs", before: 1284, after: 1284 },
    { label: "Words", before: 18432, after: 18432 },
    { label: "Figures", before: 21, after: 21 },
    { label: "Tables", before: 12, after: 12 },
    { label: "Footnotes", before: 14, after: 14 },
    { label: "References", before: 87, after: 87 },
  ],
};

export const CROSS_REFS = [
  { ref: "Figure 2.1", target: "Ch. 2 — Qubit lattice diagram", status: "resolved" },
  { ref: "Table 3.2", target: "Ch. 3 — Gate fidelity by topology", status: "resolved" },
  { ref: "Figure 5.3", target: "Ch. 5 — Surface code layout", status: "resolved" },
  { ref: "Table 6.1", target: "Ch. 6 — Simulator configurations", status: "resolved" },
  { ref: "Figure 7.4", target: "No matching caption found in manuscript", status: "missing" },
  { ref: "Equation 4.7", target: "Ch. 4 — Consensus latency bound", status: "resolved" },
];
