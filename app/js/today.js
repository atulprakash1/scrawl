/* Today: a one-glance start to a session. What Claude (or git) did since your last visit, what waits
   for you, and what has gone stale. "Last visit" is kept per project in this browser. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  const DAY = 86400000;
  // Same thresholds as /groom.
  const STALE_DAYS = { doing: 14, review: 14, ready: 30 };

  let since = null; // 'YYYY-MM-DD HH:MM' of the previous visit, or null on a first visit

  // Called once when a project opens: remember the previous visit and record this one.
  function visit(project) {
    const key = `scrawl-last-visit:${project}`;
    since = null;
    try {
      since = localStorage.getItem(key);
      localStorage.setItem(key, S.util.stamp().replace('T', ' '));
    } catch { /* private window: show the last day instead */ }
  }

  const fmt = (d) => S.util.stamp(d).replace('T', ' ');

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
    const from = since || fmt(new Date(Date.now() - DAY));
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
        el('span', { class: 'muted' }, since ? `since your last visit, ${since}` : 'first visit here: showing the last day')),
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
