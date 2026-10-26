---
id: 36
type: bug
title: Delete option for attachment
status: review
severity: beetle
assignee: claude
rank: i
labels: []
created: 2026-10-26T23:02
updated: 2026-10-26T23:07
---
## Description
retaled to #35. there should be a small delete button after the attached file. the user can delete it if wrong file is attached.

## Acceptance
- [x] delete button after the attached file
- [x] user is able to remove the attached file.

## Activity
- 2026-10-26 23:02 · me · Created
- 2026-10-26 23:04 · me · Handed to Claude (Claude's tray)
- 2026-10-26 23:07 · claude · Picked up on branch scrawl/36-delete-attachment. Plan: a × after each file in the Attachments list; on confirm it deletes the file, takes its link out of the Description and logs it in Activity.
- 2026-10-26 23:07 · claude · Done: each file in the drawer's Attachments list has a small × after it. After a confirm it deletes the file from .scrawl/attachments/<id>/, removes its link or image from the Description, and adds a "Removed attachment" Activity line. Verified headless (cancel keeps everything, confirm removes only that file and link).
- 2026-10-26 23:08 · claude · PR: https://github.com/atulprakash1/scrawl/pull/16
