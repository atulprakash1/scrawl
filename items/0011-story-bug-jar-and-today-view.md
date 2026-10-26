---
id: 11
type: story
title: Bug jar and Today view
status: resolved
parent: 8
assignee: claude
rank: m
labels: [phase-3]
created: 2026-10-25T13:30
updated: 2026-10-26T20:35
---
## Description
Bugs by severity and age as critters in a jar, one-line quick add, "Hand to Claude". Today: what changed since last visit, what waits for you, what is stale.

## Acceptance
- [x] A Bug jar view shows open bugs as critters, worst severity then oldest first, with a one-line quick add (title + severity)
- [x] Each bug has "Hand to Claude", which moves it to Claude's tray
- [x] A Today view shows what Claude or git changed since your last visit, what waits for you (review, questions to @me) and what is stale

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-26 21:20 · claude · Added acceptance criteria; correct them at review if I guessed wrong.
- 2026-10-26 21:20 · claude · Picked up on feature #8's branch scrawl/8-visibility. Plan: bugs.js (jar, quick add, Hand to Claude) and today.js (last visit kept per project in the browser; changes since, waiting, stale with the /groom thresholds).
- 2026-10-26 21:40 · claude · Done: the Bug jar shows open bugs as critters (worst severity, then oldest), with a title + severity quick add and Hand to Claude. Today shows Claude and git changes since your last visit (kept per project in the browser), review items and questions to @me, and stale items with the /groom thresholds. Verified headless with screenshots.
- 2026-10-26 21:52 · claude · PR: https://github.com/atulprakash1/scrawl/pull/11
- 2026-10-26 20:35 · me · Moved to resolved (Resolved)
