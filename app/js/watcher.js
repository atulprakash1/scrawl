/* Keeps the board in step with .scrawl/ on disk. Where the browser has FileSystemObserver it is told
   about changes and refreshes at once, with a slow poll as a safety net; elsewhere it polls every 2s
   while the tab is visible. */
(function () {
  const S = window.Scrawl;
  const EVERY_MS = 2000;
  const SAFETY_MS = 30000; // with an observer, still look now and then in case an event was missed
  const SETTLE_MS = 150; // one refresh for a burst of writes (git checkouts, Claude saving several files)
  let timer = null;
  let observer = null;
  let settle = null;
  let busy = false;
  let again = false;

  async function tick() {
    if (document.hidden) return;
    if (busy) { again = true; return; }
    busy = true;
    try {
      await S.store.poll();
      S.app.setOffline(false);
    } catch (e) {
      // Usually a lost permission after a browser update, or the folder moved.
      console.warn('Scrawl poll failed', e);
      S.app.setOffline(true);
    } finally {
      busy = false;
      if (again) { again = false; tick(); }
    }
  }

  function soon() {
    clearTimeout(settle);
    settle = setTimeout(tick, SETTLE_MS);
  }

  // Only a real folder handle can be observed (not the read-only copy Firefox and Safari get).
  async function observe(root) {
    if (typeof window.FileSystemObserver !== 'function' || S.store.state.readOnly || !root || root.kind !== 'directory') return false;
    try {
      const dir = await S.fs.dir(root, '.scrawl');
      observer = new window.FileSystemObserver(soon);
      await observer.observe(dir, { recursive: true });
      return true;
    } catch (e) {
      console.warn('Scrawl: FileSystemObserver unavailable, polling instead', e);
      observer = null;
      return false;
    }
  }

  async function start() {
    stop();
    const live = await observe(S.store.state.root);
    timer = setInterval(tick, live ? SAFETY_MS : EVERY_MS);
    document.addEventListener('visibilitychange', tick);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    clearTimeout(settle);
    if (observer) observer.disconnect();
    observer = null;
    document.removeEventListener('visibilitychange', tick);
  }

  S.watcher = { start, stop, tick, get live() { return Boolean(observer); } };
})();
