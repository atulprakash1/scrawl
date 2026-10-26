---
id: 4
type: story
title: Project wizard writes project.md
status: review
parent: 3
assignee: claude
rank: b
labels: [phase-2]
created: 2026-10-25T13:30
updated: 2026-10-26T14:10
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
- 2026-10-26 13:45 · claude · Picked up on branch scrawl/4-project-wizard. Plan: show a five-question wizard when project.md is empty, write the answers, then show /plan with a copy button.
- 2026-10-26 14:10 · claude · Done: an empty project.md (only headings, or missing) now opens a five-question wizard. It writes the answers into project.md and then shows /plan with a copy button. Verified in headless Chrome against an in-memory folder. The Copied toast didn't show headless, so please check it once in a real browser.
- 2026-10-26 14:10 · claude · PR: https://github.com/atulprakash1/scrawl/pull/5
