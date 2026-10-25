---
id: 19
type: bug
title: Reopened hand-shipped card ships again from old commits
status: backlog
severity: ant
parent: 18
assignee: me
labels: [workflow]
created: 2026-10-25T15:02
updated: 2026-10-25T15:02
---
## Description
Auto-ship and **Ship now** record a `shipped:` marker (the main commit at shipping time), so a reopened card only ships again from newer commits. Dragging a card into Shipped records nothing.
If such a card is later reopened (moved back to review or Resolved), the board finds its old `#N` commits on main and ships it again straight away.

Recording the main head on drag isn't enough: if a card is shipped by hand *before* its PR is merged, the PR's commits land on main after the marker and still count as newer.

Low impact: only matters when hand-shipped cards are reopened.

## Acceptance
- [ ] A card dragged to Shipped and later reopened doesn't ship again from commits that were already on main
- [ ] Same when it was shipped by hand before its PR was merged
- [ ] A genuinely new merge for the reopened card still ships it

## Activity
- 2026-10-25 15:02 · claude · Created at your request while discussing #18 (manual ship, then merge). Parked for later.
