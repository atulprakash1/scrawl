---
id: 21
type: bug
title: scrawl-home and scrawl-sync race with the open board
status: done
severity: beetle
parent: 18
assignee: claude
labels: [workflow]
created: 2026-10-25T15:11
updated: 2026-10-26T11:43
rank: i
shipped: b052734
---
## Description
Both scripts set the uncommitted `.scrawl/` edits aside, reset `.scrawl/` to HEAD, then run `git switch main` (scrawl-home) or `git merge --ff-only` (scrawl-sync).
The open board polls every 2s. The reset changes item files, so the board re-reads them and rewrites `.scrawl/index.json` in between, and git refuses: "Your local changes … would be overwritten".
Hit during #20's hand-back: `scrawl-home` failed once and worked on the second run. No data was lost (the script puts the edits back), but `/resolve` ends on the work branch until someone re-runs it.

Likely fix: retry the switch/merge a few times, discarding only `.scrawl/` changes between tries (the saved copies win). Only do that when no tracked files outside `.scrawl/` are modified, so code is never thrown away.

## Acceptance
- [x] scrawl-home reaches main even when the board writes `.scrawl/` during the switch
- [x] scrawl-sync fast-forwards main under the same conditions
- [x] Uncommitted changes outside `.scrawl/` still block both, with a clear message
- [x] Live board edits are still kept

## Activity
- 2026-10-25 15:11 · claude · Found while handing the board back after #20 (PR #2); worked around by re-running scrawl-home.
- 2026-10-25 22:53 · me · Handed to Claude (Claude's tray)
- 2026-10-25 22:55 · claude · Picked up on branch scrawl/21-sync-home-race. Plan: move the park/reset/restore steps into one shared helper, retry the switch/merge a few times (resetting only .scrawl/ between tries), and refuse up front with a clear message when code outside .scrawl/ is modified.
- 2026-10-25 22:58 · claude · scrawl-sync and scrawl-home now share a scrawl-board helper that retries the merge/switch up to 5 times (resetting only .scrawl/ between tries; parked board edits win), and refuse up front, naming the files, when code outside .scrawl/ is modified; scrawl-home exits non-zero if it can't reach main. 14 new checks with a fake board that writes during the switch (the old scripts fail 8 of them); all 30 sync checks pass. This run's own start-of-run sync hit the race once.
- 2026-10-25 22:59 · claude · PR: https://github.com/atulprakash1/scrawl/pull/3
- 2026-10-26 11:43 · me · Moved to resolved (Resolved)
- 2026-10-26 11:43 · me · Shipped by hand
