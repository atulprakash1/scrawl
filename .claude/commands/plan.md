---
description: Propose features and stories from project.md for the Plan view
argument-hint: [feature <number>]
---
Plan this project into Scrawl items, following the "Scrawl work tracking" rules in CLAUDE.md.
You only propose: every item you create is `status: proposed`, and the user accepts or rejects
it in the Plan view. Don't write code, and don't touch existing items except as said below.

1. Sync: `sh .scrawl/hooks/scrawl-sync`. If it prints a warning, tell me.
2. Read `.scrawl/project.md`. If it has nothing under its headings, stop and tell me to fill in
   the project wizard on the board first.
3. Read `.scrawl/index.json` for what already exists (confirm in the item files when unsure).
   Don't propose anything that duplicates an existing item, whatever its status.
4. Scope (arguments: "$ARGUMENTS"):
   - No arguments: propose the features (3-8 user-visible capabilities, covering the must-haves,
     nothing from "Out of scope") and the stories for each.
   - `feature <number>`: propose stories for that one existing feature only.
     Use this on a big project to keep each run small.
5. Create one file per item with the template in CLAUDE.md, taking each id from `nextId` in
   `.scrawl/config.json` and incrementing it there before the next one. For every item:
   - `status: proposed`, `assignee: me`, no `rank`.
   - Stories: `parent: <feature id>` and `size: S | M | L`. S is under an hour, M fits one
     Claude session, L needs splitting later with `/groom`. Aim for S and M.
   - A short Description saying what and why. If an item needs another one first, end the
     Description with `Depends on #N.`
   - 2-5 Acceptance boxes, each an observable outcome you could check by hand.
   - One Activity line: `- <now> · claude · Proposed by /plan`
6. Finish with a short outline (features with their stories, ids and sizes) and tell me to
   accept or reject them in the board's Plan view. Then run `sh .scrawl/hooks/scrawl-sync`
   to save the board.
