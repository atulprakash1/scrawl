---
description: Pick up a Scrawl item, implement it on a branch, open a PR, and move it to review
argument-hint: <item number>
---
Resolve Scrawl item #$ARGUMENTS, following the "Scrawl work tracking" rules in CLAUDE.md.
Never commit to or push `main`. The user merges PRs on GitHub.

1. Sync: `git switch main` (if you're on another branch), then `sh .scrawl/hooks/scrawl-sync`.
   This pulls merged PRs from GitHub and keeps uncommitted board edits. If it prints a warning, tell me.
2. Find the item file: `.scrawl/items/` file whose name starts with the number padded to 4 digits
   (e.g. #42 → `0042-*.md`). Read it fully, including Activity comments from `me`.
   If it has a `parent`, skim the parent item's Description for context.
3. Pick it up: set `status: doing`, `assignee: claude`, update `updated:`, append an Activity line
   (`· claude · Picked up on branch scrawl/$ARGUMENTS-<slug>. <one-line plan>`). Save the file, then
   `git switch -c scrawl/$ARGUMENTS-<slug>` (short slug from the title). Uncommitted board edits come along.
4. Make a short plan, then implement. Keep scope to the Description and Acceptance criteria.
   Anything else you notice becomes a new item, not extra work.
5. Verify: run the tests if the project has them, otherwise check the acceptance criteria by hand.
   If you can't make it work, append an Activity line explaining why, leave it in `doing`, and stop
   (still do steps 7-8 with whatever is committed so the board stays in sync).
6. Finish the item: tick the acceptance boxes you verified, append a 1-3 sentence summary Activity
   line, set `status: review`, update `updated:`. Never set `resolved` or `done`.
7. Commit the code and all changed `.scrawl/` files (item file plus any pending board edits) with
   the message `#$ARGUMENTS <summary>`. Push the branch: `git push -u origin scrawl/$ARGUMENTS-<slug>`.
   Open the PR: `gh pr create --base main --title "#$ARGUMENTS <summary>" --body "<what and why, how verified>"`.
8. Hand the board back: `git switch main`, then
   `git restore --source=scrawl/$ARGUMENTS-<slug> --worktree -- .scrawl` so the board (which reads
   the main checkout) shows the item in review. Append an Activity line with the PR link
   (`· claude · PR: <url>`). Leave this uncommitted; the next PR carries it.
