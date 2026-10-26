---
id: 31
type: story
title: Columns, drawer and dialogs in the Studio style
status: review
parent: 23
assignee: claude
size: S
labels: [ui]
created: 2026-10-26T21:30
updated: 2026-10-26T21:38
---
## Description
Columns get clean headers (name, count, WIP), a calm background and a clear drop highlight. The item drawer and the Hook up dialog get the same surfaces, spacing and type.

## Acceptance
- [x] Column headers show name and count, with the WIP state visible
- [x] The drawer header shows the type badge, and its sections use the new spacing and type
- [x] The drop target highlight and the over-WIP state are still clear

## Activity
- 2026-10-26 21:30 · claude · Created by /resolve 23
- 2026-10-26 21:37 · claude · Picked up on feature #23's branch scrawl/23-studio-redesign. Plan: calm column panels with a status dot, name and count pill (red when over WIP), an accent drop highlight, the drawer header with the card's type badge, clean section labels, and the Hook up dialog on the same surfaces.
- 2026-10-26 21:38 · claude · Done: columns are calm panels with a status dot, an uppercase name and a count pill; over WIP turns the pill red and adds a red top bar, and the drop target glows in the accent colour. The drawer shows the card's type badge, a borderless title, a fields panel and small uppercase section labels, and activity has round avatars. The Hook up dialog uses the same surfaces with a blurred backdrop. Verified headless (over-WIP after a real drag) and by screenshots.
- 2026-10-26 21:42 · claude · PR: https://github.com/atulprakash1/scrawl/pull/12
