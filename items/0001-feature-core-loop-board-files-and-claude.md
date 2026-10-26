---
id: 1
type: feature
title: Core loop: board, files and Claude
status: done
assignee: claude
rank: 1
labels: [phase-1]
created: 2026-10-25T13:30
updated: 2026-10-25T13:47
release: 0.1.0
---
## Description
Phase 1. The smallest loop that works: board UI reading/writing `.scrawl/`, item drawer, watcher, field-level merge, CLAUDE.md protocol, `/resolve` + `/next`, git post-commit hook linking commits by `#N`.

## Acceptance
- [x] A card travels from Claude's tray to review without touching a file
- [x] Card moves and comments are saved to the item file
- [x] Changes made by Claude show up on the board within ~2s
- [x] Commits with `#N` appear on the card

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-25 13:30 · claude · Built parser, store, board, drawer, watcher, protocol, commands and hook. Ready for you to try the loop end to end (see docs/ROADMAP.md).
- 2026-10-25 13:47 · me · Reviewed and shipped
- 2026-10-27 01:07 · claude · Released in v0.1.0
