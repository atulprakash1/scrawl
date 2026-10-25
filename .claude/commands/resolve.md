---
description: Pick up a Scrawl item, implement it, commit, and move it to review
argument-hint: <item number>
---
Resolve Scrawl item #$ARGUMENTS, following the "Scrawl work tracking" rules in CLAUDE.md.

1. Find the item file: `.scrawl/items/` file whose name starts with the number padded to 4 digits
   (e.g. #42 → `0042-*.md`). Read it fully, including Activity comments from `me`.
   If it has a `parent`, skim the parent item's Description for context.
2. Pick it up: set `status: doing`, `assignee: claude`, update `updated:`, append an Activity line
   (`· claude · Picked up. <one-line plan>`). Save the file before touching code.
3. Make a short plan, then implement. Keep scope to the Description and Acceptance criteria.
   Anything else you notice becomes a new item, not extra work.
4. Verify: run the tests if the project has them, otherwise check the acceptance criteria by hand.
   If you can't make it work, append an Activity line explaining why, leave it in `doing`, and stop.
5. Finish the item: tick the acceptance boxes you verified, append a 1-3 sentence summary Activity
   line, set `status: review`, update `updated:`. Never set `done`.
6. Commit the code and the item file together with the message `#$ARGUMENTS <summary>`.
   The board links the commit to the item from the `#$ARGUMENTS` in the message.
