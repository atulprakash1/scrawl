---
description: Answer every @claude comment on the board
---
Answer the comments that mention `@claude`, following the "Scrawl work tracking" rules in CLAUDE.md.
Answering never changes an item's `status` and never touches code.

1. Sync: `sh .scrawl/hooks/scrawl-sync`. If it prints a warning, tell me.
2. Find the inbox: search `.scrawl/items/*.md` for Activity lines from `me` that mention
   `@claude`. One is unanswered when no `claude` line comes after it in the same item.
   If there are none, say the inbox is empty and stop.
3. For each unanswered comment, oldest first, read the whole item (and its parent's Description
   if it has one) and answer with one Activity line:
   `- <now> · claude · @me <answer>`. Keep it to 1-3 sentences on one line.
   - A question: answer it, looking at the code if you need to.
   - A request to change the item itself (reword, split, add acceptance, re-parent): make the
     change, then say what you changed.
   - A request for code work: don't start it. Say how you'd approach it and that it's ready for
     `/resolve <id>` once it's in Claude's tray. If it's new work, create a `proposed` item
     for it and give its number.
4. Update `updated:` on every item you answered.
5. Finish with a short list (item number, what was asked, what you answered), then run
   `sh .scrawl/hooks/scrawl-sync` to save the board.
