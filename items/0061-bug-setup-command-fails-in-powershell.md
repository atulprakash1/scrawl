---
id: 61
type: bug
title: Hook-up setup command fails in Windows PowerShell
status: done
severity: beetle
assignee: claude
labels: [install]
created: 2026-10-27T21:02
updated: 2026-10-27T22:14
shipped: fa9b2c0
release: 0.2.2
---
## Description
The Hook up Claude dialog tells you to run `chmod +x .scrawl/hooks/* && sh .scrawl/hooks/scrawl-setup`
(`SETUP` in app/js/hookup.js). In Windows PowerShell 5.1 this fails twice: `&&` is a parse error, and
`chmod`/`sh` aren't on PATH unless Git's Unix tools were added during install. The chmod is only
needed on macOS/Linux; on Windows only `sh .scrawl/hooks/scrawl-setup` matters.

## Acceptance
- [x] On Windows the dialog shows a command that works pasted into PowerShell (e.g. `& "$env:ProgramFiles\Git\bin\sh.exe" .scrawl/hooks/scrawl-setup`) or clearly says to use Git Bash
- [x] macOS keeps the chmod + sh command
- [x] README's setup instructions mention the Windows form

## Activity
- 2026-10-27 21:02 · claude · Created from user report: setup command failed in PowerShell for a new project
- 2026-10-27 21:35 · me · Handed to Claude (Claude's tray)
- 2026-10-27 21:38 · claude · Picked up on branch scrawl/61-windows-setup-command. Show a PowerShell-ready command on Windows, keep chmod + sh elsewhere, document both in the README.
- 2026-10-27 21:40 · claude · On Windows the dialog and wizard now show Git's sh via PowerShell (with a Git Bash note), and macOS keeps chmod + sh. The README has the PowerShell form. I ran the exact command in PowerShell 5.1 on a test repo, and it installed the hooks and the board branch. The same issue in the fresh-clone command is now #62.
- 2026-10-27 21:40 · claude · PR: https://github.com/atulprakash1/scrawl/pull/35
- 2026-10-27 22:14 · scrawl · Shipped: fa9b2c0 is on main
- 2026-10-27 22:26 · claude · Released in v0.2.2
