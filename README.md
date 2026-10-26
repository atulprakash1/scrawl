# Scrawl

A sketchbook-style project board that lives in your repo. You and Claude Code share work through
plain Markdown files in `.scrawl/`. No server, no API, no database, no build step.

## Use it

1. Open `scrawl.html` in **Chrome or Edge** (double-click is fine).
2. Click **Open project folder** and pick this repo's root folder. Allow edit access.
3. Drag cards, open one to comment, tick acceptance boxes, or **Hand to Claude**.
4. In Claude Code, paste `/resolve <n>` (the drawer has a copy button) or `/next`.
   The card moves to *On the bench*, then *Eyeball it* with a linked commit. You ship it.

### In another repo

Run `node tools/bundle.mjs` here once (Node 18+, nothing to install). It builds `dist/scrawl.html`, the
whole board in one file. Copy it into the other repo, open it, click **Start Scrawl**, answer the
project wizard, then click **🤖 Hook up Claude**. That writes the protocol into `CLAUDE.md`, the slash
commands into `.claude/commands/` and the git hooks into `.scrawl/hooks/`, without overwriting your own
`CLAUDE.md` text or commands. Run the setup command it shows once, then `/plan` in Claude Code.

Firefox and Safari can't write to folders. If `file://` gives you trouble, serve it locally:
`python -m http.server` (or `npx serve`) and open `http://localhost:8000/scrawl.html`.

## Setup (once per clone)

The board stays out of your project's git. `.scrawl/` is checked out from its own `scrawl-board`
branch (a separate git worktree, listed in `.git/info/exclude`), so moving cards never shows up in
`git status`, diffs or PRs, and switching branches never touches the board.

```sh
git worktree add .scrawl scrawl-board   # fresh clone only: fetch the board
sh .scrawl/hooks/scrawl-setup           # exclude .scrawl/, install the git hooks
```

Starting Scrawl in a new folder? Run just `scrawl-setup`: it moves the plain `.scrawl/` folder onto
the `scrawl-board` branch. (If your code branch still tracks `.scrawl/`, it tells you to untrack it first.)

Every commit is then logged to `.scrawl/log/commits.txt`, and commits whose message starts with
`#42` show up on card #42. The hooks also list the commits on `main` in `.scrawl/log/main.txt`.
Both are rebuilt from git history when missing and never committed, nor is `index.json`.

## Flow

Someday pile → Claude's tray → On the bench → Eyeball it → **Accept** → Resolved → Shipped!

Nothing goes to `main` directly. For each card Claude works on a branch `scrawl/<id>-<slug>`,
pushes it and opens a PR, and the card lands in *Eyeball it*. You review and merge the PR on GitHub
(merge, squash or rebase all work). **Accept** is optional: it parks the card in *Resolved* while
the PR waits to be merged.

You never `git pull` by hand: every `/resolve` and `/next` starts with `.scrawl/hooks/scrawl-sync`,
which fast-forwards `main` from GitHub, then commits the board's changes (moves, comments, Claude's
notes) on `scrawl-board` and pushes them. The board then ships every card whose work is on `main`.
Code PRs carry code only.
*Shipped!* lists the most recently shipped first; **▾ hide** tucks its cards away without changing its width.

## Layout

```
scrawl.html            the board (open in Chromium)
app/js, app/css        plain classic scripts and styles
vendor/                SortableJS, marked, DOMPurify, Rough.js, fonts (no CDN at runtime)
tools/bundle.mjs       builds app/js/templates.js and the single-file dist/scrawl.html
CLAUDE.md              the protocol Claude follows
.claude/commands/      /resolve, /next, /plan, /groom, /inbox, /release
.scrawl/               the board, from the scrawl-board branch: project.md, config.json, items/,
                       log/, hooks/, releases/ (plus the rebuilt index.json)
docs/ROADMAP.md        phases and gates
```

Design: `Scrawl — Local LLM-Powered Project Board.md`.
