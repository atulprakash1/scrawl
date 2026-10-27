---
id: 55
type: story
title: Prebuilt scrawl.html on GitHub Releases
status: review
parent: 54
assignee: claude
labels: [install]
created: 2026-10-27T09:56
updated: 2026-10-27T10:02
---
## Description
Users must run `node tools/bundle.mjs` to get `dist/scrawl.html`. Attach the built file to each GitHub Release (e.g. as part of `/release`, via `gh release upload`) so installing needs no Node.

## Acceptance
- [ ] `/release` builds `dist/scrawl.html` and attaches it to the release
- [x] README "In another repo" links to the latest release download; Node is only mentioned for developing Scrawl

## Activity
- 2026-10-27 09:56 · claude · Created under #54
- 2026-10-27 10:00 · me · Accepted (Someday pile)
- 2026-10-27 10:01 · claude · Picked up on the feature branch scrawl/54-one-click-install. Plan: /release builds and attaches dist/scrawl.html when the repo is Scrawl itself; README links the latest release download.
- 2026-10-27 10:02 · claude · /release step 6 now builds dist/scrawl.html from the tag and attaches it with gh release create/upload, only in the Scrawl repo (other repos have no bundler). README links releases/latest/download/scrawl.html. Not exercised: the first box (and the link) can only be checked at the next release, so I left it unticked.
- 2026-10-27 10:07 · claude · PR: https://github.com/atulprakash1/scrawl/pull/29
