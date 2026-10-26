---
id: 48
type: bug
title: Show the project name next to the logo again
status: done
severity: beetle
assignee: claude
labels: [ui]
created: 2026-10-27T00:20
updated: 2026-10-27T00:30
rank: i
shipped: c5ca390
release: 0.1.0
---
## Description
#44 hid "/ <project>" when the project is called Scrawl, so the header shows only the logo and you can't tell which project is open. Logo and project name together worked better; always show the project name again.

## Acceptance
- [x] The header always shows "Scrawl. / <project name>", including for a project called Scrawl
- [x] The rest of the #44 header (centred tabs, bigger logo) is unchanged

## Activity
- 2026-10-27 00:20 · claude · Created from your feedback after #44: "having logo and the project name was a good idea. bring back that design."
- 2026-10-27 00:20 · claude · Picked up on branch scrawl/48-project-name. Plan: remove the same-name rule (main.js toggle and its CSS); keep the phone rule that hides the name on very narrow screens.
- 2026-10-27 00:21 · claude · Done: removed the rule that hid "/ <project>" for a project called Scrawl, so the header always shows logo and project name. Checked headless for "Scrawl" and "demo": name and slash shown, tabs still centred, logo unchanged.
- 2026-10-27 00:22 · claude · PR: https://github.com/atulprakash1/scrawl/pull/22
- 2026-10-27 00:24 · me · Moved to resolved (Resolved)
- 2026-10-27 00:30 · scrawl · Shipped: c5ca390 is on main
- 2026-10-27 01:07 · claude · Released in v0.1.0
