# OrbitDoc Publisher

Build ORBiDOC ("From Document Chaos to Publication Orbit"), an offline intelligent DOCX-to-publication formatting system web application built with React, Vite, and JavaScript (no TypeScript).

Key Features & Specifications:
1. Visual Galaxy / Space Design:
   - Deep space dark navy/black background (#070913 to #0B1021) with subtle twinkling stars and soft purple/cyan nebula glow, thin SVG orbit rings, glassmorphism cards (backdrop-filter blur, fine borders with 1px cyan/purple accents).
   - Metaphor mapping in visuals & badges: Document = Universe, Chapter = Planet, Subheading = Moon, Figure = Comet, Table = Asteroid, Structure = Constellation, Scanner = Telescope, Formatting Engine = Orbit Engine, Content Verification = Content Guardian.
   - Clean, professional, futuristic typography (Inter / Space Grotesk / monospace accents), zero gaming clutter, highly accessible.

2. Navigation & Mission Status:
   - Top bar / sidebar with ORBiDOC logo, status badge ("● OFFLINE INTELLIGENCE | LOCAL PROCESSING ACTIVE | NO CLOUD AI"), Demo Mode toggle, and step indicator: 1 Upload → 2 Scan → 3 Understand (DNA & Structure) → 4 Format → 5 Verify → 6 Export.
   - Step progress indicator allowing smooth navigation through the flow.

3. Complete User Flow & Pages:
   - Page 1: Home (Hero "From Document Chaos to Publication Orbit", clear mission, 3 value pillars: OFFLINE local intelligence, CONTENT SAFE preservation, PUBLICATION READY styling; interactive central universe orbit visual with orbiting document elements; "Upload Manuscript" CTA and "Load Sample 42-page Manuscript" for instant demo).
   - Page 2: Manuscript Scanner (Dropzone for .docx files, file details badge, "Begin Telescope Scan" with multi-phase scanning progress: reading DOCX structure, extracting typography features, detecting headings, tables, figures, captions, references, hierarchy mapping, formatting plan).
   - Page 3: Document DNA (Visual structural fingerprint with orbit/constellation node diagram showing Document at center and orbiting Chapters, Subheadings, Figures, Tables, References; extracted stats cards with clear DEMO DATA tag when in demo mode; 400+ page benchmark ready badge).
   - Page 4: Structure Intelligence (Explainable Structure Intelligence table with Element, Detected Type, Confidence %, "Why Classified" explainability column explaining exact typographic/positional signals like font size, numbering pattern, bold properties, proximity; "Orbit Alert" indicator for low-confidence items).
   - Page 5: Orbit Formatting Engine (Pipeline view from raw manuscript to style mapping; clear display of standard academic publication specs: Times New Roman 12pt, justified, 1.5 line spacing, 1.27cm first-line indent, exact margins 1.52cm top/bottom, 1.97cm left/right, gutter left, Heading 1 16pt bold; interactive "Apply Publication Formatting" with real-time stage progress).
   - Page 6 & 7: Document Verification (Content Guardian & Lost Element Detector: before/after cryptographic hash & element integrity check showing 100% text preserved; Cross-Reference Guardian verifying Figure 2.1, Table 3.2, and alerting missing citations like Figure 7.4).
   - Page 8: Publication Ready (Publication Orbit Reached milestone, downloadable publication-ready .docx file generated client-side using docx or blob download, verification certificate/report modal view, reset flow option).

4. Architecture & Demo Service:
   - Clean modular component structure in plain JavaScript (.jsx).
   - demoService.js and demoData.js providing rich, realistic academic manuscript data (e.g. "Quantum Computing in Distributed Systems.docx") for immediate 30-second judge presentation.
   - Ready to connect to an offline local Python processing engine via REST endpoints.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/069b0a0c-9255-4733-bf3a-a2fc9f6f74dd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
