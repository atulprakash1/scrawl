---
id: 46
type: story
title: AGENTS.md for other coding agents
status: review
parent: 14
assignee: claude
size: S
labels: [phase-4]
created: 2026-10-27T00:10
updated: 2026-10-27T00:15
---
## Description
Hook up Claude writes the Scrawl protocol into CLAUDE.md. Also write it to AGENTS.md, the file Codex, Gemini CLI, Cursor and similar tools read, with a short note that `assignee: claude` means the AI agent, so any tool follows the same rules.

## Acceptance
- [x] Hook up Claude creates AGENTS.md with the protocol, or appends it to an existing AGENTS.md without the section
- [x] Your own AGENTS.md text is never overwritten, and a second run changes nothing
- [x] The dialog lists AGENTS.md among the files it writes

## Activity
- 2026-10-27 00:10 · claude · Created by /resolve 14
- 2026-10-27 00:14 · claude · Picked up on feature #14's branch scrawl/14-experiments. Plan: one routine in hookup.js writes the protocol to both CLAUDE.md and AGENTS.md (create, or append when the section is missing, never overwrite); a new AGENTS.md gets a short note for non-Claude agents.
- 2026-10-27 00:15 · claude · Done: Hook up Claude also writes AGENTS.md. A new one opens with a note that "Claude" and assignee: claude mean whichever AI agent reads it, and that .claude/commands/ can be followed as plain instructions; an existing one only gets the protocol appended if it's missing. Verified headless (create, append to your own CRLF file, no duplicate on re-run, listed in the dialog).
- 2026-10-27 00:17 · claude · PR: https://github.com/atulprakash1/scrawl/pull/21
