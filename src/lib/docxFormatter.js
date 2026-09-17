// Real .docx analysis + publication formatting, performed entirely in the browser.
// The original package is unzipped, its document.xml is re-styled in place (so all
// author content, tables, images and references are preserved byte-for-byte except
// for formatting properties), then re-zipped.

import { unzipSync, zipSync, strToU8, strFromU8 } from "fflate";

const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

// Publication specification (twips: 1 cm = 566.93 twips, 1 pt = 20 twips)
export const SPEC = {
  font: "Times New Roman",
  bodyHalfPoints: 24, // 12 pt
  h1HalfPoints: 32, // 16 pt
  h2HalfPoints: 28, // 14 pt
  captionHalfPoints: 20, // 10 pt
  line: 360, // 1.5 lines
  firstLine: 720, // 1.27 cm
  marginTopBottom: 862, // 1.52 cm
  marginLeftRight: 1117, // 1.97 cm
  gutter: 284, // 0.5 cm, left
};

const el = (doc, name) => doc.createElementNS(W, `w:${name}`);
const setAttr = (node, name, value) => node.setAttributeNS(W, `w:${name}`, value);
const first = (parent, name) => {
  const list = parent.getElementsByTagNameNS(W, name);
  for (let i = 0; i < list.length; i += 1) if (list[i].parentNode === parent) return list[i];
  return null;
};
const ensure = (doc, parent, name, prepend = false) => {
  const found = first(parent, name);
  if (found) return found;
  const node = el(doc, name);
  if (prepend && parent.firstChild) parent.insertBefore(node, parent.firstChild);
  else parent.appendChild(node);
  return node;
};
const removeAll = (parent, name) => {
  const list = parent.getElementsByTagNameNS(W, name);
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const n = list[i];
    if (n.parentNode === parent) n.parentNode.removeChild(n);
  }
};

function paragraphText(p) {
  const runs = p.getElementsByTagNameNS(W, "t");
  let text = "";
  for (let i = 0; i < runs.length; i += 1) text += runs[i].textContent;
  return text.trim();
}

function styleIdOf(p) {
  const pPr = first(p, "pPr");
  if (!pPr) return "";
  const s = first(pPr, "pStyle");
  return s ? s.getAttributeNS(W, "val") || s.getAttribute("w:val") || "" : "";
}

const CAPTION_RE = /^(figure|fig\.|table|chart|scheme|equation)\s*\d+([.\-:]\d+)*\s*[.:—-]?/i;
const NUM_HEADING_RE = /^(chapter\s+\d+|appendix\s+[a-z]|\d+(\.\d+)*\.?\s+\S)/i;

// Classifies a paragraph using the same typographic signals the Structure
// Intelligence view explains: existing style, numbering pattern, bold run, length.
function classify(p, text) {
  if (!text) return "empty";
  const styleId = styleIdOf(p).toLowerCase();
  if (styleId.includes("caption")) return "caption";
  if (styleId === "title") return "h1";
  if (styleId.includes("heading1") || styleId === "heading 1") return "h1";
  if (/heading[2-9]/.test(styleId)) return "h2";
  if (CAPTION_RE.test(text)) return "caption";

  const runs = p.getElementsByTagNameNS(W, "r");
  let bold = runs.length > 0;
  for (let i = 0; i < runs.length; i += 1) {
    const rPr = first(runs[i], "rPr");
    if (!rPr || !first(rPr, "b")) {
      const t = first(runs[i], "t");
      if (t && t.textContent.trim()) bold = false;
    }
  }
  const short = text.length <= 120 && !/[.!?]$/.test(text);
  if (/^(chapter\s+\d+|appendix\s+[a-z]\b)/i.test(text)) return "h1";
  if (bold && short) return NUM_HEADING_RE.test(text) && /^\d+\.\d/.test(text) ? "h2" : "h1";
  if (short && NUM_HEADING_RE.test(text)) return /^\d+\.\d/.test(text) ? "h2" : "h1";
  return "body";
}

function styleParagraph(doc, p, kind, inTable) {
  const pPr = ensure(doc, p, "pPr", true);

  // alignment
  removeAll(pPr, "jc");
  const jc = el(doc, "jc");
  setAttr(jc, "val", kind === "caption" ? "center" : kind === "body" ? "both" : "left");
  pPr.appendChild(jc);

  // spacing
  removeAll(pPr, "spacing");
  const spacing = el(doc, "spacing");
  setAttr(spacing, "line", String(SPEC.line));
  setAttr(spacing, "lineRule", "auto");
  setAttr(spacing, "after", kind === "h1" ? "120" : kind === "h2" ? "100" : "120");
  if (kind === "h1") setAttr(spacing, "before", "240");
  if (kind === "h2") setAttr(spacing, "before", "200");
  pPr.appendChild(spacing);

  // indentation
  removeAll(pPr, "ind");
  const ind = el(doc, "ind");
  setAttr(ind, "left", "0");
  setAttr(ind, "right", "0");
  setAttr(ind, "firstLine", kind === "body" && !inTable ? String(SPEC.firstLine) : "0");
  pPr.appendChild(ind);

  // run properties applied to every run of the paragraph
  const size =
    kind === "h1"
      ? SPEC.h1HalfPoints
      : kind === "h2"
        ? SPEC.h2HalfPoints
        : kind === "caption"
          ? SPEC.captionHalfPoints
          : SPEC.bodyHalfPoints;

  const runs = p.getElementsByTagNameNS(W, "r");
  for (let i = 0; i < runs.length; i += 1) {
    const rPr = ensure(doc, runs[i], "rPr", true);
    removeAll(rPr, "rFonts");
    removeAll(rPr, "sz");
    removeAll(rPr, "szCs");
    const fonts = el(doc, "rFonts");
    setAttr(fonts, "ascii", SPEC.font);
    setAttr(fonts, "hAnsi", SPEC.font);
    setAttr(fonts, "cs", SPEC.font);
    rPr.insertBefore(fonts, rPr.firstChild);
    const sz = el(doc, "sz");
    setAttr(sz, "val", String(size));
    rPr.appendChild(sz);
    const szCs = el(doc, "szCs");
    setAttr(szCs, "val", String(size));
    rPr.appendChild(szCs);

    if (kind === "h1" || kind === "h2") {
      removeAll(rPr, "b");
      const b = el(doc, "b");
      rPr.appendChild(b);
    }
    if (kind === "caption") {
      removeAll(rPr, "i");
      rPr.appendChild(el(doc, "i"));
    }
  }
}

