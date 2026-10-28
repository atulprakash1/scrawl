---
id: 65
type: story
title: Drop the "sketchbook" wording and the unused Rough.js
status: review
assignee: claude
labels: [docs]
created: 2026-10-28T14:10
updated: 2026-10-28T14:20
---
## Description
Since the Studio redesign (#28, #30) the board is clean surfaces with handwriting only in the logo and
headings, so "sketchbook-style" in the README and the welcome tagline oversells it. Rough.js is still in
`vendor/` but nothing loads it.

## Acceptance
- [x] README intro no longer calls the board sketchbook-style
- [x] Welcome-screen tagline in scrawl.html matches
- [x] vendor/rough.min.js removed, with its NOTICE.md row and README layout mention
- [x] `node tools/bundle.mjs` still builds dist/scrawl.html

## Activity
- 2026-10-28 14:10 · me · Asked to update the README and remove rough.js
- 2026-10-28 14:10 · claude · Picked up on branch scrawl/65-drop-sketchbook-and-rough. Acceptance written from the request.
- 2026-10-28 14:20 · claude · README intro now says "A lightweight project board", tagline is "a project board for you & Claude", Rough.js and its notice/layout lines are gone; bundle builds. Found the Patrick Hand font unused too, filed as #66.
