---
id: 5
type: story
title: Proposed lane and Plan tree with accept/reject
status: done
parent: 3
assignee: claude
rank: c
labels: [phase-2]
created: 2026-10-25T13:30
updated: 2026-10-26T18:45
shipped: 81fd595
---
## Description
Items with `status: proposed` show in a Proposed lane. Plan view shows features → stories. Accept moves to backlog, reject to wontfix.

## Acceptance
- [x] Proposed items are visible
- [x] Accept and reject buttons work
- [x] Drag to re-parent a story

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-25 22:56 · me · Handed to Claude (Claude's tray)
- 2026-10-26 14:24 · claude · Picked up on branch scrawl/5-plan-view. Plan: add a Plan view (Board/Plan toggle) with a Proposed lane (accept → backlog, reject → wontfix) next to a features → stories tree whose stories can be dragged to another feature.
- 2026-10-26 14:29 · claude · Done: a Board/Plan toggle in the top bar opens the Plan view. Its Proposed lane groups proposals under their feature, with accept (→ backlog) and reject (→ wontfix) buttons, also in the drawer. Next to it, a features → stories tree where dragging a story onto another feature (or onto "Stories without a feature") changes its parent. Verified in headless Chrome with real pointer drags. Filed #24 for accepting a whole feature at once.
- 2026-10-26 14:29 · claude · PR: https://github.com/atulprakash1/scrawl/pull/6
- 2026-10-26 18:45 · scrawl · Shipped: 81fd595 is on main
