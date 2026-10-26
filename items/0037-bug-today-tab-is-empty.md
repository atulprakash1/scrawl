---
id: 37
type: bug
title: Today tab is empty
status: done
severity: beetle
assignee: claude
rank: i
labels: []
created: 2026-10-26T23:05
updated: 2026-10-26T23:15
shipped: 3203111
release: 0.1.0
---
## Description
what happened to the data in Today's tab. it is empty

## Acceptance
- [x] Today shows today's changes even right after reloading the board
- [x] Reloading does not count as a new visit; a new visit starts after 30 minutes away
- [x] The heading says which time window "What changed" covers

## Activity
- 2026-10-26 23:05 · me · Created
- 2026-10-26 23:06 · me · Handed to Claude (Claude's tray)
- 2026-10-26 23:10 · claude · Picked up. Reproducing with a copy of this board's real data before choosing a fix.
- 2026-10-26 23:11 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-26 23:11 · claude · Root cause: every page load counted as a visit, so after a reload "since your last visit" was only minutes ago and What changed came up empty. Fix on branch scrawl/37-today-empty: reloads within 30 minutes stay the same visit, and What changed always covers at least today.
- 2026-10-26 23:12 · claude · Done: a reload within 30 minutes of the board last being seen is now the same visit (the board keeps "last seen" fresh while open), and What changed always covers at least today, going further back if your last visit was before midnight. The heading says which window applies. Verified headless across five visit cases.
- 2026-10-26 23:13 · claude · PR: https://github.com/atulprakash1/scrawl/pull/17
- 2026-10-26 23:15 · me · Moved to resolved (Resolved)
- 2026-10-26 23:15 · scrawl · Shipped: 3203111 is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
