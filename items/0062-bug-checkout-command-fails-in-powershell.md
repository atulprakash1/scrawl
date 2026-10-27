---
id: 62
type: bug
title: Fresh-clone checkout command fails in Windows PowerShell
status: ready
severity: ant
assignee: claude
labels: [install]
created: 2026-10-27T21:40
updated: 2026-10-27T22:18
rank: i
---
## Description
Opening scrawl.html on a fresh clone shows `git worktree add .scrawl scrawl-board && sh .scrawl/hooks/scrawl-setup`
(`CHECKOUT` in app/js/main.js). Like #61, `&&` is a parse error in Windows PowerShell 5.1 and `sh` is
seldom on PATH there.

## Acceptance
- [ ] On Windows the fresh-clone screen shows a command that works pasted into PowerShell
- [ ] Other platforms keep the current command

## Activity
- 2026-10-27 21:40 · claude · Created while working on #61
- 2026-10-27 22:18 · me · Moved to ready (Claude's tray)
- 2026-10-27 22:18 · me · Handed to Claude (Claude's tray)
