---
id: 56
type: story
title: Finishing the wizard hooks up Claude automatically
status: done
parent: 54
assignee: claude
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T11:00
shipped: a26eae9
---
## Description
Start Scrawl and Hook up Claude are separate actions. When the wizard finishes in a repo that isn't hooked up yet, run the hook-up right away and show the one setup command to paste. The Hook up Claude button stays for re-running/refreshing.

## Acceptance
- [x] Finishing the wizard writes CLAUDE.md/AGENTS.md, the commands and the hooks, and shows the setup command with a copy button
- [x] Existing CLAUDE.md text and commands are still never overwritten
- [x] Hook up Claude still works on its own

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
- 2026-10-27 10:02 · claude · Picked up on the feature branch scrawl/54-one-click-install. Plan: when the wizard writes project.md in a repo without the protocol or hooks, run the hook-up and show its file list, the setup command and /plan on the same screen.
- 2026-10-27 10:04 · claude · Finishing the wizard now runs the hook-up when CLAUDE.md lacks the protocol or .scrawl/hooks/scrawl-setup is missing, then shows the written files, the setup command and /plan on one screen; a failed hook-up toasts and still shows /plan. Verified with a stubbed fs/DOM harness (new repo, own CLAUDE.md and command kept, already hooked up, write failure); not clicked through in a real browser.
- 2026-10-27 10:07 · claude · PR: https://github.com/atulprakash1/scrawl/pull/29
- 2026-10-27 11:00 · scrawl · Shipped: a26eae9 is on main
