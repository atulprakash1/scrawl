---
id: 18
type: story
title: Branch and PR flow with auto-sync of main
status: review
assignee: claude
labels: [workflow]
created: 2026-10-25T14:23
updated: 2026-10-25T14:27
---
## Description
Work must never go to `main` directly. `/resolve` and `/next` do each item on its own branch (`scrawl/<id>-<slug>`), push it and open a PR; the user merges on GitHub.
Nobody should have to `git pull` by hand: every Claude command starts by syncing `main` from GitHub, and the board ships cards whose work has landed on `main`.
Must cope with GitHub's merge styles: squash (`#18 Title (#12)`, where #12 is the PR) and merge commits (`Merge pull request #12 from …/scrawl/18-…`).
Board edits that are not committed yet (moves, comments) travel with the next PR instead of going to `main`. No background sync for now.

## Acceptance
- [x] /resolve and /next work on a branch, push it and open a PR; nothing is pushed to main
- [x] Every command first syncs main from GitHub without a manual pull, keeping uncommitted board edits
- [x] A merged PR (merge, squash or rebase) moves the card to Shipped
- [x] PR numbers in commit titles don't link commits to the wrong card
- [x] A shipped card that is reopened doesn't ship again from its old commits

## Activity
- 2026-10-25 14:23 · me · Asked for branch + PR flow and no manual git pull (via chat)
- 2026-10-25 14:23 · claude · Picked up on branch scrawl/18-branch-and-pr-flow. Plan: scrawl-sync script, item numbers read only from a leading #N or the scrawl/N- branch name, main.txt with subjects, shipped guard, protocol and command updates.
- 2026-10-25 14:27 · claude · New scrawl-sync script fast-forwards main from GitHub at the start of every /resolve and /next and keeps uncommitted board edits; cards in review or Resolved ship when their PR lands on main (merge, squash or rebase), matching only a leading #N or the scrawl/N- branch name, with a shipped: marker so reopened cards need a newer merge. Verified with 11 sync checks against a throwaway remote and 69 browser checks; this PR is the first run of the new flow.
- 2026-10-25 14:29 · claude · Added scrawl-home: the open board rewrote index.json after the commit and blocked the switch back to main, so handing the board back now parks live board edits and lays them over the branch state (5 more checks).
