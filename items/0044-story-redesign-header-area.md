---
id: 44
type: story
title: Redesign Header area
status: review
assignee: claude
rank: i
labels: []
created: 2026-10-26T23:48
updated: 2026-10-26T23:55
---
## Description
the header could be better. the tab's size could be a bit bigger. the Scrawl logo is okay, but the text "/ Scrawl" seems redundant.

![Screenshot 2026-10-26 234848.png](../attachments/44/Screenshot%202026-10-26%20234848.png)

## Acceptance
- [x] The view tabs are larger and easier to hit
- [x] "/ <project>" only shows when the project name differs from the Scrawl logo
- [x] Nothing in the header is squashed or cut off at any width; when space runs out the Board tools move to their own row and the tabs scroll

## Activity
- 2026-10-26 23:48 · me · Created
- 2026-10-26 23:51 · me · Handed to Claude (Claude's tray)
- 2026-10-26 23:51 · me · Removed attachment Screenshot 2026-10-26 234848.png
- 2026-10-26 23:51 · me · Attached Screenshot 2026-10-26 234848.png
- 2026-10-26 23:53 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-26 23:53 · claude · Picked up on branch scrawl/44-header. Looked at the screenshot: "/ Scrawl" repeats the logo because this project is called Scrawl. Plan: show the crumb only when the name differs, and bigger tabs with a clearer active state.
- 2026-10-26 23:55 · claude · Done: the view tabs are bigger (16px, roomier padding, a filled active tab with the underline) and never wrap; "/ <project>" is hidden when the project is called Scrawl. Below 1180px the Board tools take their own row instead of squeezing the tabs. Measured at 1400/1180/1000/700/500px (nothing cut off, single-line tabs) and checked by screenshot.
- 2026-10-26 23:56 · claude · PR: https://github.com/atulprakash1/scrawl/pull/20
