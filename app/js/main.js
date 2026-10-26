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

  function welcome(message, actions) {
    const box = document.getElementById('welcome-actions');
    document.getElementById('welcome-msg').textContent = message;
    box.replaceChildren(...actions);
    show('welcome');
  }

  async function start(root) {
    let ok;
    try {
      ok = await S.store.open(root);
    } catch (e) {
      console.error(e);
      return welcome(`Couldn't read "${root.name}": ${e.message}`, [pickButton()]);
    }
    if (!ok) {
      return welcome(`"${root.name}" has no .scrawl/ folder yet. Pick your repo's root folder, or start Scrawl here.`, [
        el('button', { class: 'btn btn-big', onclick: async () => start(await initAndReturn(root)) }, `✎ Start Scrawl in "${root.name}"`),
        pickButton('Pick a different folder'),
      ]);
    }
    document.getElementById('project-name').textContent = S.store.project;
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
        const ids = change.outside.map((f) => (S.store.get(f) ? `#${S.store.get(f).id}` : f)).join(', ');
        S.util.toast(`✎ Changed outside Scrawl: ${ids}`);
      }
    });
    document.getElementById('regrant').addEventListener('click', async () => {
      if (await S.fs.permission(S.store.state.root, true)) setOffline(false);
    });
    document.getElementById('switch-folder').addEventListener('click', async () => {
      if (S.store.state.readOnly) return document.querySelector('#readonly-banner input[type=file]')?.click();
      try { S.watcher.stop(); start(await S.fs.pick()); } catch (e) { if (e.name !== 'AbortError') S.util.toast(e.message, 'warn'); }
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
      ]);
    }
    welcome('Pick the root folder of your repo (the one that holds .scrawl/).', [pickButton()]);
  }

  S.app = { setOffline, setView };
  document.addEventListener('DOMContentLoaded', boot);
})();
