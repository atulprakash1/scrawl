/* Hook up Claude: write the protocol, slash commands and git hooks (from templates.js) into the open repo. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  // chmod: files written by the browser aren't executable, and git on macOS skips such hooks.
  const SETUP = 'chmod +x .scrawl/hooks/* && sh .scrawl/hooks/scrawl-setup';

  const dialog = () => document.getElementById('hookup');
  const isHook = (path) => path.startsWith('.scrawl/hooks/');
  const lf = (text) => text.replace(/\r\n/g, '\n');

  /* Scrawl owns its hooks, so those are refreshed. CLAUDE.md and the commands may be yours by now:
     a missing protocol section is appended, an existing command is never overwritten. */
  async function run(root) {
    const t = S.templates;
    const out = [];
    const claude = await S.fs.read(root, 'CLAUDE.md');
    if (!claude) {
      await S.fs.write(root, 'CLAUDE.md', `# ${S.store.project}\n\n${t.protocol}`);
      out.push(['CLAUDE.md', 'created with the Scrawl protocol']);
    } else if (!lf(claude.text).split('\n').some((l) => l.trim() === t.section)) {
      const eol = claude.text.includes('\r\n') ? '\r\n' : '\n';
      const text = claude.text.replace(/\s*$/, '') + eol + eol + t.protocol.replace(/\n/g, eol);
      await S.fs.write(root, 'CLAUDE.md', text);
      out.push(['CLAUDE.md', 'Scrawl protocol added at the end']);
    } else {
      out.push(['CLAUDE.md', 'already has the protocol, left alone']);
    }

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
      el('p', {}, 'Once, in a terminal at the repo root (it needs git), turn on the hooks and give the board its own branch:'),
      el('div', { class: 'wizard-command' },
        el('code', {}, SETUP),
        el('button', { class: 'btn btn-claude', onclick: () => S.util.copy(SETUP) }, '📋 Copy')),
      el('p', { class: 'muted' }, 'Then in Claude Code: /plan to plan, /next to start on Claude\'s tray.'),
      el('div', { class: 'welcome-actions' }, el('button', { class: 'btn', onclick: () => dialog().close() }, 'Close'))));
  }

  S.hookup = { open, run, SETUP };
})();
