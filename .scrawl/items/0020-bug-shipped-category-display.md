---
id: 20
type: bug
title: Shipped category display
status: review
severity: beetle
assignee: claude
rank: i
labels: []
created: 2026-10-25T15:04
updated: 2026-10-25T15:10
---
## Description
the vertical display of Shipped section looks awkward. keep it unhidden by default. sort the items in the recent on top order. hide button stays but the width do not change when hidden. there is enough space to the right.

## Acceptance
- [x] not hidden by default.
- [x] width remains same after hide button is clicked.
- [x] sort order - recent at top.

## Activity
- 2026-10-25 15:04 · me · Created
- 2026-10-25 15:07 · me · Handed to Claude (Claude's tray)
- 2026-10-25 15:08 · claude · Picked up on branch scrawl/20-shipped-column-display. Plan: Shipped open by default, hiding keeps the column width (cards fold into a short note), and Shipped sorts newest first.
- 2026-10-25 15:10 · claude · Shipped now starts open, newest first (by last update), and can't be hand-reordered; hide keeps the column width and shows "N hidden" instead of the cards. Config flag is now `foldable` (old `collapsed` still works). 9 new browser checks plus all earlier suites pass.
