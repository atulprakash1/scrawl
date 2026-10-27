---
id: 59
type: bug
title: Long project name overlaps the tabs
status: done
severity: ant
assignee: claude
labels: [ui]
created: 2026-10-27T15:38
updated: 2026-10-27T15:42
rank: i
shipped: f18c4a3
release: 0.2.1
---
## Description
A long project name (the `# heading` of project.md, e.g. "Pantry: recipes, meal plans and the weekly shopping list") runs under the view tabs instead of being cut off with an ellipsis. `.project-name` has `text-overflow: ellipsis`, but the brand isn't held to its grid column, so it never shrinks. Happens at every width, before and after #49.

## Acceptance
- [x] A long project name ends in "…" and never overlaps the tabs or actions
- [x] The full name is still available (e.g. as a tooltip)

## Activity
- 2026-10-27 15:38 · claude · Created while working on #49 (found by measuring the header with a long name)
- 2026-10-27 15:39 · me · Handed to Claude (Claude's tray)
- 2026-10-27 15:40 · claude · Picked up on branch scrawl/59-long-project-name. Plan: let the brand fill its grid column instead of its content width, so the name ellipsizes; logo never shrinks; full name as a title tooltip.
- 2026-10-27 15:41 · claude · The brand now fills its grid column (it used to size to its content), so a long name ends in … before the tabs; the logo never shrinks and the full name is the tooltip. Measured in headless Chrome at 600-1600px with a 56-character name and the normal one: no overlap anywhere, and the name shows in full where it fits.
- 2026-10-27 15:41 · claude · PR: https://github.com/atulprakash1/scrawl/pull/32
- 2026-10-27 15:41 · me · Moved to resolved (Resolved)
- 2026-10-27 15:42 · me · Shipped by hand
- 2026-10-27 20:50 · claude · Released in v0.2.1
