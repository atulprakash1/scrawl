---
id: 50
type: story
title: parent child relationship
status: done
assignee: claude
rank: r
labels: []
created: 2026-10-27T00:26
updated: 2026-10-27T00:40
shipped: 739b6cf
---
## Description
the story should show somewhere the parent item and link.

## Acceptance
- [x] A card with a parent shows the parent's number and title on the board
- [x] Clicking it opens the parent in the drawer (not the card itself); it works by keyboard too
- [x] The drawer keeps its "Part of #N" link

## Activity
- 2026-10-27 00:26 · me · Created
- 2026-10-27 00:27 · me · Handed to Claude (Claude's tray)
- 2026-10-27 00:35 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-27 00:35 · claude · Picked up on branch scrawl/50-parent-on-cards. The drawer already shows "Part of #N" (#26), but board cards don't. Plan: a small "↳ #N title" link on each card with a parent, in the parent's type colour, opening the parent.
- 2026-10-27 00:36 · claude · Done: board cards with a parent show "↳ #N title" above their title, in the parent's type colour and truncated when long. Clicking it (or Enter/Space) opens the parent in the drawer instead of the card, and the drawer's "Part of #N" is unchanged. Verified headless with a screenshot.
- 2026-10-27 00:36 · claude · PR: https://github.com/atulprakash1/scrawl/pull/24
- 2026-10-27 00:39 · me · Moved to resolved (Resolved)
- 2026-10-27 00:40 · scrawl · Shipped: 739b6cf is on main
