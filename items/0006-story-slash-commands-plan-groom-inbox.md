---
id: 6
type: story
title: Slash commands: /plan, /groom, /inbox
status: done
parent: 3
assignee: claude
rank: d
labels: [phase-2]
created: 2026-10-25T13:30
updated: 2026-10-26T18:45
shipped: 23ef224
release: 0.1.0
---
## Description
`/plan` proposes features and stories from project.md, `/groom` splits big stories and fills acceptance, `/inbox` answers `@claude` comments.

## Acceptance
- [ ] `/plan` turns project.md into proposed features and stories (parent, size, acceptance) that show in the Plan view
- [ ] `/groom` splits oversized stories, fills missing acceptance and flags stale items, without changing any status
- [ ] `/inbox` answers every unanswered `@claude` comment with an Activity line

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-25 22:57 · me · Handed to Claude (Claude's tray)
- 2026-10-26 15:01 · claude · Picked up on branch scrawl/6-plan-groom-inbox. No acceptance yet, so I added three criteria from the description. Plan: write plan.md, groom.md and inbox.md in .claude/commands/, following the style of resolve.md and the CLAUDE.md protocol.
- 2026-10-26 15:03 · claude · Done: added /plan (proposed features and stories with parent, size and acceptance; `feature N` for one feature), /groom (proposes splits, fills missing acceptance on stories and bugs, flags stale items once, never changes status) and /inbox (answers unanswered @claude comments). I only dry-ran the detection rules on this board, so the boxes are unticked. Please try /plan in a fresh repo after the wizard.
- 2026-10-26 15:04 · claude · PR: https://github.com/atulprakash1/scrawl/pull/7
- 2026-10-26 18:45 · scrawl · Shipped: 23ef224 is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
