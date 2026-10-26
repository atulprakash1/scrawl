---
id: 15
type: feature
title: drag and drop cards
status: done
assignee: claude
rank: t
labels: []
created: 2026-10-25T13:33
updated: 2026-10-25T13:46
release: 0.1.0
---
## Description
when a card is dragged and dropped, the card should move with the mouse. the transition should be smooth. when not dropped at destination, the card should go back to origin. the destination o=box should highlight to show that the card can be dropped. right now there is a shadow of the card at the destination and when the mouse is released, the card appears at destination.

## Acceptance
- [x] drag drop works
- [x] the card travels with the mouse pointer.

## Activity
- 2026-10-25 13:33 · me · Created
- 2026-10-25 13:37 · me · Handed to Claude (Claude's tray)
- 2026-10-25 13:45 · claude · Picked up. Plan: make the dragged card a lifted copy that follows the pointer, highlight the column under it, keep the card in place until drop, and animate it back if dropped outside a column.
- 2026-10-25 14:05 · claude · Root cause: a `transform: … !important` lift style overrode the inline translate SortableJS uses to move the dragged copy, so it never left its origin. Now the tilted copy follows the pointer (within 0.5px in a scripted Edge drag test), the target column lights up blue and dashed, an outside drop saves nothing and the card flies back, and a landing card gets a small squash. Please try it with a real mouse.
- 2026-10-25 13:46 · me · Reviewed and shipped
- 2026-10-27 01:07 · claude · Released in v0.1.0
