/* Boot: find (or ask for) the project folder, then show the board. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  const screens = ['welcome', 'wizard', 'app'];
  function show(name) {
    for (const s of screens) document.getElementById(s).hidden = s !== name;
  }

  function setOffline(off) {
    document.getElementById('offline').hidden = !off;
  }

  // One view at a time, each in the element with its name. The choice is remembered per browser.
  const VIEWS = {
    board: () => S.board.render(),
    plan: () => S.plan.render(),
    bugs: () => S.bugs.render(),
    today: () => S.today.render(),
    timeline: () => S.timeline.render(),
    releases: () => S.releases.render(),
  };
  let view = 'board';

  function renderView() {
    VIEWS[view]();
  }

  function setView(next) {
    view = next in VIEWS ? next : 'board';
    for (const name of Object.keys(VIEWS)) document.getElementById(name).hidden = name !== view;
    document.getElementById('hidden-note').hidden = view !== 'board';
    document.getElementById('board-tools').hidden = view !== 'board';
    for (const b of document.querySelectorAll('.view-btn')) b.setAttribute('aria-pressed', String(b.dataset.view === view));
    try { localStorage.setItem('scrawl-view', view); } catch { /* private window */ }
    renderView();
  }

  function bindViews() {
    try { view = localStorage.getItem('scrawl-view') || 'board'; } catch { /* fine */ }
    for (const b of document.querySelectorAll('.view-btn')) b.addEventListener('click', () => setView(b.dataset.view));
  }

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
  }

  function bindTheme() {
    let saved = null;
    try { saved = localStorage.getItem('scrawl-theme'); } catch { /* private window */ }
    applyTheme(saved);
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === 'dark'
        : matchMedia('(prefers-color-scheme: dark)').matches;
      const next = dark ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('scrawl-theme', next); } catch { /* fine */ }
    });
  }

  function welcome(message, actions, { recent = false } = {}) {
    const box = document.getElementById('welcome-actions');
    document.getElementById('welcome-msg').textContent = message;
    box.replaceChildren(...actions);
    show('welcome');
    if (recent) recentList().then((list) => { if (list) box.after(list); });
  }

  /* Recent projects, newest first. Opening one asks the browser for access again if it needs to
     (that needs this click). `current` is marked instead of offered. */
  async function recentList(current) {
    document.querySelector('.recent')?.remove();
    const handles = await S.fs.recent();
    const others = [];
    for (const h of handles) if (!current || !(await h.isSameEntry(current))) others.push(h);
    if (!others.length && !current) return null;
    return el('div', { class: 'recent' },
      el('p', { class: 'recent-title' }, 'Recent projects'),
      el('ul', {},
        current ? el('li', {}, el('span', { class: 'recent-item current' }, `📁 ${current.name}`, el('span', { class: 'muted' }, ' · open now'))) : null,
        others.map((h) => el('li', {}, el('button', {
          class: 'recent-item',
          onclick: async () => {
            if (!(await S.fs.permission(h, true))) return S.util.toast(`No access to "${h.name}"`, 'warn');
            document.getElementById('projects')?.close();
            S.watcher.stop();
            start(h);
          },
        }, `📁 ${h.name}`)))));
  }

  // The folder button: recent projects, plus picking any other folder.
  async function openProjects() {
    const box = document.getElementById('projects');
    const list = await recentList(S.store.state.root);
    box.replaceChildren(el('div', { class: 'projects' },
      el('h2', {}, 'Projects'),
      list,
      el('div', { class: 'welcome-actions' },
        el('button', {
          class: 'btn btn-big',
          onclick: async () => {
            try {
              const handle = await S.fs.pick();
              box.close();
              S.watcher.stop();
              start(handle);
            } catch (e) { if (e.name !== 'AbortError') S.util.toast(e.message, 'warn'); }
          },
        }, '📂 Pick another folder…'),
        el('button', { class: 'btn', onclick: () => box.close() }, 'Close'))));
    if (!box.open) box.showModal();
  }

  async function start(root) {
    let ok;
    try {
      ok = await S.store.open(root);
    } catch (e) {
      console.error(e);
      return welcome(`Couldn't read "${root.name}": ${e.message}`, [pickButton()]);
    }
    if (!ok && await hasBoardBranch(root)) {
      // A fresh clone: the board exists on its branch, it just isn't checked out. Starting a new one would fork it.
      return welcome(`"${root.name}" already has a Scrawl board on its scrawl-board branch. Check it out once in a terminal ` +
        'at the repo root (or ask Claude Code to: the Scrawl protocol in CLAUDE.md tells it how), then open it again:', [
        el('div', { class: 'wizard-command' },
          el('code', {}, CHECKOUT),
          el('button', { class: 'btn btn-claude', onclick: () => S.util.copy(CHECKOUT) }, '📋 Copy')),
        el('button', { class: 'btn btn-big', onclick: () => start(root) }, '↻ Open it again'),
      ]);
    }
    if (!ok) {
      return welcome(`"${root.name}" has no .scrawl/ folder yet. Pick your repo's root folder, or start Scrawl here.`, [
        el('button', { class: 'btn btn-big', onclick: async () => start(await initAndReturn(root)) }, `✎ Start Scrawl in "${root.name}"`),
        pickButton('Pick a different folder'),
      ]);
    }
    if (!S.store.state.readOnly) S.fs.remember(root);
    const name = document.getElementById('project-name');
    name.textContent = S.store.project;
    name.title = S.store.project; // the full name, when it's cut short
    document.title = `${S.store.project} · Scrawl`;
    S.today.visit(S.store.project);
    if (S.store.state.projectEmpty && !S.store.state.readOnly) {
      show('wizard');
      return S.wizard.start(document.getElementById('wizard-card'), openBoard);
    }
    openBoard();
  }

  function openBoard() {
    show('app');
    setView(view);
    S.watcher.start();
  }

  // Firefox/Safari: load the picked folder's .scrawl/ into memory and show it without any way to write.
  async function openReadOnly(entries) {
    const { count, impl } = S.readonly.fsFrom(entries);
    if (!count) {
      return welcome('That folder has no .scrawl/ in it. Pick your repo\'s root folder.', S.readonly.button('📂 Open read-only', openReadOnly));
    }
    S.watcher.stop();
    Object.assign(S.fs, impl); // the store holds this same object
    S.store.state.readOnly = true;
    document.body.classList.add('read-only');
    const banner = document.getElementById('readonly-banner');
    banner.replaceChildren(
      el('span', {}, 'Read-only: this browser can\'t save to the folder, so nothing here can be changed. Open scrawl.html in Chrome or Edge to edit. '),
      ...S.readonly.button('↻ Load the folder again', openReadOnly));
    banner.querySelector('.btn').classList.remove('btn-big');
    banner.hidden = false;
    start({ name: (entries[0].path || '').split('/')[0] || 'project' });
  }

  const CHECKOUT = 'git worktree add .scrawl scrawl-board && sh .scrawl/hooks/scrawl-setup';

  // Whether the repo's git knows a scrawl-board branch, local or fetched (loose ref or packed-refs).
  async function hasBoardBranch(root) {
    if (S.store.state.readOnly) return false;
    try {
      for (const ref of ['refs/heads/scrawl-board', 'refs/remotes/origin/scrawl-board']) {
        if (await S.fs.read(root, `.git/${ref}`)) return true;
      }
      const packed = await S.fs.read(root, '.git/packed-refs');
      return !!packed && /^\w+ refs\/(heads|remotes\/[^/\s]+)\/scrawl-board\s*$/m.test(packed.text);
    } catch {
      return false; // .git is a file (a worktree or submodule) or unreadable: offer the usual start
    }
  }

  async function initAndReturn(root) {
    await S.store.init(root);
    return root;
  }

  function pickButton(label = '📂 Open project folder') {
    return el('button', {
      class: 'btn btn-big',
      onclick: async () => {
        try {
          start(await S.fs.pick());
        } catch (e) {
          if (e.name !== 'AbortError') welcome(`Couldn't open that folder: ${e.message}`, [pickButton()]);
        }
      },
    }, label);
  }

  async function boot() {
    bindTheme();
    S.board.bindToolbar();
    bindViews();
    document.getElementById('hookup-btn').addEventListener('click', S.hookup.open);
    document.getElementById('palette-btn').addEventListener('click', S.palette.open);
    S.store.on((change) => {
      renderView();
      S.drawer.refresh();
      if (change.outside && change.outside.length) {
        S.board.flash(change.outside);
        const ids = change.outside.map((f) => (S.store.get(f) ? `#${S.store.get(f).id}` : f)).join(', ');
        S.util.toast(`✎ Changed outside Scrawl: ${ids}`);
      }
    });
    document.getElementById('regrant').addEventListener('click', async () => {
      if (await S.fs.permission(S.store.state.root, true)) setOffline(false);
    });
    document.getElementById('switch-folder').addEventListener('click', async () => {
      if (S.store.state.readOnly) return document.querySelector('#readonly-banner input[type=file]')?.click();
      openProjects();
    });

    if (!S.fs.supported) {
      return welcome('This browser can\'t save to folders, so Scrawl opens your board read-only here. ' +
        'Pick your repo\'s root folder (the one that holds .scrawl/). To make changes, use Chrome, Edge, Arc or Opera. ' +
        '(Brave: enable "File System Access API" in brave://flags.)', S.readonly.button('📂 Open read-only', openReadOnly));
    }

    const handle = await S.fs.remembered();
    if (handle && (await S.fs.permission(handle, false))) return start(handle);
    if (handle) {
      return welcome('Welcome back. Your browser needs one click to let Scrawl into the folder again.', [
        el('button', {
          class: 'btn btn-big',
          onclick: async () => { if (await S.fs.permission(handle, true)) start(handle); },
        }, `📂 Reopen "${handle.name}"`),
        pickButton('Pick a different folder'),
      ], { recent: true });
    }
    welcome('Pick the root folder of your repo (the one that holds .scrawl/).', [pickButton()], { recent: true });
  }

  S.app = { setOffline, setView };
  document.addEventListener('DOMContentLoaded', boot);
})();
