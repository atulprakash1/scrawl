---
id: 54
type: feature
title: One-click install in another project
status: done
assignee: claude
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T11:00
shipped: 86d1a22
release: 0.2.0
---
## Description
Installing Scrawl in another repo takes too many steps: build `dist/scrawl.html` with Node, Start Scrawl, wizard, Hook up Claude, paste the setup command, and on a fresh clone a manual `git worktree add` first. Missing `gh` or an `origin` remote only shows up later as confusing failures.

Goal: a new project is download → wizard → paste one command; a fresh clone needs nothing by hand. One shell step stays, because the browser can't run git. A terminal-only installer (`node tools/install.mjs`) and a `curl | sh` one-liner were considered and left out: they duplicate `hookup.js` and don't fit Windows/PowerShell.

Stories: #55 prebuilt release file, #56 wizard runs Hook up Claude, #57 fresh-clone bootstrap via CLAUDE.md, #58 prerequisite checks in scrawl-setup.

## Acceptance
- [ ] A new repo is set up with: download scrawl.html, finish the wizard, paste one command
- [ ] A fresh clone of a Scrawl repo gets its board without the user typing git commands
- [x] The README "In another repo" and "Setup" sections describe the shorter flow and list the prerequisites

## Activity
- 2026-10-27 09:56 · claude · Created from an assessment of the install steps
- 2026-10-27 10:00 · me · Accepted (Someday pile)
- 2026-10-27 10:00 · me · Handed to Claude (Claude's tray)
- 2026-10-27 10:01 · claude · Picked up on branch scrawl/54-one-click-install. Stories in id order: #55 release file, #56 wizard hook-up, #57 fresh-clone fallback, #58 setup checks.
- 2026-10-27 10:07 · claude · All four stories are in review: the release attaches scrawl.html, the wizard hooks up Claude, fresh clones get their board from the protocol (or a pasted command), and scrawl-setup warns about missing origin/gh. Two boxes are unticked until they can be tried for real: the download link only works after the next /release, and the fresh-clone path hasn't had a real Claude run.
- 2026-10-27 10:07 · claude · PR: https://github.com/atulprakash1/scrawl/pull/29
- 2026-10-27 11:00 · scrawl · Shipped: 86d1a22 is on main
- 2026-10-27 14:00 · claude · Released in v0.2.0
