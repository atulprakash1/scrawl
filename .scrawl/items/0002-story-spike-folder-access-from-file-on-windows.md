---
id: 2
type: story
title: Spike: folder access from file:// on Windows and macOS
status: doing
parent: 1
assignee: me
rank: i
labels: [phase-0]
created: 2026-10-25T13:30
updated: 2026-10-25T13:30
---
## Description
Open `scrawl.html` by double-click (file://) in Chrome or Edge and check the File System Access API behaves on both OSes. Fallback if not: `python -m http.server` and open via localhost.

## Acceptance
- [ ] Windows: pick folder, board shows, a drag is saved to the file
- [ ] Windows: after reload, the folder reopens with at most one click
- [ ] macOS: same two checks
- [ ] Fonts and emoji render (no blank boxes)

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-25 13:30 · claude · Needs a human with a browser. Open scrawl.html and tick these off.
