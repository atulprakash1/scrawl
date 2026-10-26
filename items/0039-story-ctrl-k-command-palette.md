---
id: 39
type: story
title: Ctrl+K command palette
status: review
parent: 12
assignee: claude
size: M
labels: [phase-3]
created: 2026-10-26T23:34
updated: 2026-10-26T23:35
---
## Description
A command palette on Ctrl+K (Cmd+K on macOS): type to find an item by number or title and open it, switch views, copy /resolve N or /next, and add a bug or story, all without the mouse.

## Acceptance
- [x] Ctrl/Cmd+K opens the palette from any view; Esc closes it
- [x] Typing filters items by #number or title; Enter opens the item in the drawer
- [x] It also offers: switch to each view, copy /resolve N for the selected item, copy /next, add a bug or story with the typed text
- [x] Arrow keys move the selection; it works in light and dark

## Activity
- 2026-10-26 23:34 · claude · Created by /resolve 12
- 2026-10-26 23:34 · claude · Picked up on feature #12's branch scrawl/12-polish. Plan: palette.js with a <dialog>, one ranked list of items, views and commands, arrow/Enter/Esc keys; expose setView from main.js.
- 2026-10-26 23:35 · claude · Done: Ctrl/Cmd+K (or the Search button in the header) opens a palette that finds items by #number or title and opens them, switches views, copies /resolve N and /next, and adds a story or bug ("bug: …" picks the type). Arrow keys, Enter and Esc; verified headless with a screenshot.
- 2026-10-26 23:44 · claude · PR: https://github.com/atulprakash1/scrawl/pull/19
