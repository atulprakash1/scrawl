/* Hook up Claude: write the protocol, slash commands and git hooks (from templates.js) into the open repo. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  // chmod: files written by the browser aren't executable, and git on macOS skips such hooks.
  // Windows has no exec bit, but PowerShell 5.1 has no `&&` and seldom sh on PATH, so it runs Git's own sh.
  const WINDOWS = /Windows/.test(navigator.userAgent);
  const SETUP = WINDOWS
    ? '& "$env:ProgramFiles\\Git\\bin\\sh.exe" .scrawl/hooks/scrawl-setup'
    : 'chmod +x .scrawl/hooks/* && sh .scrawl/hooks/scrawl-setup';
  const SETUP_ASK = WINDOWS
    ? 'Once, at the repo root (it needs Git for Windows), turn on the hooks and give the board its own branch. ' +
      'In PowerShell (in Git Bash it\'s just sh .scrawl/hooks/scrawl-setup):'
    : 'Once, in a terminal at the repo root (it needs git), turn on the hooks and give the board its own branch:';

  const dialog = () => document.getElementById('hookup');
  const isHook = (path) => path.startsWith('.scrawl/hooks/');
  const lf = (text) => text.replace(/\r\n/g, '\n');

  /* Scrawl owns its hooks, so those are refreshed. CLAUDE.md and the commands may be yours by now:
     a missing protocol section is appended, an existing command is never overwritten. */
  // AGENTS.md is what Codex, Gemini CLI, Cursor and other coding agents read.
  const AGENTS_INTRO = 'This project tracks its work with Scrawl. Any coding agent follows the rules below: where they say ' +
    'Claude or `assignee: claude`, that means you, the AI agent. The steps for /resolve, /next, /plan and the other ' +
    'commands are in `.claude/commands/`; if your tool has no slash commands, follow those files as instructions.';

  /* Puts the protocol in a guidance file (CLAUDE.md, AGENTS.md): created if missing, appended to one that
     lacks the section (keeping its own line endings), and left alone when it already has it. */
  async function protocolFile(root, path, heading, out) {
    const t = S.templates;
    const disk = await S.fs.read(root, path);
    if (!disk) {
      await S.fs.write(root, path, `${heading}${t.protocol}`);
      out.push([path, 'created with the Scrawl protocol']);
    } else if (!lf(disk.text).split('\n').some((l) => l.trim() === t.section)) {
      const eol = disk.text.includes('\r\n') ? '\r\n' : '\n';
      const text = disk.text.replace(/\s*$/, '') + eol + eol + t.protocol.replace(/\n/g, eol);
      await S.fs.write(root, path, text);
      out.push([path, 'Scrawl protocol added at the end']);
    } else {
      out.push([path, 'already has the protocol, left alone']);
    }
  }

  // A repo that lacks the protocol in CLAUDE.md or the setup hook hasn't been hooked up yet.
  async function needed(root) {
    const t = S.templates;
    const claude = await S.fs.read(root, 'CLAUDE.md');
    if (!claude || !lf(claude.text).split('\n').some((l) => l.trim() === t.section)) return true;
    return !(await S.fs.read(root, '.scrawl/hooks/scrawl-setup'));
  }

  async function run(root) {
    const t = S.templates;
    const out = [];
    await protocolFile(root, 'CLAUDE.md', `# ${S.store.project}\n\n`, out);
    await protocolFile(root, 'AGENTS.md', `# AGENTS.md\n\n${AGENTS_INTRO}\n\n`, out);

    for (const [path, text] of Object.entries(t.files)) {
      const disk = await S.fs.read(root, path);
      if (disk && lf(disk.text) === text) out.push([path, 'up to date']);
      else if (disk && !isHook(path)) out.push([path, 'yours differs, left alone']);
      else {
        await S.fs.write(root, path, text);
        out.push([path, disk ? 'updated' : 'added']);
      }
    }
    return out;
  }

  function list(rows) {
    return el('ul', { class: 'hookup-list' }, rows.map(([path, what]) => el('li', {}, el('code', {}, path), ' ', el('span', { class: 'muted' }, what))));
  }

  function open() {
    const t = S.templates;
    const box = dialog();
    const close = el('button', { class: 'btn', onclick: () => box.close() }, 'Close');
    box.replaceChildren(el('div', { class: 'hookup' },
      el('h2', {}, '🤖 Hook up Claude'),
      el('p', {}, `Writes what Claude Code needs to work this board into "${S.store.state.root.name}":`),
      list([
        ['CLAUDE.md', 'the Scrawl protocol (appended; your own text stays)'],
        ['AGENTS.md', 'the same protocol, for other coding agents (appended; your own text stays)'],
        ...Object.keys(t.files).map((p) => [p, isHook(p) ? 'git hook' : 'slash command, unless you have your own']),
      ]),
      el('div', { class: 'welcome-actions' },
        el('button', {
          class: 'btn btn-big',
          onclick: async (e) => {
            e.target.disabled = true;
            try {
              done(await run(S.store.state.root));
            } catch (err) {
              e.target.disabled = false;
              S.util.toast(`Couldn't write the files: ${err.message}`, 'warn');
            }
          },
        }, '✎ Write them'),
        close)));
    box.showModal();
  }

  function done(rows) {
    dialog().replaceChildren(el('div', { class: 'hookup' },
      el('h2', {}, 'Claude is hooked up ✓'),
      list(rows),
      el('p', {}, SETUP_ASK),
      el('div', { class: 'wizard-command' },
        el('code', {}, SETUP),
        el('button', { class: 'btn btn-claude', onclick: () => S.util.copy(SETUP) }, '📋 Copy')),
      el('p', { class: 'muted' }, 'Then in Claude Code: /plan to plan, /next to start on Claude\'s tray.'),
      el('div', { class: 'welcome-actions' }, el('button', { class: 'btn', onclick: () => dialog().close() }, 'Close'))));
  }

  S.hookup = { open, needed, run, list, WINDOWS, SETUP, SETUP_ASK };
})();
