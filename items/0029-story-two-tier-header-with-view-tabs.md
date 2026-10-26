---
id: 29
type: story
title: Two-tier header with view tabs
status: done
parent: 23
assignee: claude
size: S
labels: [ui]
created: 2026-10-26T21:30
updated: 2026-10-26T22:02
shipped: a8fd28e
release: 0.1.0
---
## Description
A roomier header: logo, project and actions (Hook up Claude, folder, theme) on top, the views as tabs below, and the add and filter toolbar only on the Board. Also covers idea #27.

## Acceptance
- [x] Top row: logo, project name and actions; second row: view tabs with a clear active tab
- [x] Quick add and the filters show only on the Board view
- [x] The header stays tidy (no wrapping) at 1000px and stacks cleanly on a phone

## Activity
- 2026-10-26 21:30 · claude · Created by /resolve 23
- 2026-10-26 21:33 · claude · Picked up on feature #23's branch scrawl/23-studio-redesign. Plan: header rows in scrawl.html (brand + actions, then tabs + board tools), tools hidden off the Board in setView, CSS for both rows and the phone layout.
- 2026-10-26 21:34 · claude · Done: the header has two rows. The top has the logo / project crumb and the actions; below are underlined view tabs, with quick add and the filters on the right, shown only on the Board. Measured: no overflow at 1000px or at the narrowest headless width (500px), where the tools wrap under the tabs and the Hook up label shrinks to its icon.
- 2026-10-26 21:42 · claude · PR: https://github.com/atulprakash1/scrawl/pull/12
- 2026-10-26 21:49 · me · Reviewed and accepted (Resolved)
- 2026-10-26 22:02 · scrawl · Shipped: a8fd28e is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
