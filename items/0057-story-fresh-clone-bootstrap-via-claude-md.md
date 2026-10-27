---
id: 57
type: story
title: Fresh clone sets up its board on Claude's first command
status: done
parent: 54
assignee: claude
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T11:00
shipped: 0f4f7b4
release: 0.2.0
---
## Description
On a fresh clone `.scrawl/` is missing, so `sh .scrawl/hooks/scrawl-sync` (the first step of every command) fails and the user has to know to run `git worktree add .scrawl scrawl-board && sh .scrawl/hooks/scrawl-setup`. CLAUDE.md is committed on main, so add a fallback line to the protocol: if `.scrawl/` is missing and `scrawl-board` exists (locally or on origin), run those commands first. The board could show the same command when opened on a clone without `.scrawl/`.

## Acceptance
- [x] The protocol section in CLAUDE.md (and templates.js via bundle) has the fallback
- [ ] Running `/next` in a fresh clone sets up `.scrawl/` and carries on
- [x] README "Setup" mentions this instead of the manual commands

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
- 2026-10-27 10:04 · claude · Picked up on the feature branch scrawl/54-one-click-install. Plan: protocol line telling the agent to check out the board when .scrawl/ is missing; the board's no-.scrawl screen shows the same command when the repo has a scrawl-board branch.
- 2026-10-27 10:06 · claude · The protocol now says: no .scrawl/ but a scrawl-board branch → git worktree add .scrawl scrawl-board && scrawl-setup, then carry on; the board's no-.scrawl screen detects the branch (loose refs or packed-refs) and shows that command instead of Start Scrawl, which would fork the board. Verified the command in a simulated fresh clone (board checked out, clean git status, hooksPath set, scrawl-sync OK) and the packed-refs match; the /next box is left unticked: not tried with a real Claude run.
- 2026-10-27 10:07 · claude · PR: https://github.com/atulprakash1/scrawl/pull/29
- 2026-10-27 11:00 · scrawl · Shipped: 0f4f7b4 is on main
- 2026-10-27 14:00 · claude · Released in v0.2.0
