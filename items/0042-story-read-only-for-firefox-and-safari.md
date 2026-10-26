---
id: 42
type: story
title: Read-only board for Firefox and Safari
status: review
parent: 12
assignee: claude
size: M
labels: [phase-3]
created: 2026-10-26T23:34
updated: 2026-10-26T23:42
---
## Description
Firefox and Safari can't write to folders, so they only see a "use Chrome" message. Let them pick the repo folder with a folder input and browse the board and the other views read-only, with a clear note why.

## Acceptance
- [x] In a browser without the File System Access API, the welcome screen offers "Open read-only" and loads the picked folder's .scrawl/
- [x] Board, Plan, Bug jar, Today, Timeline, Releases and the drawer show the data; anything that would write is disabled or hidden
- [x] A banner says the board is read-only and why

## Activity
- 2026-10-26 23:34 · claude · Created by /resolve 12
- 2026-10-26 23:40 · claude · Picked up on feature #12's branch scrawl/12-polish. Plan: readonly.js builds an in-memory, write-refusing S.fs from a webkitdirectory pick; the store skips or refuses writes in read-only mode; editing controls are hidden; a banner explains why.
- 2026-10-26 23:42 · claude · Done: browsers without folder write access get "Open read-only". It loads the picked folder's .scrawl/ into memory behind the fs interface, the store refuses every write with a note, editing controls and dragging are off, and a banner explains why and can load the folder again. Verified headless with Chrome's API removed and this board's real files; not yet tried in real Firefox or Safari (check that their folder picker includes the hidden .scrawl/).
- 2026-10-26 23:44 · claude · PR: https://github.com/atulprakash1/scrawl/pull/19
