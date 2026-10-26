---
id: 41
type: story
title: Fix button for smudged items
status: resolved
parent: 12
assignee: claude
size: S
labels: [phase-3]
created: 2026-10-26T23:34
updated: 2026-10-26T23:45
rank: mi
---
## Description
An item whose header can't be read fully is shown as "smudged". The drawer explains the problem but offers no fix. Add a Fix button that rewrites the header cleanly, keeping every field and line it can read.

## Acceptance
- [x] A smudged item's drawer shows a Fix button
- [x] Fixing rewrites the header in the standard format, keeps all readable fields, the body and Activity, and fills a missing id or title from the file name
- [x] Unreadable header lines are kept in the body under a note instead of being lost; the item is no longer smudged

## Activity
- 2026-10-26 23:34 · claude · Created by /resolve 12
- 2026-10-26 23:38 · claude · Picked up on feature #12's branch scrawl/12-polish. Plan: store.repair() rewrites the header from what parses, fills id/type/title/status from the file name, moves unreadable header lines into the Description, and renumbers a duplicate id; a Fix button in the drawer's smudge box.
- 2026-10-26 23:39 · claude · Done: a smudged item's drawer has a Fix it button. store.repair() rewrites the header keeping every readable field (unknown ones too), fills only missing id/type/title/status from the file name, moves unreadable lines into the Description, and gives a duplicate id a new number (renaming the file). Verified headless on all four kinds of smudge.
- 2026-10-26 23:44 · claude · PR: https://github.com/atulprakash1/scrawl/pull/19
- 2026-10-26 23:45 · me · Moved to resolved (Resolved)
