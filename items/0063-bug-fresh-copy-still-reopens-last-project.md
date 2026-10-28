---
id: 63
type: bug
title: scrawl.html in an empty folder still opens the last project
status: review
severity: beetle
assignee: claude
labels: [install]
created: 2026-10-28T10:00
updated: 2026-10-28T10:20
---
## Description
User report after v0.2.2: scrawl.html in an empty folder still opens the last project directly.

#60 keys the folder to reopen by the page's path, but whatever that page ever opened is remembered,
e.g. clicking another project under Recent projects once. From then on the copy in the new folder
auto-opens that board on every visit. Auto-open should only happen for a folder that holds this
scrawl.html; anything else gets the one-click reopen screen with Recent projects.

## Acceptance
- [ ] A scrawl.html whose remembered folder doesn't contain it shows the welcome screen (one-click reopen + Recent projects) instead of opening that board
- [ ] scrawl.html at a repo's root (or below it) still goes straight to that repo's board
- [ ] Picking the empty folder from the welcome screen starts the normal setup

## Activity
- 2026-10-28 10:00 · claude · Created from user report: v0.2.2 in an empty folder still opens the last project
- 2026-10-28 10:00 · claude · Picked up on branch scrawl/63-reopen-only-own-folder. Auto-open only a folder that contains this scrawl.html.
- 2026-10-28 10:20 · claude · Boot now auto-opens the remembered folder only if this scrawl.html sits inside it (fs.holdsPage); otherwise it shows the welcome screen with one-click reopen and Recent projects. Path check tested in Node; not browser-tested, so the boxes are left for review.
- 2026-10-28 10:20 · claude · PR: https://github.com/atulprakash1/scrawl/pull/37
