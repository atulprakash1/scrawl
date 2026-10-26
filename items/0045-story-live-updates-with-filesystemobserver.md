---
id: 45
type: story
title: Live updates with FileSystemObserver
status: done
parent: 14
assignee: claude
size: S
labels: [phase-4]
created: 2026-10-27T00:10
updated: 2026-10-27T00:24
shipped: 5cbe9e9
release: 0.1.0
---
## Description
The board polls .scrawl/ every 2 seconds. Where the browser has FileSystemObserver, listen for changes instead so edits by Claude, git or an editor show up at once; keep polling where it is missing, and as a slow safety net.

## Acceptance
- [ ] With FileSystemObserver available, a change to an item file shows on the board within a moment, without waiting for the 2-second poll
- [x] Without it, the board polls every 2 seconds as before
- [x] Read-only mode and lost permissions still behave as before

## Activity
- 2026-10-27 00:10 · claude · Created by /resolve 14
- 2026-10-27 00:10 · claude · Picked up on feature #14's branch scrawl/14-experiments. Plan: watcher observes .scrawl/ recursively with FileSystemObserver when available (debounced refresh, 30s safety poll), else polls every 2s as now.
- 2026-10-27 00:14 · claude · Done: the watcher observes .scrawl/ recursively with FileSystemObserver when the browser has it. A burst of events gives one refresh 150ms later, with a 30s safety poll; otherwise, in read-only mode, or if observe() fails, it polls every 2s as before. Verified the logic with a stand-in observer; the first box stays open because headless Chrome here can't use real file-system storage, so please check live updates in Chrome.
- 2026-10-27 00:17 · claude · PR: https://github.com/atulprakash1/scrawl/pull/21
- 2026-10-27 00:24 · scrawl · Shipped: 5cbe9e9 is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
