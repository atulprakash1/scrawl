---
description: Split oversized stories, fill missing acceptance, flag stale items
---
Groom the Scrawl board, following the "Scrawl work tracking" rules in CLAUDE.md.
Grooming never changes an item's `status` and never touches code. Leave items in `resolved`,
`done` and `wontfix` alone, and don't edit an item that is `doing` with `assignee: claude`
(someone is working on it).

1. Sync: `sh .scrawl/hooks/scrawl-sync`. If it prints a warning, tell me.
2. Read `.scrawl/index.json`, then the item files you need.
3. Split oversized stories. A story is oversized when it has `size: L`, more than about six
   Acceptance boxes, or clearly won't fit one Claude session.
   - Create the smaller stories as new items (template and `nextId` rules in CLAUDE.md) with
     `status: proposed`, `assignee: me`, the same `parent` as the original, a `size`, and the
     original's acceptance boxes shared out between them.
   - On the original, only append an Activity line:
     `· claude · Groomed: proposed a split into #a, #b, #c. Reject this one once you accept them.`
4. Fill missing acceptance. For each story or bug with an empty Acceptance section,
   add 2-5 `- [ ]` boxes that follow from its Description, and append
   `· claude · Groomed: added acceptance criteria. Edit them if I guessed wrong.`
   If the Description is too thin to guess from, ask in an Activity line instead.
   Skip features: their stories are their acceptance.
5. Flag stale items: `doing` or `review` with `updated:` more than 14 days ago, or `ready` for more
   than 30 days. Append `· claude · Groomed: stale since <date>. Still wanted?`
   Don't change `updated:` on items you only flag, so they keep showing as stale, and skip items
   whose last Activity line is already such a flag.
6. Update `updated:` on every item whose content you changed (steps 3 and 4).
7. Finish with a short list of what you split, filled and flagged, then run
   `sh .scrawl/hooks/scrawl-sync` to save the board.
