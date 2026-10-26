---
id: 22
type: story
title: Keep the board on its own branch so it never dirties the project
status: resolved
assignee: claude
labels: [workflow]
created: 2026-10-26T11:45
updated: 2026-10-26T11:58
rank: i
---
## Description
Every card move, comment and index rebuild edits tracked files under `.scrawl/`, so the project's `git status` and PRs are always full of files that aren't the user's work. The board's state also follows whatever branch is checked out, which is why scrawl-home and the park/restore dance in scrawl-board exist (and why #21 happened).

Move the board onto its own `scrawl-board` branch with no shared history, checked out as a separate git worktree at `.scrawl/` and excluded from the project via `.git/info/exclude`. The browser keeps reading `.scrawl/` as before. `scrawl-sync` commits and pushes the board branch quietly; code branches and PRs carry code only. Rebuilt files (`index.json`, `log/commits.txt`, `log/main.txt`) aren't tracked at all.

## Acceptance
- [x] Moving cards, commenting or Claude editing items leaves the project's `git status` clean
- [x] Switching branches never touches the board; scrawl-home and the park/restore helper are gone
- [x] scrawl-sync fast-forwards main and commits + pushes the board branch without user action
- [x] `index.json` and the commit logs are not tracked anywhere
- [x] A one-time `scrawl-setup` moves an existing `.scrawl/` folder onto the board branch; a fresh clone gets the board with one documented command
- [x] Commits still link to cards and merged PRs still ship them
- [x] CLAUDE.md, /resolve, /next and README describe the new flow

## Activity
- 2026-10-26 11:45 · claude · Created from chat: untracked board files in the project's git status confuse people; the tool's own bookkeeping should be invisible (option C).
- 2026-10-26 11:45 · claude · Picked up on branch scrawl/22-board-on-own-branch. Plan: scrawl-setup to move .scrawl/ onto an orphan scrawl-board worktree, scrawl-sync to save/push the board, drop scrawl-home/scrawl-board, update protocol and docs, test in a throwaway repo.
- 2026-10-26 11:54 · claude · .scrawl/ is now its own worktree on the scrawl-board branch (excluded via .git/info/exclude): scrawl-setup does the one-time move in place, scrawl-sync commits and pushes the board, and scrawl-home and the park/restore helper are gone. index.json and the commit logs aren't tracked anymore. 35 checks in throwaway repos (migration, fresh clone, two machines, conflicts, new project) pass, and this repo is migrated.
- 2026-10-26 11:55 · claude · PR: https://github.com/atulprakash1/scrawl/pull/4
- 2026-10-26 11:58 · me · Moved to resolved (Resolved)
- 2026-10-26 11:58 · me · Moved to review (Eyeball it)
- 2026-10-26 11:58 · me · Moved to resolved (Resolved)
