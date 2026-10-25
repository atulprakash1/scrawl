# Scrawl — Local LLM-Powered Project Board

Oct 25, 2026 · @Atul Prakash

## Assessment

Verdict: very feasible, and the no-server, no-API constraint is actually the design's best feature. Because the browser can't call Claude and Claude can't click a browser, both sides meet in the one place they can both reach: plain files inside your project folder. That makes the whole system local, diffable, git-versioned and LLM-agnostic.

Working name for this plan: **Scrawl** (alternatives: Doodleboard, Sketchban, Kanbanana).

**What makes it strong**

- Zero infrastructure: one HTML file plus a `.scrawl/` folder in each repo. Nothing to install, host or log into.
- Claude Code on Pro already has everything needed: it reads and edits files, runs git and shell, and supports project instructions (`CLAUDE.md`) and custom slash commands.
- Tasks live next to the code, so they're versioned with it. Checking out an old commit shows the board as it was.
- Human-in-the-loop by design: Claude proposes, you accept, Claude works, you review.

**What's genuinely hard (and solved below)**

| Challenge | Why it bites | Answer in this plan |
| --- | --- | --- |
| Browser support | Only Chromium (Chrome, Edge, Opera, Arc) can write to a folder; Firefox and Safari can't | Target Chromium; read-only fallback elsewhere |
| Two writers, one folder | You drag a card while Claude edits the same story | One file per item, field-level merge, modified-time checks |
| Seeing Claude's changes live | Browser isn't notified when files change | Poll every 2s while the tab is visible; FileSystemObserver where available |
| Git from a browser | No shell in a web page | A git post-commit hook writes a log file the board reads |
| LLM writing bad data | Claude may break the file format | A tiny optional CLI Claude calls instead of hand-editing, plus tolerant parsing in the UI |
| Token budget on Pro | Reading the whole backlog every time burns usage | Compact index file; commands read only what they need |

## Core idea: the filesystem is the API

The board and Claude never talk to each other directly; both read and write the same small Markdown files in your repo. The browser can't run Claude, so the only manual step is pasting a command like `/resolve 42` into Claude Code, and the board gives you a one-click copy button for it.

&#91;embedded content: how the board, files, Claude Code and git connect\]

A typical loop: you drop bug #42 into Claude's tray, paste `/resolve 42`, and within seconds the card hops to "On the bench". When Claude commits, the hook logs it, the card shows the commit, and it lands in "Eyeball it" with a **NEEDS YOU** stamp for your review.

## Architecture

One `scrawl.html` you open by double-clicking, a `vendor/` folder of libraries copied locally so it works offline, and plain JavaScript split into a few logical modules. No build step required for v1.

**Modules inside the page**

