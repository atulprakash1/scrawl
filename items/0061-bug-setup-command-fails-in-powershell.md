---
id: 61
type: bug
title: Hook-up setup command fails in Windows PowerShell
status: ready
severity: beetle
assignee: claude
labels: [install]
created: 2026-10-27T21:02
updated: 2026-10-27T21:35
---
## Description
The Hook up Claude dialog tells you to run `chmod +x .scrawl/hooks/* && sh .scrawl/hooks/scrawl-setup`
(`SETUP` in app/js/hookup.js). In Windows PowerShell 5.1 this fails twice: `&&` is a parse error, and
`chmod`/`sh` aren't on PATH unless Git's Unix tools were added during install. The chmod is only
needed on macOS/Linux; on Windows only `sh .scrawl/hooks/scrawl-setup` matters.

## Acceptance
- [ ] On Windows the dialog shows a command that works pasted into PowerShell (e.g. `& "$env:ProgramFiles\Git\bin\sh.exe" .scrawl/hooks/scrawl-setup`) or clearly says to use Git Bash
- [ ] macOS keeps the chmod + sh command
- [ ] README's setup instructions mention the Windows form

## Activity
- 2026-10-27 21:02 · claude · Created from user report: setup command failed in PowerShell for a new project
- 2026-10-27 21:35 · me · Handed to Claude (Claude's tray)
