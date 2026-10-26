---
id: 30
type: story
title: Studio cards on the board
status: done
parent: 23
assignee: claude
size: M
labels: [ui]
created: 2026-10-26T21:30
updated: 2026-10-26T22:02
shipped: c99bd64
---
## Description
Replace the sticky notes with Studio cards: a thick colour band on the left by type, a type badge with icon and word, title, and a footer of chips (assignee, acceptance, commits, labels). Layered shadow, lift on hover. NEEDS YOU and SHIPPED become tidy badges.

## Acceptance
- [x] Cards have a colour band and a type badge per type, and no tape or tilt
- [x] Footer chips for assignee, acceptance x/y, commits and labels
- [x] Drag and drop, keyboard focus and the review/shipped markers still work

## Activity
- 2026-10-26 21:30 · claude · Created by /resolve 23
- 2026-10-26 21:34 · claude · Picked up on feature #23's branch scrawl/23-studio-redesign. Plan: new card markup in board.js (type badge, id, title, footer chips with an acceptance meter, status badge in the footer) and Studio card CSS (colour band, tint, layered shadow, no tape or tilt).
- 2026-10-26 21:37 · claude · Done: the sticky notes are replaced by Studio cards. Each has a colour band and soft tint per type, a TYPE badge, the id on the right, a semibold title, and footer chips (assignee, acceptance x/y with a small meter, commits, labels) with Needs you / Shipped badges. Tape and tilt are gone. Verified headless: pointer drag to another column, focus ring, Enter opens the drawer, screenshots in light and dark.
- 2026-10-26 21:42 · claude · PR: https://github.com/atulprakash1/scrawl/pull/12
- 2026-10-26 21:49 · me · Reviewed and accepted (Resolved)
- 2026-10-26 22:02 · scrawl · Shipped: c99bd64 is on main
