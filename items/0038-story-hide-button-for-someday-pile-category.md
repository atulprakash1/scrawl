---
id: 38
type: story
title: hide button for Someday pile category
status: resolved
assignee: claude
rank: i
labels: []
created: 2026-10-26T23:07
updated: 2026-10-26T23:21
---
## Description
The Someday pile can get long; give it the same hide/show button the Shipped column has.

## Acceptance
- [x] The Someday pile column has a hide/show button, like Shipped
- [x] A hidden Someday pile keeps its width, still takes dropped cards, and stays hidden after a reload
- [x] New projects get the button too

## Activity
- 2026-10-26 23:07 · me · Created
- 2026-10-26 23:07 · me · Handed to Claude (Claude's tray)
- 2026-10-26 23:16 · claude · The description was empty, so I filled it in from the title. Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-26 23:16 · claude · Picked up on branch scrawl/38-fold-someday. Plan: mark the Someday pile `foldable` (this board's config.json and the default config for new projects); the Shipped fold code does the rest.
- 2026-10-26 23:19 · claude · Done: the Someday pile is now foldable, like Shipped. This board's .scrawl/config.json (saved by the sync) and the default config for new projects both mark it. Verified headless: hide, "4 hidden" at the same width, a drop onto the hidden pile, still hidden after a reload, and a new project's config.
- 2026-10-26 23:19 · claude · PR: https://github.com/atulprakash1/scrawl/pull/18
- 2026-10-26 23:21 · me · Moved to resolved (Resolved)
