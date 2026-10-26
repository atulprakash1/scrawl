---
id: 4
type: story
title: Project wizard writes project.md
status: done
parent: 3
assignee: claude
rank: i
labels: [phase-2]
created: 2026-10-25T13:30
updated: 2026-10-26T18:45
shipped: 552a0bc
release: 0.1.0
---
## Description
Five questions (what, for whom, stack, must-haves, out of scope) write `.scrawl/project.md` and then show the `/plan` command to paste.

## Acceptance
- [x] Wizard appears for a project with an empty project.md
- [x] Answers are written to project.md
- [x] Shows a copy button for /plan

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-25 22:56 · me · Handed to Claude (Claude's tray)
- 2026-10-26 13:41 · claude · Picked up on branch scrawl/4-project-wizard. Plan: show a five-question wizard when project.md is empty, write the answers, then show /plan with a copy button.
- 2026-10-26 13:43 · claude · Done: an empty project.md (only headings, or missing) now opens a five-question wizard. It writes the answers into project.md and then shows /plan with a copy button. Verified in headless Chrome against an in-memory folder. The Copied toast didn't show headless, so please check it once in a real browser.
- 2026-10-26 13:44 · claude · PR: https://github.com/atulprakash1/scrawl/pull/5
- 2026-10-26 14:24 · me · Moved to resolved (Resolved)
- 2026-10-26 18:45 · scrawl · Shipped: 552a0bc is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
