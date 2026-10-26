---
id: 33
type: story
title: Today page redesign
status: review
assignee: claude
rank: i
labels: []
created: 2026-10-26T22:03
updated: 2026-10-26T22:08
---
## Description
Today page can use redesign. when there are several items, user has to scroll to see Waiting for You section. there is enough space for horizontal or same level display.

## Acceptance
- [x] the design is horizontal and not vertical.
- [x] same level of information is maintained as before.

## Activity
- 2026-10-26 22:03 · me · Created
- 2026-10-26 22:06 · me · Handed to Claude (Claude's tray)
- 2026-10-26 22:06 · claude · Picked up on branch scrawl/33-today-columns. Plan: lay the three Today panels out side by side, each scrolling on its own when long, wider page, stacked again on narrow screens; content unchanged.
- 2026-10-26 22:08 · claude · Done: the three Today panels now sit side by side under the heading, each scrolling on its own when its list is long, so Waiting for you is always in view. Below 900px they stack, each capped at 45% of the screen height. Only CSS changed, so the content is the same as before. Measured with 30 changed items at 1280x720 and 800x900.
- 2026-10-26 22:08 · claude · PR: https://github.com/atulprakash1/scrawl/pull/13