function applySection(doc) {
  const sects = doc.getElementsByTagNameNS(W, "sectPr");
  for (let i = 0; i < sects.length; i += 1) {
    const sect = sects[i];
    removeAll(sect, "pgMar");
    removeAll(sect, "cols");
    const m = el(doc, "pgMar");
    setAttr(m, "top", String(SPEC.marginTopBottom));
    setAttr(m, "bottom", String(SPEC.marginTopBottom));
    setAttr(m, "left", String(SPEC.marginLeftRight));
    setAttr(m, "right", String(SPEC.marginLeftRight));
    setAttr(m, "header", "708");
    setAttr(m, "footer", "708");
    setAttr(m, "gutter", String(SPEC.gutter));
    sect.appendChild(m);
    const cols = el(doc, "cols");
    setAttr(cols, "space", "708");
    setAttr(cols, "num", "1");
    sect.appendChild(cols);
  }
}

function parseXml(text) {
  return new DOMParser().parseFromString(text, "application/xml");
}

function isInTable(p) {
  let n = p.parentNode;
  while (n) {
    if (n.localName === "tc") return true;
    n = n.parentNode;
  }
  return false;
}

// Reads a .docx and returns structural statistics — no modification.
export function analyzeDocx(bytes) {
  const files = unzipSync(new Uint8Array(bytes));
  const xml = files["word/document.xml"];
  if (!xml) throw new Error("This file is not a valid .docx package.");
  const doc = parseXml(strFromU8(xml));
  const paras = doc.getElementsByTagNameNS(W, "p");

  const stats = {
    paragraphs: 0,
    words: 0,
    characters: 0,
    headings: 0,
    subheadings: 0,
    captions: 0,
    figures: doc.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "blip").length,
    tables: doc.getElementsByTagNameNS(W, "tbl").length,
    references: 0,
    fonts: new Set(),
    sizes: new Set(),
  };

  for (let i = 0; i < paras.length; i += 1) {
    const p = paras[i];
    const text = paragraphText(p);
    if (!text) continue;
    stats.paragraphs += 1;
    stats.words += text.split(/\s+/).filter(Boolean).length;
    stats.characters += text.length;
    const kind = classify(p, text);
    if (kind === "h1") stats.headings += 1;
    if (kind === "h2") stats.subheadings += 1;
    if (kind === "caption") stats.captions += 1;
    if (/^\[\d+\]|^\d+\.\s+[A-Z][a-z]+,/.test(text)) stats.references += 1;

    const rFonts = p.getElementsByTagNameNS(W, "rFonts");
    for (let j = 0; j < rFonts.length; j += 1) {
      const f = rFonts[j].getAttributeNS(W, "ascii") || rFonts[j].getAttribute("w:ascii");
      if (f) stats.fonts.add(f);
    }
    const szs = p.getElementsByTagNameNS(W, "sz");
    for (let j = 0; j < szs.length; j += 1) {
      const v = szs[j].getAttributeNS(W, "val") || szs[j].getAttribute("w:val");
      if (v) stats.sizes.add(`${Number(v) / 2}pt`);
    }
  }

  return {
    ...stats,
    fonts: [...stats.fonts],
    sizes: [...stats.sizes],
    pages: Math.max(1, Math.round(stats.words / 450)),
  };
}

// Applies the publication specification to the author's own document.
export function formatDocx(bytes) {
  const files = unzipSync(new Uint8Array(bytes));
  const xml = files["word/document.xml"];
  if (!xml) throw new Error("This file is not a valid .docx package.");

  const doc = parseXml(strFromU8(xml));
  const paras = doc.getElementsByTagNameNS(W, "p");
  const counts = { body: 0, h1: 0, h2: 0, caption: 0 };

  for (let i = 0; i < paras.length; i += 1) {
    const p = paras[i];
    const text = paragraphText(p);
    const kind = classify(p, text);
    if (kind === "empty") continue;
    counts[kind] = (counts[kind] || 0) + 1;
    styleParagraph(doc, p, kind, isInTable(p));
  }

  applySection(doc);

  files["word/document.xml"] = strToU8(new XMLSerializer().serializeToString(doc));
  const zipped = zipSync(files, { level: 6 });
  return {
    blob: new Blob([zipped], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }),
    counts,
  };
}
