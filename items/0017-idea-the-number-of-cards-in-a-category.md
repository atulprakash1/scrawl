---
id: 17
type: idea
title: the number of cards in a category
status: done
assignee: claude
rank: w
labels: []
created: 2026-10-25T13:52
updated: 2026-10-25T14:09
---
## Description
the number of cards in Someday Pile and Shipped would grow and may look like a pile no one cares about. Especially for the Shipped category. may be we have one category before Shipped named as Resolved, to show what was done, especially when committed. when the branch is merged to main, it should be considered as shipped. the Shipped card could be hidden by default and shown when clicked expand button to show the history of shipped items. Use this to setup remote - https://github.com/atulprakash1/scrawl.git

## Acceptance
- [x] repo is connected to remote.
- [x] New card Resolve is created and card moves to it when the work is committed
- [x] Shipped is hidden by default. Expand button to see the past shipped items.

## Activity
- 2026-10-25 13:52 · me · Created
- 2026-10-25 14:00 · me · Handed to Claude (Claude's tray)
- 2026-10-25 14:01 · claude · Picked up. Plan: connect the GitHub remote, add a Resolved column before Shipped, and collapse Shipped behind an expand button.
- 2026-10-25 14:07 · claude · Added origin (github.com/atulprakash1/scrawl) and pushed main. New Resolved column: Accept on a reviewed card moves it there, and it ships by itself once one of its commits is on main (the hooks now write .scrawl/log/main.txt after commits, merges and pulls). Shipped is folded by default with a show/hide button; since you commit straight to main, accepted cards with a commit ship right away.
- 2026-10-25 14:09 · me · Reviewed and accepted (Resolved)
- 2026-10-25 14:09 · scrawl · Shipped: 9b13fbf is on main
