---
id: 55
type: story
title: Prebuilt scrawl.html on GitHub Releases
status: backlog
parent: 54
assignee: me
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T10:00
---
## Description
Users must run `node tools/bundle.mjs` to get `dist/scrawl.html`. Attach the built file to each GitHub Release (e.g. as part of `/release`, via `gh release upload`) so installing needs no Node.

## Acceptance
- [ ] `/release` builds `dist/scrawl.html` and attaches it to the release
- [ ] README "In another repo" links to the latest release download; Node is only mentioned for developing Scrawl

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
