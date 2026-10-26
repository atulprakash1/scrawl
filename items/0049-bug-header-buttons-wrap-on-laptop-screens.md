---
id: 49
type: bug
title: Header buttons wrap on laptop screens
status: ready
severity: beetle
assignee: claude
labels: [ui]
created: 2026-10-27T00:21
updated: 2026-10-27T00:21
---
## Description
Between about 1100px and 1380px wide (common laptop widths, e.g. 1366px), the logo, centred tabs and actions don't fit on one row: "Hook up Claude" and the Ctrl K hint wrap onto two lines. The tabs should take their own row sooner, and button labels should never wrap.

## Acceptance
- [ ] At 1280-1380px no header button or hint wraps onto two lines
- [ ] The tabs move to their own centred row when the one-row layout doesn't fit

## Activity
- 2026-10-27 00:21 · claude · Created while working on #48 (seen in its 1300px screenshot)
