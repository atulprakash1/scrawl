# Scrawl roadmap

Phases from the plan (`Scrawl — Local LLM-Powered Project Board.md`), adjusted for the answered
open questions: one `scrawl.html` per repo, no helper CLI for now (keep it simple), Windows + macOS,
continuous flow (no sprints), `.scrawl/` committed to git.

Each phase ends with a gate: don't start the next phase until the gate passes.
From Phase 1 on, the remaining work lives on Scrawl's own board in `.scrawl/items/`.

## Phase 0 — Spike & scaffold ✅ built, ⏳ needs your browser check

- Git repo, folder layout, vendored libraries and fonts, `.gitattributes` for LF files.
- Folder access from a `file://` page: pick folder, read, write, handle remembered in IndexedDB.

**Gate:** in Chrome or Edge on Windows *and* macOS, `scrawl.html` opened by double-click can pick
this folder, show the board, save a card move, and reopen the folder after a reload with at most one click.
Fallback if `file://` misbehaves: `python -m http.server` in the repo, open `http://localhost:8000/scrawl.html`.
Tracked as item #2.

## Phase 1 — The core loop ✅ built, ⏳ in review

- Tolerant parser (unknown fields kept, bad lines kept and flagged "smudged").
- Store with write-through and field-level merge (edits apply on top of the latest file on disk).
- Board: five columns, drag to move/reorder with fractional ranks, WIP limits, quick add, filters.
- Item drawer: status/assignee/type/severity, description, acceptance checklist, activity thread,
  comments, linked commits, **Copy /resolve N**, **Hand to Claude**, **Ship it**.
- Watcher: polls every 2s while the tab is visible; "changed outside Scrawl" toasts.
- `CLAUDE.md` protocol, `/resolve` and `/next` commands (Claude edits item files directly, no CLI).
- Git `post-commit` hook (`.scrawl/hooks/`, via `core.hooksPath`) logs commits; cards link them by `#N`.

**Gate:** a card travels from Claude's tray to "Eyeball it" without you touching a file:
hand it to Claude → paste `/resolve N` → watch it move to doing, then review with a linked commit. Tracked as #1.

## Phase 2 — Planning

Project wizard (writes `project.md`), Proposed lane + Plan tree with accept/reject, `/plan`, `/groom`,
`/inbox` (answer `@claude` comments), **Hook up Claude** button that writes the protocol, commands
and hook into another repo, and a single-file `scrawl.html` so it's easy to drop into any repo.

**Gate:** start a new repo from nothing to a planned, accepted backlog using only the board and Claude.

## Phase 3 — Visibility & polish

Bug jar, Timeline (incl. orphan commits), Today view, Releases view + `/release`, `/standup`,
Ctrl+K command palette, Rough.js frames and charts, stamps and motion, full keyboard drag,
read-only fallback for Firefox/Safari, smudged-item fix flow.

**Gate:** a week of daily use on a real project without opening `.scrawl/` by hand.

## Phase 4 — Experiments (only if they earn it)

Helper CLI `scrawl.mjs` (if hand-edited items prove error-prone), FileSystemObserver instead of polling,
reading `.git` with isomorphic-git, `AGENTS.md` for other LLM tools, recent-projects list.
