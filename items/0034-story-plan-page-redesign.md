---
id: 34
type: story
title: Plan page redesign
status: done
assignee: claude
rank: i
labels: []
created: 2026-10-26T22:09
updated: 2026-10-26T22:46
shipped: c254c72
---
## Description
Today page could use some  redesign. there is a lot of wasteful space. the long rows looks unserious and old. redesign the page with a modern look consistent with other tabs.

## Acceptance
- [x] same level of info remains after the change.
- [x] sleek and modern look is achieved

## Activity
- 2026-10-26 22:09 · me · Created
- 2026-10-26 22:13 · claude · Picked up on branch scrawl/34-plan-cards. The description says "Today page", but I took the title (Plan page): Today was just redone in #33, and the long rows are the Plan tree's. Plan: features become cards in a responsive grid, with compact story rows and a done count inside, and the Proposed lane is tightened; same info and drag-to-re-parent.
- 2026-10-26 22:15 · claude · Done: Plan now shows features as cards in a responsive grid (feature header, compact story rows with status pills, a done count with a meter and +N proposed in the footer) next to a slim sticky Proposed lane. All the same information and actions remain; the original Plan tests (accept/reject, drawer accept, drag to re-parent) pass on the new markup. Screenshots checked in light and dark.
- 2026-10-26 22:15 · claude · PR: https://github.com/atulprakash1/scrawl/pull/14
- 2026-10-26 22:46 · scrawl · Shipped: c254c72 is on main
