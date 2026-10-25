---
description: Take the top card from Claude's tray and resolve it
---
Take the next item from Claude's tray and resolve it.

1. Find candidates: items in `.scrawl/items/` with `status: ready` and `assignee: claude`.
   (`.scrawl/index.json` is a quick start, but confirm in the item files.)
2. Pick the one with the lowest `rank` (plain string comparison; items without a rank come last,
   then lowest id). If the tray is empty, say so and stop.
3. Tell me which item you picked, then follow `.claude/commands/resolve.md` for it exactly.
