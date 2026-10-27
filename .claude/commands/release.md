---
description: Write the release notes for shipped items and tag main
argument-hint: <version, e.g. 0.2.0>
---
Release version $ARGUMENTS, following the "Scrawl work tracking" rules in CLAUDE.md.
This tags `main` but never commits to it; the release notes live on the board.

1. Sync: `sh .scrawl/hooks/scrawl-sync`. If it prints a warning, tell me and stop.
2. Check the version: it must look like `1.2.3` (no leading `v`). No version given? Suggest one minor
   above the newest file in `.scrawl/releases/` (or `0.1.0` if there is none), ask, and stop.
   If the tag `v<version>` or `.scrawl/releases/v<version>.md` already exists, say so and stop.
3. Collect the items: `status: done` and no `release:` field in the header. None? Say there's
   nothing to release and stop.
4. Write `.scrawl/releases/v<version>.md` in exactly this format (the board's Releases view
   previews the same thing). Leave out empty groups. Within a group, sort by id. Types other than
   these four count as Improvements.

   ```
   # v0.2.0

   2026-10-26

   ## Features
   - #3 Planning: wizard, /plan and the Plan view

   ## Improvements
   - #4 Project wizard writes project.md

   ## Bug fixes
   - #21 Retry sync and hand-back when the open board writes mid-switch

   ## Ideas
   - #24 Accept a proposed feature together with its stories
   ```

   The date is today, local time.
5. On every released item, add `release: <version>` to the header (keep every other line as it is)
   and append `· claude · Released in v<version>`. Leave `updated:` alone, so the Shipped column
   keeps its order.
6. Tag the newest commit on main and push the tag:
   `git tag -a v<version> main -m "v<version>"`, then `git push origin v<version>`.
   Only in the Scrawl repo itself (it has `tools/bundle.mjs`): build the board from the tag and
   publish it, so other projects can download it without Node:
   `git switch --detach v<version>`, `node tools/bundle.mjs`, `git switch -`, then
   `gh release create v<version> dist/scrawl.html --title v<version> --notes-file .scrawl/releases/v<version>.md`.
   If the GitHub release exists already, `gh release upload v<version> dist/scrawl.html --clobber`.
7. Run `sh .scrawl/hooks/scrawl-sync` to save the board, then tell me the version, how many items it
   has per group, and the tag.
