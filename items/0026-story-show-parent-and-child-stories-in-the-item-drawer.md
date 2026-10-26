---
id: 26
type: story
title: Show parent and child stories in the item drawer
status: review
assignee: claude
size: S
labels: [ui]
created: 2026-10-26T16:20
updated: 2026-10-26T17:15
---
## Description
The drawer doesn't show where an item sits in the plan. A story should show its feature, and a feature should list its stories, so you can move between them without the Plan view.

## Acceptance
- [x] A story with a parent shows "Part of #N <title>" under its title, and clicking it opens the parent
- [x] A feature shows a Stories section listing each child with number, title and status, plus "x/y done"
- [x] Clicking a child opens it in the drawer

## Activity
- 2026-10-26 16:20 · claude · Created from the feature-workflow assessment
- 2026-10-26 17:00 · claude · Picked up on branch scrawl/26-drawer-parent-children. Plan: a "Part of #N" link under the title, and a Stories section with status and x/y done on features, both opening the linked item in the drawer.
- 2026-10-26 17:15 · claude · Done: the drawer shows "Part of #N <title>" for items with a parent, and a Stories section with each child's status and "x/y done" (wontfix left out). Both link to the other item. Verified in headless Chrome with sample items, including a missing parent.
- 2026-10-26 17:15 · claude · PR: https://github.com/atulprakash1/scrawl/pull/10
