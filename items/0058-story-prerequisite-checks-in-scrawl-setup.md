---
id: 58
type: story
title: scrawl-setup checks the prerequisites up front
status: done
parent: 54
assignee: claude
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T11:00
shipped: 2ace340
---
## Description
A missing `gh` (or not logged in) or no `origin` remote only fails later in `/resolve` or `scrawl-sync`. Have `scrawl-setup` check them and print clear warnings with the fix (warn, don't abort: the board works locally without them). List the prerequisites in the README.

## Acceptance
- [x] Without `gh`, without `gh auth`, or without an `origin` remote, scrawl-setup prints what's missing and how to fix it
- [x] Setup still completes in those cases
- [x] README lists Chrome/Edge, git, sh (Git Bash on Windows), a GitHub `origin`, and `gh`

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
- 2026-10-27 10:06 · claude · Picked up on the feature branch scrawl/54-one-click-install. Plan: scrawl-setup warns (never stops) about a missing origin remote, missing gh, or gh not logged in, with the fix; README gets a Requirements list.
- 2026-10-27 10:07 · claude · scrawl-setup now warns, before doing its work, when there's no origin remote, gh isn't installed, or gh isn't logged in, each with the fix, and still completes. README has a Requirements section. Tested all three warnings plus the clean case in throwaway repos (new board and already set up).
- 2026-10-27 10:07 · claude · PR: https://github.com/atulprakash1/scrawl/pull/29
- 2026-10-27 11:00 · scrawl · Shipped: 2ace340 is on main
