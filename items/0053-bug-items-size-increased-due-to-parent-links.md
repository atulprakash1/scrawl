---
id: 53
type: bug
title: items size increased due to parent links
status: done
severity: beetle
assignee: claude
rank: i
labels: []
created: 2026-10-27T01:19
updated: 2026-10-27T01:27
shipped: 16968d1
---
## Description
the parent link increases the item box size causing a bottom scroll bar. reduce the link size.
![Screenshot 2026-10-27 011857.png](../attachments/53/Screenshot%202026-10-27%20011857.png)

## Acceptance
- [x] A story card with a long parent title stays as wide as its column; the board shows no horizontal scrollbar
- [x] A long parent link is cut off with an ellipsis, and its full title is in the tooltip
- [x] The parent link is a little smaller than before
- [x] Clicking the parent link still opens the parent

## Activity
- 2026-10-27 01:19 · me · Created
- 2026-10-27 01:20 · me · Attached Screenshot 2026-10-27 011857.png
- 2026-10-27 01:22 · me · Handed to Claude (Claude's tray)
- 2026-10-27 01:25 · claude · Picked up on branch scrawl/53-parent-link-width. Cause: the link's nowrap text sets the column's minimum width, so long parent titles widen the column. Plan: contain the link's width so the ellipsis applies, and shrink its font slightly.
- 2026-10-27 01:25 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-27 01:25 · claude · Fixed: the parent link no longer sets the column's minimum width (contain: inline-size, width 100%), so long titles end in an ellipsis instead of widening the column; font 0.72 → 0.68rem. Checked in headless Chrome with the real stylesheet: column 579px before, 272px after, link clipped; click handler and tooltip unchanged.
- 2026-10-27 01:26 · claude · PR: https://github.com/atulprakash1/scrawl/pull/28
- 2026-10-27 01:27 · me · Moved to resolved (Resolved)
- 2026-10-27 01:27 · me · Shipped by hand
