---
id: 60
type: bug
title: A fresh scrawl.html silently reopens another project's board
status: ready
severity: beetle
assignee: claude
labels: [install]
created: 2026-10-27T20:55
updated: 2026-10-27T21:35
---
## Description
Downloading the released scrawl.html into an empty folder (e.g. a new project) and opening it shows
the Scrawl repo's own board instead of a welcome/setup screen.

Cause: Chrome gives every file:// page the same origin, so all copies of scrawl.html share one
IndexedDB. `S.fs.remembered()` (app/js/fs.js) returns the last folder any copy opened, and boot
(app/js/main.js) starts it straight away while permission is still granted. Easy to then edit the
wrong project's board without noticing.

## Acceptance
- [ ] A scrawl.html opened from a folder other than the remembered project's does not auto-open that project; it shows the welcome screen with that project under Recent projects
- [ ] Reopening the same scrawl.html (same path) still goes straight to its board
- [ ] Picking the empty folder from that screen starts the normal setup

## Activity
- 2026-10-27 20:55 · claude · Created from user report: the v0.2.1 download in an empty folder opened the Scrawl board
- 2026-10-27 21:35 · me · Handed to Claude (Claude's tray)