| Module | Job |
| --- | --- |
| `fs` | Wraps the File System Access API: pick folder, read, write, list, delete. Stores the folder handle in IndexedDB so you don't re-pick every visit; calls `requestPermission()` on return. |
| `store` | In-memory index of all items, keyed by number. Write-through to disk on every change. Emits events views subscribe to. |
| `parser` | Reads and writes Markdown files with a small frontmatter header. Tolerant: unknown fields are preserved, bad fields flagged rather than dropped. |
| `watcher` | Detects outside changes (Claude, git, your editor). Polls file `lastModified` every 2s while the tab is visible; uses FileSystemObserver when the browser offers it. |
| `merge` | Before writing, re-reads the file; if it changed since load, merges field by field (your drag wins on `status`, Claude's text wins on `body`) and shows a small "Claude was here" toast. |
| `views` | Board, Plan tree, Bug jar, Timeline, Releases, Item drawer. Each is a function that renders from `store`. |
| `theme` | Hand-drawn rendering helpers (Rough.js shapes, wobble borders, stamps). |

**Libraries (all copied into `vendor/`, no CDN at runtime)**

- Rough.js — sketchy boxes, arrows, underlines, charts
- SortableJS — kanban drag and drop that also works on touch, better than native HTML5 drag
- marked + DOMPurify — render Markdown in descriptions and comments safely
- Fonts as local files: a handwriting face for headings (e.g. Caveat, Gochi Hand) and a readable one for body text (e.g. Patrick Hand, Kalam)

**Gotchas to design around from day one**

- `<script type="module">` is blocked on `file://` pages in Chrome. Use classic `<script>` tags, or later add a one-command bundle step that inlines everything into one HTML.
- File System Access works on `file://` in Chromium, but verify this in the Phase 0 spike on your exact browser. Fallback: `npx serve` or `python -m http.server` on localhost, which is still fully local.
- Writes go through `createWritable()`, which writes to a temporary file and swaps on `close()`, so a crash mid-save never leaves a half-written item.
- Permission prompts: Chrome can remember "allow on every visit" for a folder; otherwise one click per session to re-grant.
- Brave disables this API by default; Firefox and Safari don't have folder write access. Show a friendly read-only mode via `<input webkitdirectory>` there.

## Data model and folder layout

Everything is Markdown with a short header, one file per item, all numbered from one shared counter. So "resolve 42" is unambiguous whether #42 is a story or a bug.

**Hierarchy (deliberately shallow for a solo dev)**

- **Project** — one per repo, described in `project.md` (goal, stack, constraints)
- **Feature** — a user-visible capability, e.g. #3 "Login"
- **Story** — a slice Claude can finish in one session, with acceptance criteria, e.g. #7 "Email + password sign-in"
- **Tasks** — a checklist inside the story, not separate files
- **Bug / Idea** — standalone items, optionally linked to a feature

**Folder layout inside your repo**

```
my-app/
  scrawl.html            ← or keep one copy elsewhere and point it at any repo
  CLAUDE.md              ← tells Claude the Scrawl protocol
  .claude/commands/      ← /plan, /resolve, /next, /groom, /standup, /release
  .scrawl/
    project.md           ← brief, goals, tech stack
    config.json          ← columns, WIP limits, counter, theme
    index.json           ← compact list: id, type, title, status, parent, rank
    items/
      0003-feature-login.md
      0007-story-email-signin.md
      0042-bug-crash-on-empty-form.md
    log/
      activity.jsonl     ← who moved what, when (you or Claude)
      commits.jsonl      ← written by the git hook
    releases/
      v0.1.0.md          ← generated changelog
    tools/scrawl.mjs     ← optional helper CLI for Claude
```

**One item file** — `0042-bug-crash-on-empty-form.md`

```
---
id: 42
type: bug
title: Crash on empty signup form
status: ready          # backlog | ready | doing | review | done | wontfix
severity: beetle       # ant | beetle | cockroach | kraken
parent: 3
assignee: claude       # me | claude
rank: m4               # sort key inside a column
labels: [auth, ui]
created: 2026-10-25T10:12
updated: 2026-10-25T11:40
commits: [a1b2c3d]
---
## Description
Submitting with all fields blank throws in validate().

## Acceptance
- [ ] Empty submit shows inline errors
- [ ] Unit test covers empty payload

## Activity
- 2026-10-25 10:12 · me · Reported
- 2026-10-25 11:02 · claude · Picked up. Root cause: null email.
- 2026-10-25 11:40 · claude · Fixed in a1b2c3d, moved to review.
```

**Design choices and why**

- **One file per item** — you and Claude rarely touch the same file at once, and git diffs read like a story.
- **Comments in the item, not a separate store** — Claude sees the whole conversation in one read.
- **`rank` strings for order** (fractional ranking) — dragging a card rewrites only that card, never the whole column.
- **`index.json` is a cache**, rebuilt by the UI on load and by the CLI after edits. If it ever disagrees with the item files, the files win.
- **Flat, simple header** — no nested YAML, so a \~60-line parser in the page is enough.

## Claude Code integration

Three pieces make Claude a disciplined teammate rather than a free-roaming one: a protocol in `CLAUDE.md`, a handful of slash commands in `.claude/commands/`, and an optional helper CLI. Scrawl ships all three as templates and writes them into a repo when you click **Hook up Claude**.

**Slash commands**

| Command | What Claude does | Ends with status |
| --- | --- | --- |
| `/plan` | Reads `project.md`, proposes features and stories with acceptance criteria, size (S/M/L) and dependencies | Items in **proposed**, waiting for your OK |
| `/resolve 42` | Picks up #42, reads its comments, implements, runs tests, commits with `#42` in the message, writes a summary | **review** (never done — you close it) |
| `/next` | Takes the top card in the **Ready for Claude** column and runs `/resolve` on it | **review** |
| `/groom` | Splits oversized stories, fills missing acceptance criteria, flags stale items | unchanged |
| `/inbox` | Answers every comment that mentions `@claude` | unchanged |
| `/standup` | Writes a short "since last session" note into the activity log | — |
| `/release 0.2.0` | Tags the repo, generates `releases/v0.2.0.md` from done items and commits | done items archived |

**The protocol in `CLAUDE.md` (excerpt)**

```
## Scrawl work tracking
- Work items live in .scrawl/items/. Never work on code without an item.
- Picking up: set status: doing, assignee: claude, add an Activity line.
- Commits: start the message with the item number, e.g. "#42 Handle empty form".
- Finishing: tick acceptance boxes you verified, add a summary Activity line,
  set status: review. Never set done.
- Found something else? Create a new bug/idea item; don't silently expand scope.
- Prefer `node .scrawl/tools/scrawl.mjs` over hand-editing item headers.
- Read .scrawl/index.json for overviews; open item files only when needed.
```

**Example command file** — `.claude/commands/resolve.md`

```
Resolve Scrawl item #$ARGUMENTS.
1. Run `node .scrawl/tools/scrawl.mjs show $ARGUMENTS` and read it fully,
   including Activity comments from me.
2. `scrawl.mjs start $ARGUMENTS` (moves it to doing).
3. Make a short plan, then implement. Keep scope to the acceptance criteria.
4. Run the tests. If they fail and you can't fix them, comment why and stop.
5. Commit: "#$ARGUMENTS <summary>".
6. `scrawl.mjs finish $ARGUMENTS "<2-3 line summary>"` (moves it to review).
```

**The helper CLI (`scrawl.mjs`, \~200 lines, Node only, no dependencies)**

It does the boring, error-prone edits so Claude doesn't spend tokens rewriting headers: `show`, `list --status ready`, `new bug "title"`, `start`, `comment`, `finish`, `move`, `link-commit`, `reindex`. It validates every write. If Node isn't installed, Claude can still edit files directly; the protocol covers both.

**Keeping usage low on Pro**

- Overviews come from `index.json` (one line per item), not from every file.
- Stories sized to fit one session; `/groom` splits anything bigger.
- `/clear` between items; the item file carries the context forward, not the chat.

**Other LLMs**

Put the protocol in `AGENTS.md` and have `CLAUDE.md` point to it. Codex, Gemini CLI, Cursor and Aider-style tools can then follow the same rules, and the board doesn't care who did the work: the `assignee` field just records a name.

## Git and version tracking

A git post-commit hook does the tracking, so the browser never has to understand git. Every commit, whether you or Claude made it, appends one line to `.scrawl/log/commits.jsonl`, and the board links it to items by the `#42` in the message.

**The hook** — `.git/hooks/post-commit` (Scrawl installs it via `/setup` or a button that writes the file)

```
#!/bin/sh
# Prefer the CLI: it escapes quotes and counts changed files safely
if command -v node >/dev/null 2>&1; then
  node .scrawl/tools/scrawl.mjs log-commit HEAD
else
  git log -1 --format='%h|%cI|%an|%s' >> .scrawl/log/commits.txt
fi
```

The CLI writes one JSON line per commit: short sha, date, author, message, files changed, and the item numbers it found. Without Node, a plain pipe-separated line is written and the page parses that instead.

**What you get from it**

- **Item ↔ commit links** — each card shows its commits; each commit in the timeline shows its card.
- **Timeline view** — one scrolling line of what went when: commits, status changes, comments, releases, colour-coded by who did it (you vs Claude).
- **Releases** — `/release 0.2.0` creates a git tag and a changelog from items marked done since the last tag, grouped into Features, Fixes and Chores.
- **Backfill** — `scrawl.mjs sync-git` reads `git log` once to import history from before Scrawl was installed.

**Commit convention**

`#42 Handle empty signup form` — number first, then a plain summary. Optional trailers: `Scrawl-Status: review`. A commit without a number shows up as an "orphan" sticky note in the timeline, a gentle nudge rather than a block.

**Later option: read `.git` directly.** The isomorphic-git library can read a repository through a custom file-system adapter, which could give live branch and diff views without the hook. It's heavier and packfiles make it slow on big repos, so it stays a Phase 4 experiment.

## UI views and the hand-drawn theme

The look is "sketchbook on a workbench": graph paper, sticky notes, washi tape, rubber stamps and marker doodles, with a chalkboard dark mode. Playful on the surface, but every view does real work.

**Views**

| View | What it shows | Key interactions |
| --- | --- | --- |
| Board | Kanban columns of sticky-note cards | Drag between columns and reorder; WIP limits; filter by feature, label, assignee |
| Plan | Tree of features → stories, plus a **Proposed** lane for what `/plan` suggested | Accept, reject or edit each proposal; drag to re-parent; size badges |
| Bug jar | All bugs sorted by severity and age, drawn as a jar of critters | Quick-add bug in one line; "Hand to Claude" moves it to Claude's tray |
| Item drawer | Slides in from the right: description, acceptance checklist, activity thread, linked commits | Comment, tick boxes, `@claude` mentions, **Copy /resolve 42** button |
| Timeline | Everything in date order: commits, moves, comments, releases | Filter by you vs Claude; click through to items |
| Releases | Each version as a torn notebook page with its changelog | Preview the next changelog before running `/release` |
| Today | What changed since your last visit, what's waiting for you, what's stale | One-glance start to a session |
| Command palette | Ctrl+K anywhere | New bug, jump to #42, copy a Claude command |

**Columns with personality** (labels are cosmetic; files keep plain status names)

Someday pile → Claude's tray → On the bench → Eyeball it → Shipped!

**The visual kit**

- **Paper**: warm off-white with a faint dot grid made in CSS; the dark theme is slate chalkboard with smudged chalk lines.
- **Cards**: sticky notes coloured by type (feature mint, story butter, bug coral, idea lilac), tilted ±1.5° using the item number as a seed so they don't jitter on reload, a strip of washi tape on top.
- **Wobbly edges**: Rough.js for column frames, arrows and charts; the CSS trick of uneven `border-radius` for cheap hand-drawn boxes everywhere else.
- **Stamps**: a rotated red **SHIPPED** stamp on done cards; a blue **NEEDS YOU** stamp on cards Claude has put in review.
- **Who did it**: an original little pencil-bot doodle marks Claude's work, a coffee mug marks yours.
- **Bug sizes**: ant, beetle, cockroach, kraken — each a small doodle, so the jar shows severity at a glance.
- **Charts**: burn-up and cumulative flow drawn with Rough.js so they look sketched on graph paper.

**Motion (all optional, off under `prefers-reduced-motion`)**

- Pick-up: card lifts, tilts and grows a pencil shadow; drop gives a small squash.
- Claude moves a card while you watch: footprints trail across the board and a "Claude was here" toast appears.
- Done: a short burst of doodled confetti. Over a WIP limit: the column border turns into a red scribble.

**Keeping it usable**

- Handwriting fonts only for headings, labels and stamps; body text in a readable rounded font.
- Colour is never the only signal: every type and severity also has an icon and a word.
- Full keyboard: arrows to move focus, Space to pick up a card, arrows to carry it, Space to drop.

**Starting a project**

A short wizard asks five questions (what are you building, for whom, stack, must-haves, out of scope), writes `project.md`, and then shows the exact command to paste into Claude Code: `/plan`. Proposed items then appear in the Plan view live.

## Phased roadmap

Build the smallest loop that works first, then dogfood it: from Phase 1 onward, Scrawl's own backlog lives in Scrawl and Claude builds it card by card.

&#91;embedded content: roadmap · 5 phases, 4 gates\]

Phase 1 is the one that matters: once a card can travel from Claude's tray to review without you touching a file, everything after it is polish you can schedule from the board itself.

## Risks, open questions, decisions

**Risks and mitigations**

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Claude edits code but forgets to update the item | Medium | Protocol in `CLAUDE.md`, commands that end with `scrawl.mjs finish`, and an "orphan commit" note in the timeline |
| You and Claude edit the same item at once | Low | Field-level merge; Activity lines are append-only so both survive |
| Malformed header written by hand | Medium | Tolerant parser; broken items shown with a red "smudged" badge and a fix button, never dropped |
| Browser permission lost after an update | Low | One-click re-grant banner; the folder handle stays in IndexedDB |
| Scope creep into a full Jira | High | Strict phase gates; anything not in this plan goes to the Someday pile of Scrawl's own board |
| Pro usage limits during big `/plan` runs | Medium | Plan one feature at a time with `/plan feature 3` once the outline exists |

**Decisions taken in this plan**

- Files are the only interface between the UI and any LLM. No API, no server, no database.
- Markdown items with a flat header, one file per item, one shared number sequence.
- Claude never marks work done; you do, after review.
- Git integration through a hook plus commit-message convention, not by parsing `.git`.
- Chromium-only for write access; read-only elsewhere.

**Open questions for you**

- [ ] One `scrawl.html` per repo, or a single copy that can open any project folder (with a recent-projects list)? 
	- Start with one scrawl.html per repo for now.
- [ ] Is Node available on your machines? It decides whether the helper CLI is required or optional.
	- Node is available but I want to keep it simple for the moment. Don't want to create it like an app.
- [ ] Windows, macOS or Linux? The git hook and CLI paths differ slightly on Windows.
	- let's go with windows and macOs for the moment.
- [ ] Do you want sprints or timeboxes, or is a continuous flow board enough for solo work?
	- continuous flow board is enough. I want to keep it simple.
- [ ] Should `.scrawl/` be committed to git (recommended: yes, so history travels with the code)?
	- yes
