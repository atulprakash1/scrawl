/* Boot: find (or ask for) the project folder, then show the board. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  const screens = ['welcome', 'app'];
  function show(name) {
    for (const s of screens) document.getElementById(s).hidden = s !== name;
  }

  function setOffline(off) {
    document.getElementById('offline').hidden = !off;
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
    show('app');
    S.board.render();
    S.watcher.start();
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
    if (!S.fs.supported) {
      return welcome('This browser can\'t write to folders. Open scrawl.html in Chrome, Edge, Arc or Opera. ' +
        '(Brave: enable "File System Access API" in brave://flags.)', []);
    }
    S.board.bindToolbar();
    S.store.on((change) => {
      S.board.render();
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
      try { S.watcher.stop(); start(await S.fs.pick()); } catch (e) { if (e.name !== 'AbortError') S.util.toast(e.message, 'warn'); }
    });

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

  S.app = { setOffline };
  document.addEventListener('DOMContentLoaded', boot);
})();
