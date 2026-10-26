---
id: 26
type: story
title: Show parent and child stories in the item drawer
status: done
assignee: claude
size: S
labels: [ui]
created: 2026-10-26T18:52
updated: 2026-10-26T20:29
shipped: e74bb7b
release: 0.1.0
---
## Description
The drawer doesn't show where an item sits in the plan. A story should show its feature, and a feature should list its stories, so you can move between them without the Plan view.

## Acceptance
- [x] A story with a parent shows "Part of #N <title>" under its title, and clicking it opens the parent
- [x] A feature shows a Stories section listing each child with number, title and status, plus "x/y done"
- [x] Clicking a child opens it in the drawer

## Activity
- 2026-10-26 18:52 · claude · Created from the feature-workflow assessment
- 2026-10-26 19:46 · claude · Picked up on branch scrawl/26-drawer-parent-children. Plan: a "Part of #N" link under the title, and a Stories section with status and x/y done on features, both opening the linked item in the drawer.
- 2026-10-26 20:05 · claude · Done: the drawer shows "Part of #N <title>" for items with a parent, and a Stories section with each child's status and "x/y done" (wontfix left out). Both link to the other item. Verified in headless Chrome with sample items, including a missing parent.
- 2026-10-26 20:06 · claude · PR: https://github.com/atulprakash1/scrawl/pull/10
- 2026-10-26 20:29 · scrawl · Shipped: e74bb7b is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
