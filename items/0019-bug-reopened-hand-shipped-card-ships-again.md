---
id: 19
type: bug
title: Reopened hand-shipped card ships again from old commits
status: done
severity: ant
parent: 18
assignee: claude
labels: [workflow]
created: 2026-10-25T15:02
updated: 2026-10-27T15:39
rank: i
shipped: 6807b1b
release: 0.2.1
---
## Description
Auto-ship and **Ship now** record a `shipped:` marker (the main commit at shipping time), so a reopened card only ships again from newer commits. Dragging a card into Shipped records nothing.
If such a card is later reopened (moved back to review or Resolved), the board finds its old `#N` commits on main and ships it again straight away.

Recording the main head on drag isn't enough: if a card is shipped by hand *before* its PR is merged, the PR's commits land on main after the marker and still count as newer.

Low impact: only matters when hand-shipped cards are reopened.

## Acceptance
- [x] A card dragged to Shipped and later reopened doesn't ship again from commits that were already on main
- [x] Same when it was shipped by hand before its PR was merged
- [x] A genuinely new merge for the reopened card still ships it

## Activity
- 2026-10-25 15:02 · claude · Created at your request while discussing #18 (manual ship, then merge). Parked for later.
- 2026-10-27 09:51 · me · Handed to Claude (Claude's tray)
- 2026-10-27 15:29 · claude · Picked up on branch scrawl/19-reopened-card-reships. Plan: when a card leaves Shipped, stamp the current main head as its shipped: marker, so only commits that reach main after the reopen can ship it again; covers drags and hand-ships before the merge alike.
- 2026-10-27 15:31 · claude · Moving a card out of Shipped now stamps the current main head as its shipped: marker, so only commits that reach main after the reopen can ship it again. Tested in headless Chrome: the dragged and hand-shipped-before-merge cases stay reopened and new merges still ship both; on main the same test re-ships both at once. Not covered: a reopen made by editing the file outside the board (Claude or an editor) gets no marker.
- 2026-10-27 15:31 · claude · PR: https://github.com/atulprakash1/scrawl/pull/30
- 2026-10-27 15:36 · me · Moved to resolved (Resolved)
- 2026-10-27 15:39 · scrawl · Shipped: 6807b1b is on main
- 2026-10-27 20:50 · claude · Released in v0.2.1
