---
id: 40
type: story
title: Move cards with the keyboard
status: resolved
parent: 12
assignee: claude
size: M
labels: [phase-3]
created: 2026-10-26T23:34
updated: 2026-10-26T23:45
rank: m
---
## Description
Cards can only be moved with a mouse. Focus a card, press Space to pick it up, use the arrow keys to move it (left/right between columns, up/down within one), then Space to drop or Esc to cancel. Saves exactly like a drag.

## Acceptance
- [x] Space on a focused card picks it up, with a visible lifted state and a spoken hint for screen readers
- [x] Left/Right move it between columns, Up/Down within a column; Space drops and saves status and rank like a drag; Esc puts it back
- [x] Focus stays on the moved card

## Activity
- 2026-10-26 23:34 · claude · Created by /resolve 12
- 2026-10-26 23:36 · claude · Picked up on feature #12's branch scrawl/12-polish. Plan: move the drop-saving code out of onDrop into a shared place(), then a carry mode on focused cards (Space to pick up, arrows to move the card between and within columns, Space/Enter to drop, Esc to cancel).
- 2026-10-26 23:38 · claude · Done: Space picks up a focused card (lifted with an accent ring), the arrows carry it between and within columns, Space or Enter drops it and saves through the same code as a mouse drop, and Esc or a click puts it back. A live region announces each step. Verified headless: moves, rank, Activity, focus, cancel, and the mouse drag test still passes.
- 2026-10-26 23:44 · claude · PR: https://github.com/atulprakash1/scrawl/pull/19
- 2026-10-26 23:45 · me · Moved to resolved (Resolved)
