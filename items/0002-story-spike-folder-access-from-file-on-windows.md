---
id: 2
type: story
title: Spike: folder access from file:// on Windows and macOS
status: done
parent: 1
assignee: me
rank: i
labels: [phase-0]
created: 2026-10-25T13:30
updated: 2026-10-25T14:10
release: 0.1.0
---
## Description
Open `scrawl.html` by double-click (file://) in Chrome or Edge and check the File System Access API behaves on both OSes. Fallback if not: `python -m http.server` and open via localhost.

## Acceptance
- [x] Windows: pick folder, board shows, a drag is saved to the file
- [x] Windows: after reload, the folder reopens with at most one click
- [x] macOS: same two checks
- [x] Fonts and emoji render (no blank boxes)

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-25 13:30 · claude · Needs a human with a browser. Open scrawl.html and tick these off.
- 2026-10-25 14:06 · me · Moved to review (Eyeball it)
- 2026-10-25 14:06 · me · Moved to doing (On the bench)
- 2026-10-25 14:06 · me · Moved to ready (Claude's tray)
- 2026-10-25 14:06 · me · Moved to backlog (Someday pile)
- 2026-10-25 14:06 · me · Moved to resolved (Resolved)
- 2026-10-25 14:10 · me · Shipped by hand
- 2026-10-27 01:07 · claude · Released in v0.1.0
