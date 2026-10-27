---
id: 60
type: bug
title: A fresh scrawl.html silently reopens another project's board
status: review
severity: beetle
assignee: claude
labels: [install]
created: 2026-10-27T20:55
updated: 2026-10-27T21:37
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
- 2026-10-27 21:36 · claude · Picked up on branch scrawl/60-reopen-per-page. Remember the folder to reopen per scrawl.html path instead of one shared key.
- 2026-10-27 21:37 · claude · The folder to reopen is now kept per scrawl.html path (fs.js), so a new copy shows the welcome screen with Recent projects. Existing copies lose auto-reopen once. Not browser-tested (folder picker can't be automated), so the boxes are left for review.
- 2026-10-27 21:37 · claude · PR: https://github.com/atulprakash1/scrawl/pull/34
