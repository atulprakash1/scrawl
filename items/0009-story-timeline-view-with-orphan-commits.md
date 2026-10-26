---
id: 9
type: story
title: Timeline view with orphan commits
status: done
parent: 8
assignee: claude
rank: r
labels: [phase-3]
created: 2026-10-25T13:30
updated: 2026-10-26T21:26
shipped: 919da11
---
## Description
Everything in date order: commits, moves, comments, releases. Filter by you vs Claude. Commits without `#N` show as orphan sticky notes.

## Acceptance
- [x] A Timeline view lists Activity lines, commits and releases newest first, grouped by day
- [x] Filter: everything, me, Claude, or commits only
- [x] Commits without a leading `#N` show as orphan sticky notes; anything tied to an item opens it on click

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-26 20:25 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-26 20:25 · claude · Picked up on feature #8's branch scrawl/8-visibility. Plan: a Timeline view built from item Activity lines, commits.txt and the release pages, with a who filter and orphan commits drawn as sticky notes.
- 2026-10-26 20:26 · claude · Done: a Timeline view merges every item's Activity lines, commits and release pages, newest first by day, with an everything/me/Claude/commits filter. Commits without a leading #N (merge commits aside) are orphan sticky notes, and item links open the drawer. Verified headless.
- 2026-10-26 20:29 · me · Moved to resolved (Resolved)
- 2026-10-26 20:30 · claude · PR: https://github.com/atulprakash1/scrawl/pull/11
- 2026-10-26 21:26 · scrawl · Shipped: 919da11 is on main
