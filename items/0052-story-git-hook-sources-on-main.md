---
id: 52
type: story
title: Git hook sources on main
status: done
assignee: claude
labels: []
created: 2026-10-27T01:05
updated: 2026-10-27T01:23
rank: i
shipped: 16968d1
release: 0.2.0
---
## Description
The git hook scripts are part of the tool, but their only copy is `.scrawl/hooks/` on the
`scrawl-board` branch. Someone who clones `main` can't run `node tools/bundle.mjs`, which
reads them from there. Before the repo goes public they should live on `main`, with the board's
copy kept as Scrawl's own installed hooks.

## Acceptance
- [x] The hook sources live on `main` (`templates/hooks/`, executable, LF)
- [x] `node tools/bundle.mjs` works in a clone without the board checked out
- [x] `app/js/templates.js` still writes the hooks to `.scrawl/hooks/` in other repos (unchanged output)
- [x] When the board is checked out, the bundler refreshes `.scrawl/hooks/` from the sources
- [x] README and CLAUDE.md point at the new location

## Activity
- 2026-10-27 01:05 · claude · Created from the open-source prep (step 2), with acceptance from the description. Picked up.
- 2026-10-27 01:07 · claude · Moved the hooks to templates/hooks/ on main; the bundler reads them there and refreshes .scrawl/hooks/ when the board is present. templates.js output is unchanged, and the bundler runs in a clone without the board. PR #27.
- 2026-10-27 01:22 · me · Moved to resolved (Resolved)
- 2026-10-27 01:23 · scrawl · Shipped: 16968d1 is on main
- 2026-10-27 14:00 · claude · Released in v0.2.0
