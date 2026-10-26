---
id: 10
type: story
title: Releases view and /release command
status: done
parent: 8
assignee: claude
rank: i
labels: [phase-3]
created: 2026-10-25T13:30
updated: 2026-10-26T21:27
shipped: e49e782
---
## Description
`/release 0.2.0` tags the repo and writes `.scrawl/releases/v0.2.0.md` from done items. The view previews the next changelog.

## Acceptance
- [x] A Releases view shows each `.scrawl/releases/v*.md`, newest first
- [x] It previews the next changelog from shipped items that aren't in a release yet
- [ ] `/release <version>` writes the release file in the same format, marks those items with `release:` and tags main

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-26 20:32 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-26 20:32 · claude · Picked up on feature #8's branch scrawl/8-visibility. Plan: generalise the view switch, add a Releases view (past pages and a next-release preview), and a /release command that writes the same format and tags main.
- 2026-10-26 20:55 · claude · Done: a Releases view shows .scrawl/releases/v*.md as notebook pages (newest version first, live), with a preview of the next changelog from shipped items that have no `release:` field and a copy button for /release. /release writes the same format, marks the items and tags main. The view is verified headless; /release itself hasn't been run, because that would tag this repo.
- 2026-10-26 20:29 · me · Moved to resolved (Resolved)
- 2026-10-26 21:52 · claude · PR: https://github.com/atulprakash1/scrawl/pull/11
- 2026-10-26 21:27 · scrawl · Shipped: e49e782 is on main
