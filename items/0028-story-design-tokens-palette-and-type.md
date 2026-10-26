---
id: 28
type: story
title: Studio design tokens: palette, surfaces and type
status: resolved
parent: 23
assignee: claude
size: S
labels: [ui]
created: 2026-10-26T21:30
updated: 2026-10-26T21:49
---
## Description
Groundwork for the Studio look picked for #23: a richer, more colourful palette with one accent colour per item type, layered surfaces and shadows, and a clean UI font for body text (handwriting kept for the logo and headings). Works in light and dark.

## Acceptance
- [x] Colours, surfaces, radii and shadows are CSS tokens on :root, with a dark set
- [x] Each type (feature, story, bug, idea) has its own accent colour and tint
- [x] Body text uses a clean system UI font; the handwriting fonts are only on the logo and headings

## Activity
- 2026-10-26 21:30 · claude · Created by /resolve 23
- 2026-10-26 21:30 · claude · Picked up on feature #23's branch scrawl/23-studio-redesign. Plan: new token set (surfaces, borders, shadows, radii, one accent per type) in light and dark, old token names kept as aliases, system UI body font, base buttons and inputs restyled.
- 2026-10-26 21:33 · claude · Done: new Studio tokens on :root (surfaces, borders, three shadow depths, radii, an accent and one colour + tint per type) with a matching dark set. The old names are aliases, so every view picks them up. The body font is the system UI font, handwriting only on the logo and headings, and buttons, inputs and toasts are restyled. Checked by screenshot in light and dark.
- 2026-10-26 21:42 · claude · PR: https://github.com/atulprakash1/scrawl/pull/12
- 2026-10-26 21:49 · me · Reviewed and accepted (Resolved)
