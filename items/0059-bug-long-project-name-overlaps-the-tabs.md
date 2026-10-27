---
id: 59
type: bug
title: Long project name overlaps the tabs
status: ready
severity: ant
assignee: claude
labels: [ui]
created: 2026-10-27T15:38
updated: 2026-10-27T15:39
---
## Description
A long project name (the `# heading` of project.md, e.g. "Pantry: recipes, meal plans and the weekly shopping list") runs under the view tabs instead of being cut off with an ellipsis. `.project-name` has `text-overflow: ellipsis`, but the brand isn't held to its grid column, so it never shrinks. Happens at every width, before and after #49.

## Acceptance
- [ ] A long project name ends in "…" and never overlaps the tabs or actions
- [ ] The full name is still available (e.g. as a tooltip)

## Activity
- 2026-10-27 15:38 · claude · Created while working on #49 (found by measuring the header with a long name)
- 2026-10-27 15:39 · me · Handed to Claude (Claude's tray)
