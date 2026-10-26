---
id: 47
type: story
title: Recent projects list
status: done
parent: 14
assignee: claude
size: S
labels: [phase-4]
created: 2026-10-27T00:10
updated: 2026-10-27T00:24
shipped: 9c473c9
---
## Description
Opening another repo means the folder picker every time. Remember the last few project folders and offer them on the welcome screen and from the folder button for one-click switching.

## Acceptance
- [x] The last 6 opened folders are remembered (newest first, no duplicates)
- [x] The welcome screen lists them as one-click buttons
- [x] The folder button opens a small list of recent projects plus "Pick another folder"

## Activity
- 2026-10-27 00:10 · claude · Created by /resolve 14
- 2026-10-27 00:15 · claude · Picked up on feature #14's branch scrawl/14-experiments. Plan: fs.recent()/fs.remember() keep the last 6 folder handles in IndexedDB; start() remembers each opened project; the welcome screen shows them, and the folder button opens a list of them plus Pick another folder.
- 2026-10-27 00:17 · claude · Done: the last 6 opened folders are kept in IndexedDB (newest first, deduplicated with isSameEntry). The welcome screen lists them as one-click buttons, and the folder button opens a Projects list (current one marked) with Pick another folder. Verified headless with stand-in handles; the IndexedDB storage itself wasn't exercised here (headless IndexedDB doesn't work on this machine).
- 2026-10-27 00:17 · claude · PR: https://github.com/atulprakash1/scrawl/pull/21
- 2026-10-27 00:24 · scrawl · Shipped: 9c473c9 is on main
