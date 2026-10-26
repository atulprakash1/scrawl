# Scrawl

## Goal
A local, file-based project board where I and Claude Code share work through plain Markdown files in the repo. No server, no API, no database.

## For whom
Me: a solo developer working with Claude Code on a Pro plan.

## Stack
One `scrawl.html` + plain JS (classic scripts), File System Access API, vendored SortableJS, marked, DOMPurify, Rough.js. Git post-commit hook for commit tracking.

## Must-haves
- Board, item drawer, comments, live updates when Claude edits files
- /resolve and /next for Claude; Claude never marks work done
- Works offline from file:// in Chromium on Windows and macOS

## Out of scope
Sprints, multi-user, servers, cloud sync, a CLI (for now).
