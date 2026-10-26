---
id: 35
type: story
title: upload option in description
status: done
assignee: claude
rank: k
labels: []
created: 2026-10-26T22:48
updated: 2026-10-26T23:00
shipped: 06fa3e1
release: 0.1.0
---
## Description
the description field could use a upload functionality. user can provide some sample for inspiration, bug fixing, etc. drag and drop should also work, but active area is only the description box.

## Acceptance
- [x] user is able to upload file
- [x] llm/chat is able to pick up this file when resolving the items.

## Activity
- 2026-10-26 22:48 · me · Created
- 2026-10-26 22:51 · me · Handed to Claude (Claude's tray)
- 2026-10-26 22:52 · claude · Picked up on branch scrawl/35-attachments. Plan: an Attach button and drag-and-drop on the description box save files to .scrawl/attachments/<id>/ and link them in the Description (images shown inline, plus an Attachments list); the protocol and /resolve tell Claude to open them.
- 2026-10-26 22:55 · claude · Done: an "attach" link and drag-and-drop (only on the description box) save files to .scrawl/attachments/<id>/ and add Markdown links to the Description. Images show inline, and there's an Attachments list. The protocol and /resolve now tell Claude to open linked attachments, and templates.js is regenerated. Verified headless (drop, picker, rename on clash, edit mode, 20 MB limit, drops outside the box ignored), and opened an attachment by following an item's link.
- 2026-10-26 22:55 · claude · PR: https://github.com/atulprakash1/scrawl/pull/15
- 2026-10-26 22:59 · me · Moved to resolved (Resolved)
- 2026-10-26 23:00 · scrawl · Shipped: 06fa3e1 is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
