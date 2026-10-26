---
id: 51
type: bug
title: red horizontal bar when new item created
status: done
severity: beetle
assignee: claude
rank: i
labels: []
created: 2026-10-27T00:28
updated: 2026-10-27T00:40
shipped: 92a9bdc
---
## Description
there was a red horizontal bar when new item created. just a flicker for a fraction of a second. what was that? if it has no significant purpose, then remove it.

## Acceptance
- [x] Creating an item no longer flashes a red bar
- [x] The "Lost access to the folder" banner still shows when access is really lost (at once for a permission error, after 3 failures in a row otherwise)
- [x] A file that disappears mid-read is skipped and read on the next refresh, keeping its card

## Activity
- 2026-10-27 00:28 · me · Created
- 2026-10-27 00:29 · me · Handed to Claude (Claude's tray)
- 2026-10-27 00:30 · claude · Picked up. Suspect: the red "Lost access to the folder" banner flashing because one refresh fails while the browser is still swapping the new file into place. Reproducing before fixing.
- 2026-10-27 00:31 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-27 00:31 · claude · Found it: the red bar was the "Lost access to the folder" banner. Since #45 the board refreshes within 150ms of a save, sometimes while Chrome is still swapping the new file into place; that one read failed, the banner showed, and the next refresh hid it. Now a file that vanishes mid-read is skipped, and the banner waits for a real permission error or 3 failures in a row. Reproduced and verified headless.
- 2026-10-27 00:32 · claude · PR: https://github.com/atulprakash1/scrawl/pull/23
- 2026-10-27 00:34 · me · Moved to resolved (Resolved)
- 2026-10-27 00:40 · scrawl · Shipped: 92a9bdc is on main
