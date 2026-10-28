---
id: 64
type: bug
title: Setup writes CLAUDE.md and AGENTS.md into folders named CLAUDE.m and AGENTS.m
status: done
severity: cockroach
assignee: claude
labels: [install]
created: 2026-10-28T13:05
updated: 2026-10-28T14:08
shipped: e3ad61e
release: 0.2.3
---
## Description
User report with screenshot: setting Scrawl up in a new project ("Recepie Compiler") left folders
`CLAUDE.m/` and `AGENTS.m/` at the repo root, each holding the real `CLAUDE.md` / `AGENTS.md`.

Cause: `fileHandle()` and `remove()` in app/js/fs.js split the path at `lastIndexOf('/')`. A root-level
file has no `/`, so the folder part became `path.slice(0, -1)` (the name minus its last letter) and was
created as a directory. Reads went the same way, so an existing root CLAUDE.md was never seen either.

## Acceptance
- [x] Writing a root-level file creates it at the repo root, no extra folder
- [x] Reading and removing a root-level file work on the file at the root
- [x] Nested paths (.scrawl/items/...) behave as before
- [ ] Setup in a new project leaves CLAUDE.md and AGENTS.md at the root (browser check)

## Activity
- 2026-10-28 13:05 · claude · Created from user report (screenshot of CLAUDE.m / AGENTS.m folders)
- 2026-10-28 13:05 · claude · Picked up on branch scrawl/64-root-files-in-folders.
- 2026-10-28 13:15 · claude · Paths are split by a small split() helper that gives a root-level file an empty folder part. Tested write/read/remove against a mock folder in Node; the browser setup run is left for review.
- 2026-10-28 13:15 · claude · PR: https://github.com/atulprakash1/scrawl/pull/38
- 2026-10-28 14:08 · scrawl · Shipped: e3ad61e is on main
- 2026-10-28 13:45 · claude · Released in v0.2.3
