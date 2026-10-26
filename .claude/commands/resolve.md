---
description: Pick up a Scrawl item, implement it on a branch, open a PR, and move it to review
argument-hint: <item number>
---
Resolve Scrawl item #$ARGUMENTS, following the "Scrawl work tracking" rules in CLAUDE.md.
Never commit to or push `main`. The user merges PRs on GitHub.

1. Sync: `sh .scrawl/hooks/scrawl-sync`. This pulls merged PRs from GitHub into `main` and saves the
   board (its own `scrawl-board` branch). If it prints a warning, tell me.
2. Find the item file: `.scrawl/items/` file whose name starts with the number padded to 4 digits
   (e.g. #42 → `0042-*.md`). Read it fully, including Activity comments from `me`.
   If it has a `parent`, skim the parent item's Description for context.
3. Pick it up: set `status: doing`, `assignee: claude`, update `updated:`, append an Activity line
   (`· claude · Picked up on branch scrawl/$ARGUMENTS-<slug>. <one-line plan>`). Save the file, then
   `git switch -c scrawl/$ARGUMENTS-<slug> main` (short slug from the title). The board isn't on any
   code branch, so switching never touches it.
4. Make a short plan, then implement. Keep scope to the Description and Acceptance criteria.
   Anything else you notice becomes a new item, not extra work.
5. Verify: run the tests if the project has them, otherwise check the acceptance criteria by hand.
   If you can't make it work, append an Activity line explaining why, leave it in `doing`, and stop
   (still do steps 7-8 with whatever is committed).
6. Finish the item: tick the acceptance boxes you verified, append a 1-3 sentence summary Activity
   line, set `status: review`, update `updated:`. Never set `resolved` or `done`.
7. Commit the code only (never `.scrawl/`) with the message `#$ARGUMENTS <summary>`. Push the branch:
   `git push -u origin scrawl/$ARGUMENTS-<slug>`.
   Open the PR: `gh pr create --base main --title "#$ARGUMENTS <summary>" --body "<what and why, how verified>"`.
8. Append an Activity line with the PR link (`· claude · PR: <url>`), then `git switch main` and
   `sh .scrawl/hooks/scrawl-sync` to save the board.
