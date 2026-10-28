---
id: 66
type: idea
title: Remove the unused Patrick Hand font from vendor/
status: backlog
assignee: me
labels: []
created: 2026-10-28T14:20
updated: 2026-10-28T14:20
---
## Description
`vendor/fonts/patrick-hand-latin-400.woff2` is listed in vendor/NOTICE.md but no CSS or HTML loads it
(only Caveat is used since the Studio redesign). Remove it and its NOTICE row, unless it's meant to come back.

## Acceptance
- [ ] Font file and NOTICE.md row removed, nothing else references it

## Activity
- 2026-10-28 14:20 · claude · Created while working on #65
