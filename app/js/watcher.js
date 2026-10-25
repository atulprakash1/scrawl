/* The browser isn't told when files change, so poll every 2s while the tab is visible. */
(function () {
  const S = window.Scrawl;
  const EVERY_MS = 2000;
  let timer = null;
  let busy = false;

  async function tick() {
    if (busy || document.hidden) return;
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
    }
  }

  function start() {
    stop();
    timer = setInterval(tick, EVERY_MS);
    document.addEventListener('visibilitychange', tick);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    document.removeEventListener('visibilitychange', tick);
  }

  S.watcher = { start, stop, tick };
})();
