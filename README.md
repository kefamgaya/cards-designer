# Sherehe Studio

Sherehe Studio is an easy, canvas-style celebration card designer built with React and Vite. It includes editable front-and-back layouts, photo tools, decorative elements, premium frames, and print-ready exports.

## Features

- 14 wedding and celebration templates with solid-color backgrounds
- Large front-page photo area with selectable shapes and optional photo frames
- Direct canvas text editing with per-block fonts, sizes, styles, alignment, and colors
- Custom text blocks and recipient title strike-through controls
- Draggable flowers and decorative elements
- 16 optional card frames
- Front and back card editing
- Undo, redo, contextual deletion, and right-click actions
- On-device AI background removal
- PNG, JPG, two-page PDF, and ZIP exports
- Accessible first-time guided tour that can be replayed from the header

## Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Deploy on Vercel

Import this repository into Vercel. The included `vercel.json` uses `npm ci`, runs the Vite production build, publishes `dist/`, and provides an SPA fallback.

No server-side environment variables are required.
