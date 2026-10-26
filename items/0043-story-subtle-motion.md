---
id: 43
type: story
title: Subtle motion: Claude was here, and a ship celebration
status: review
parent: 12
assignee: claude
size: S
labels: [phase-3]
created: 2026-10-26T23:34
updated: 2026-10-26T23:43
---
## Description
Studio-style motion instead of the sketchbook footprints: cards that Claude (or anything outside the board) changes get a short highlight, and a card that ships gets a small celebration. Everything is off under reduced motion.

## Acceptance
- [x] A card changed outside the board briefly glows in the accent colour
- [x] A card that becomes Shipped gets a short celebration on the board
- [x] Both are skipped under prefers-reduced-motion

## Activity
- 2026-10-26 23:34 · claude · Created by /resolve 12
- 2026-10-26 23:42 · claude · Picked up on feature #12's branch scrawl/12-polish. Plan: board.flash() adds a short accent glow to cards changed outside the board; render() notices cards that just became Shipped and fires a small confetti burst; both skipped under reduced motion.
- 2026-10-26 23:43 · claude · Done: cards changed outside the board pulse with an accent glow, and a card that becomes Shipped bursts into a small confetti of the type colours (from the Shipped header if that column is folded). Both are off under reduced motion. Verified headless with and without --force-prefers-reduced-motion.
- 2026-10-26 23:44 · claude · PR: https://github.com/atulprakash1/scrawl/pull/19
