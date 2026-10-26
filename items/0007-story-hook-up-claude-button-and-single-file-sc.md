---
id: 7
type: story
title: Hook up Claude button and single-file scrawl.html
status: done
parent: 3
assignee: claude
rank: e
labels: [phase-2]
created: 2026-10-25T13:30
updated: 2026-10-26T18:55
shipped: dc5344c
release: 0.1.0
---
## Description
One click writes the CLAUDE.md protocol, `.claude/commands/`, the post-commit hook and a `.scrawl/` skeleton into any repo. Bundle scrawl.html into one file so it can be copied into other repos.

## Acceptance
- [x] A Hook up Claude button writes the CLAUDE.md protocol, .claude/commands/ and .scrawl/hooks/ into the open repo, without overwriting your own CLAUDE.md or commands
- [x] Afterwards it shows the one-time setup command to run, with a copy button
- [x] One command builds a single-file scrawl.html that works copied anywhere

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-26 15:28 · claude · Picked up on branch scrawl/7-hook-up-claude. No acceptance yet, so I added three criteria from the description. Plan: node tools/bundle.mjs generates app/js/templates.js (protocol, commands and hooks embedded, because file:// pages can't read files) and dist/scrawl.html (everything inlined). A topbar button writes the templates into the open repo.
- 2026-10-26 16:03 · claude · Done: node tools/bundle.mjs generates app/js/templates.js (protocol, commands, hooks) and a single-file dist/scrawl.html. The new Hook up Claude button writes the templates into the open repo without overwriting your CLAUDE.md text or commands, then shows the setup command to copy. Verified in headless Chrome (button against an in-memory repo, bundle opened alone from another folder). The real folder picker and scrawl-setup in a fresh repo are untested.
- 2026-10-26 16:05 · claude · PR: https://github.com/atulprakash1/scrawl/pull/8
- 2026-10-26 18:55 · scrawl · Shipped: dc5344c is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
