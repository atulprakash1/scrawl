# Scrawl

A local, file-based project board for working with Claude Code. `scrawl.html` is opened straight
from disk in a Chromium browser and reads/writes `.scrawl/` through the File System Access API.
The full design is in `Scrawl — Local LLM-Powered Project Board.md`; phases are in `docs/ROADMAP.md`.

## Developing Scrawl itself

- No build step, no npm, no server. Plain JS in `app/js/` loaded with classic `<script>` tags
  (Chrome blocks `type="module"` on `file://`). Each file is an IIFE that adds to `window.Scrawl`.
- Load order matters and is set in `scrawl.html`: util → parser → rank → fs → store → watcher → board → plan → releases → timeline → bugs → today → attachments → drawer → wizard → templates → hookup → palette → main.
- Third-party code lives in `vendor/` (copied, never loaded from a CDN). Don't add dependencies lightly.
- `app/js/templates.js` is generated: after changing the "Scrawl work tracking" section below,
  `.claude/commands/` or `.scrawl/hooks/`, run `node tools/bundle.mjs` and commit it. The same command
  builds the single-file `dist/scrawl.html` (not committed).
- Keep it simple: this is a tool, not an app platform. Anything outside the current phase goes on the
  board as an idea, not into the code.
- Target Windows and macOS. Item files and the git hook use LF line endings (see `.gitattributes`).
- To test: open `scrawl.html` in Chrome/Edge and pick this repo's folder.

## Scrawl work tracking

Work items live in `.scrawl/items/`, one Markdown file per item, named `0042-bug-short-slug.md`.

- Never work on code without an item. Found something else? Create a new bug/idea item; don't silently expand scope.
- Overviews: read `.scrawl/index.json` (one line per item). It can lag behind; the item files always win.
- Header format: flat `key: value` lines between `---` fences. No nesting. Lists are `[a, b]`.
  Keep fields you don't recognise exactly as they are.
- Statuses: `proposed | backlog | ready | doing | review | resolved | done | wontfix`.
  "Claude's tray" is `status: ready` + `assignee: claude`. After review the user may accept an item
  (`resolved`); the board marks `review`/`resolved` items `done` (Shipped) once their PR is merged into main.
- Picking up: set `status: doing`, `assignee: claude`, update `updated:`, add an Activity line.
  Empty Acceptance section? Write 2-5 criteria from the Description, say so in Activity, and carry on.
- Activity lines are append-only, newest last, one line each:
  `- 2026-10-25 11:02 · claude · Picked up. Root cause: null email.`
  Lines from `me` are the user's comments and instructions; read them before starting.
- Attachments: files the user attached to an item live in `.scrawl/attachments/<id>/` and are linked
  from its Description (`../attachments/<id>/<name>`, relative to the item file). Open them (images too)
  before starting; they are part of the brief.
- The board is not part of the project's git: `.scrawl/` is a separate worktree of its own
  `scrawl-board` branch (set up once per clone by `sh .scrawl/hooks/scrawl-setup`). Edit item files
  there as usual, but never `git add` or commit them yourself; `scrawl-sync` commits and pushes the board.
- Git: never commit to or push `main`. Each item gets its own branch `scrawl/<id>-<slug>`, pushed
  with a PR (`gh pr create`); the user merges on GitHub. A feature is the exception: its stories
  share the feature's branch, one commit each, and go out in one PR titled with every id
  (`#3 #4 #5 Title`). See "Resolving a feature" in `.claude/commands/resolve.md`. Start every command with
  `sh .scrawl/hooks/scrawl-sync` — it fast-forwards `main` from GitHub (no manual pull) and saves the board.
- Commits: start the message with the item number, e.g. `#42 Handle empty form`. Only a leading
  `#N` links a commit to an item (GitHub's `(#12)` PR suffix is ignored). Merging the PR ships the card.
  Commits and PRs carry code only.
- Finishing: tick acceptance boxes you verified (`- [x]`), add a 1-3 sentence summary Activity line,
  set `status: review`. Never set `resolved` or `done` — the user accepts items after review.
- Creating an item: take `nextId` from `.scrawl/config.json`, then increment it there. File name is
  `<id padded to 4>-<type>-<slug>.md`. Use this template:

  ```
  ---
  id: 43
  type: bug
  title: Short title
  status: backlog
  assignee: me
  labels: []
  created: 2026-10-25T11:40
  updated: 2026-10-25T11:40
  ---
  ## Description
  What and why.

  ## Acceptance
  - [ ] Observable outcome

  ## Activity
  - 2026-10-25 11:40 · claude · Created while working on #42
  ```

  Types: `feature | story | bug | idea`. Bugs also get `severity: ant | beetle | cockroach | kraken`.
  Leave `rank` out; the board ranks new items when they are dragged.
- Timestamps are local time, minute precision (`YYYY-MM-DDTHH:MM` in headers).
- Don't edit `.scrawl/index.json` or `.scrawl/log/*`; the board and the git hook maintain them.
