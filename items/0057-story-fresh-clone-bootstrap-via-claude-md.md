---
id: 57
type: story
title: Fresh clone sets up its board on Claude's first command
status: backlog
parent: 54
assignee: me
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T10:00
---
## Description
On a fresh clone `.scrawl/` is missing, so `sh .scrawl/hooks/scrawl-sync` (the first step of every command) fails and the user has to know to run `git worktree add .scrawl scrawl-board && sh .scrawl/hooks/scrawl-setup`. CLAUDE.md is committed on main, so add a fallback line to the protocol: if `.scrawl/` is missing and `scrawl-board` exists (locally or on origin), run those commands first. The board could show the same command when opened on a clone without `.scrawl/`.

## Acceptance
- [ ] The protocol section in CLAUDE.md (and templates.js via bundle) has the fallback
- [ ] Running `/next` in a fresh clone sets up `.scrawl/` and carries on
- [ ] README "Setup" mentions this instead of the manual commands

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
