# Scrawl

A sketchbook-style project board that lives in your repo. You and Claude Code share work through
plain Markdown files in `.scrawl/`. No server, no API, no database, no build step.

## Use it

1. Open `scrawl.html` in **Chrome or Edge** (double-click is fine).
2. Click **Open project folder** and pick this repo's root folder. Allow edit access.
3. Drag cards, open one to comment, tick acceptance boxes, or **Hand to Claude**.
4. In Claude Code, paste `/resolve <n>` (the drawer has a copy button) or `/next`.
   The card moves to *On the bench*, then *Eyeball it* with a linked commit. You ship it.

Firefox and Safari can't write to folders. If `file://` gives you trouble, serve it locally:
`python -m http.server` (or `npx serve`) and open `http://localhost:8000/scrawl.html`.

## Git hook (once per clone)

```sh
git config core.hooksPath .scrawl/hooks
```

Every commit is then logged to `.scrawl/log/commits.txt` (ignored by git; rebuilt from history
if missing), and commits whose message starts with `#42` show up on card #42.
The hooks also list the commits on `main` in `.scrawl/log/main.txt` (after commits, merges and pulls).
On macOS/Linux make sure the hooks are executable: `chmod +x .scrawl/hooks/*`.

## Flow

Someday pile → Claude's tray → On the bench → Eyeball it → **Accept** → Resolved → Shipped!

Claude commits when it moves a card to *Eyeball it*. When you accept it, the card waits in
*Resolved* until one of its commits is on `main`, then the board ships it by itself.
If you commit straight to `main`, that happens right away. *Shipped!* is folded by default;
click **▸ show** to see the history.

## Layout

```
scrawl.html            the board (open in Chromium)
app/js, app/css        plain classic scripts and styles
vendor/                SortableJS, marked, DOMPurify, Rough.js, fonts (no CDN at runtime)
CLAUDE.md              the protocol Claude follows
.claude/commands/      /resolve, /next
.scrawl/               project.md, config.json, index.json, items/, log/, hooks/, releases/
docs/ROADMAP.md        phases and gates
```

Design: `Scrawl — Local LLM-Powered Project Board.md`.
