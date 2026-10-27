---
id: 58
type: story
title: scrawl-setup checks the prerequisites up front
status: backlog
parent: 54
assignee: me
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T10:00
---
## Description
A missing `gh` (or not logged in) or no `origin` remote only fails later in `/resolve` or `scrawl-sync`. Have `scrawl-setup` check them and print clear warnings with the fix (warn, don't abort: the board works locally without them). List the prerequisites in the README.

## Acceptance
- [ ] Without `gh`, without `gh auth`, or without an `origin` remote, scrawl-setup prints what's missing and how to fix it
- [ ] Setup still completes in those cases
- [ ] README lists Chrome/Edge, git, sh (Git Bash on Windows), a GitHub `origin`, and `gh`

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
