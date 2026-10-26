---
id: 44
type: story
title: Redesign Header area
status: done
assignee: claude
rank: i
labels: []
created: 2026-10-26T23:48
updated: 2026-10-27T00:04
shipped: 0f2007c
---
## Description
the header could be better. the tab's size could be a bit bigger. the Scrawl logo is okay, but the text "/ Scrawl" seems redundant.

![Screenshot 2026-10-26 234848.png](../attachments/44/Screenshot%202026-10-26%20234848.png)

## Acceptance
- [x] Tabs are centered in the header, with a bigger logo anchored on the left and the actions on the right
- [x] The main content is centered (board columns, Plan and the other views)
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
- 2026-10-26 23:58 · me · i think the tabs and the main content area should shift to center and the logo is a bit bigger and occupies more space in the left corner. check the proportions as per design standards and make changes.
- 2026-10-26 23:59 · claude · Back on scrawl/44-header for the review comment. Plan: one header row (bigger logo left, tabs centered, actions right, about 64px tall on an 8px grid), Board tools on a slim centered row below, content centered; tabs drop to a centered second row on narrow screens. Added two criteria for this and unticked the rest to re-check.
- 2026-10-27 00:01 · claude · Reworked per review: one 64px header row (logo about 25% bigger on the left, tabs centred, actions on the right), the Board tools on a slim centred row below, and the board, Plan and views centred. Below 1100px the tabs take a centred second row. Measured at 2200 to 500px: tabs exactly centred, nothing cut off, and the board centred with equal gaps on a wide screen.
- 2026-10-27 00:04 · scrawl · Shipped: 0f2007c is on main
