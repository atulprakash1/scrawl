---
id: 49
type: bug
title: Header buttons wrap on laptop screens
status: done
severity: beetle
assignee: claude
labels: [ui]
created: 2026-10-27T00:21
updated: 2026-10-27T15:39
rank: i
shipped: f18c4a3
release: 0.2.1
---
## Description
Between about 1100px and 1380px wide (common laptop widths, e.g. 1366px), the logo, centred tabs and actions don't fit on one row: "Hook up Claude" and the Ctrl K hint wrap onto two lines. The tabs should take their own row sooner, and button labels should never wrap.

## Acceptance
- [x] At 1280-1380px no header button or hint wraps onto two lines
- [x] The tabs move to their own centred row when the one-row layout doesn't fit

## Activity
- 2026-10-27 00:21 · claude · Created while working on #48 (seen in its 1300px screenshot)
- 2026-10-27 15:36 · claude · Picked up on branch scrawl/49-header-wrap. Plan: labels never wrap (nowrap), and the tabs drop to their own centred row at a wider breakpoint, measured in headless Chrome at 1100-1400px.
- 2026-10-27 15:38 · claude · The actions column now keeps its natural width and its labels never wrap; the tabs move to their own centred row at 1200px (one row needs about 1160px). Measured in headless Chrome at 900-1600px: no button or hint grows taller, nothing overlaps or scrolls; between 1201 and 1360px the tabs sit up to 77px left of centre. A long project name still overlaps the tabs (also on main): filed as #59.
- 2026-10-27 15:38 · claude · PR: https://github.com/atulprakash1/scrawl/pull/31
- 2026-10-27 15:39 · me · Moved to resolved (Resolved)
- 2026-10-27 15:39 · scrawl · Shipped: f18c4a3 is on main
- 2026-10-27 20:50 · claude · Released in v0.2.1
