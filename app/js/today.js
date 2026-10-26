/* Today: a one-glance start to a session. What Claude (or git) did today and since your last visit,
   what waits for you, and what has gone stale. "Last visit" is kept per project in this browser. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  const DAY = 86400000;
  // Same thresholds as /groom.
  const STALE_DAYS = { doing: 14, review: 14, ready: 30 };

  // A reload is not a new visit: a visit ends after this long away from the board.
  const AWAY_MS = 30 * 60000;
  const fmt = (d) => S.util.stamp(d).replace('T', ' ');

  let since = null; // 'YYYY-MM-DD HH:MM' when you left the board last time, or null on a first visit
  let seenKey = null;
  let heartbeat = null;

  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch { /* private window */ }
  }
  function recall(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  // While the board is open (and visible) keep "last seen" fresh, so it marks when you left.
  function touch() {
    if (seenKey && !document.hidden) remember(seenKey, fmt(new Date()));
  }

  // Called when a project opens. Within AWAY_MS of the last time the board was seen, this is the same
  // visit (keep its "since"); after a longer break, "since" becomes the moment you left.
  function visit(project) {
    seenKey = `scrawl-last-seen:${project}`;
    const sinceKey = `scrawl-visit-since:${project}`;
    const seen = recall(seenKey) || recall(`scrawl-last-visit:${project}`); // older builds kept only this
    const away = seen ? Date.now() - Date.parse(seen.replace(' ', 'T')) : Infinity;
    since = away > AWAY_MS ? seen : recall(sinceKey);
    if (since) remember(sinceKey, since);
    touch();
    if (!heartbeat) {
      heartbeat = setInterval(touch, 60000);
      document.addEventListener('visibilitychange', touch);
      window.addEventListener('pagehide', touch);
    }
  }

  function link(item, extra) {
    return el('li', {},
      el('button', { class: 'link-btn', onclick: () => S.drawer.open(item.file) }, `#${item.id} ${item.meta.title || '(untitled)'}`),
      extra ? el('span', { class: 'muted' }, ` · ${extra}`) : null);
  }

  function changes(from) {
    const out = [];
    for (const item of store.list()) {
      const lines = S.parser.activity(item.body).filter((a) => a.at > from && a.who && a.who !== 'me');
      if (lines.length) out.push({ item, lines, last: lines.at(-1).at });
    }
    out.sort((a, b) => (a.last < b.last ? 1 : -1));
    const commits = store.state.commits.filter((c) => (c.date || '').slice(0, 16).replace('T', ' ') > from);
    return { out, commits };
  }

  function waiting() {
    return store.list().filter((i) => {
      if (i.meta.status === 'review') return true;
      const last = S.parser.activity(i.body).at(-1);
      return last && last.who === 'claude' && /@me\b/.test(last.text) && !['done', 'wontfix'].includes(i.meta.status);
    }).sort((a, b) => a.id - b.id);
  }

  function stale() {
    const now = Date.now();
    return store.list().map((i) => {
      const limit = STALE_DAYS[i.meta.status];
      const updated = Date.parse(i.meta.updated || '');
      const days = Number.isNaN(updated) ? 0 : Math.floor((now - updated) / DAY);
      return { i, days, limit };
    }).filter((x) => x.limit && x.days > x.limit).sort((a, b) => b.days - a.days);
  }

  function section(title, body) {
    return el('section', { class: 'today-card' }, el('h3', {}, title), body);
  }

  function render() {
    const root = document.getElementById('today');
    // At least all of today; further back if your last visit was before midnight.
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const today = fmt(midnight);
    const from = since && since < today ? since : today;
    const { out, commits } = changes(from);
    const wait = waiting();
    const old = stale();

    const changed = out.length || commits.length
      ? el('ul', { class: 'today-list' },
        out.map(({ item, lines }) => link(item, lines.length === 1 ? lines[0].text : `${lines.length} updates, last: ${lines.at(-1).text}`)),
        commits.length ? el('li', { class: 'muted' }, `⎇ ${commits.length} new commit${commits.length > 1 ? 's' : ''} (see Timeline)`) : null)
      : el('p', { class: 'muted' }, 'Quiet. Nothing new from Claude or git.');

    root.replaceChildren(el('div', { class: 'today-inner' },
      el('header', { class: 'view-head' }, el('h2', { class: 'view-title' }, 'Today'),
        el('span', { class: 'muted' }, from === today
          ? `changes today${since ? `, last visit ${since}` : ''}`
          : `changes since your last visit, ${since}`)),
      section('What changed', changed),
      section('Waiting for you', wait.length
        ? el('ul', { class: 'today-list' }, wait.map((i) => link(i, i.meta.status === 'review' ? 'ready for review' : 'Claude asked you something')))
        : el('p', { class: 'muted' }, 'Nothing is waiting on you.')),
      section('Gone stale', old.length
        ? el('ul', { class: 'today-list' }, old.map(({ i, days }) => link(i, `${i.meta.status} for ${days} days`)))
        : el('p', { class: 'muted' }, 'Nothing stale.'))));
  }

  S.today = { render, visit };
})();
