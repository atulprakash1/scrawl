/* Timeline: one line of what happened when, newest first and grouped by day. Built from every item's
   Activity lines, the commit log and the release pages. Commits that don't start with "#N" are
   orphans: work no card knows about, drawn as loose sticky notes. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  let filter = '';
  try { filter = localStorage.getItem('scrawl-timeline-filter') || ''; } catch { /* private window */ }

  // Every event: { at: 'YYYY-MM-DD HH:MM', who, kind: 'activity' | 'commit' | 'release', text, item?, orphan? }
  function events() {
    const out = [];
    for (const item of store.list()) {
      for (const a of S.parser.activity(item.body)) {
        if (a.at) out.push({ at: a.at, who: a.who, kind: 'activity', text: a.text, item });
      }
    }
    for (const c of store.state.commits) {
      const item = c.refs.length ? store.byId(c.refs[0]) : null;
      const orphan = !c.refs.length && !/^Merge /.test(c.subject || '');
      out.push({ at: (c.date || '').slice(0, 16).replace('T', ' '), who: 'git', kind: 'commit', text: c.subject || '', sha: c.sha, author: c.author, item, orphan });
    }
    for (const r of store.state.releases) {
      const date = (r.text.match(/^\d{4}-\d{2}-\d{2}$/m) || [''])[0];
      if (date) out.push({ at: `${date} 23:59`, who: 'scrawl', kind: 'release', text: `Released v${r.version}` });
    }
    return out.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  }

  function keep(e) {
    if (!filter) return true;
    if (filter === 'commits') return e.kind === 'commit';
    return e.kind === 'activity' && e.who === filter;
  }

  function row(e) {
    const ref = e.item ? `#${e.item.id} ${e.item.meta.title || ''}` : '';
    const open = e.item ? () => S.drawer.open(e.item.file) : null;
    const time = el('span', { class: 'tl-time muted' }, e.kind === 'release' ? '' : e.at.slice(11));
    if (e.kind === 'commit' && e.orphan) {
      return el('li', { class: 'tl-row tl-orphan' }, time,
        el('div', { class: 'tl-note', title: 'This commit names no item. Start the message with #N to link it.' },
          el('span', { class: 'tl-orphan-tag' }, 'orphan commit'),
          el('div', {}, el('code', {}, e.sha), ' ', e.text),
          el('div', { class: 'muted' }, e.author)));
    }
    const icon = e.kind === 'commit' ? '⎇' : e.kind === 'release' ? '🏷' : S.board.WHO_ICON[e.who] || '•';
    return el('li', { class: `tl-row tl-${e.kind} who-${e.who}` }, time,
      el('span', { class: 'tl-icon', 'aria-hidden': 'true' }, icon),
      el('div', { class: 'tl-body' },
        e.kind === 'commit' ? [el('code', {}, e.sha), ' '] : null,
        e.kind === 'activity' ? el('span', { html: S.util.markdown(e.text).replace(/^<p>|<\/p>\s*$/g, '') }) : e.text,
        ref ? el('button', { class: 'link-btn tl-ref', onclick: open }, ref) : null));
  }

  function render() {
    const root = document.getElementById('timeline');
    const shown = events().filter(keep);
    const days = new Map();
    for (const e of shown) {
      const day = e.at.slice(0, 10);
      if (!days.has(day)) days.set(day, []);
      days.get(day).push(e);
    }
    const choose = el('select', {
      class: 'filter', 'aria-label': 'Show',
      onchange: (ev) => {
        filter = ev.target.value;
        try { localStorage.setItem('scrawl-timeline-filter', filter); } catch { /* fine */ }
        render();
      },
    }, [['', 'everything'], ['me', '☕ me'], ['claude', '🤖 claude'], ['commits', '⎇ commits']]
      .map(([v, label]) => el('option', { value: v, selected: v === filter }, label)));
    const orphans = shown.filter((e) => e.orphan).length;
    root.replaceChildren(el('div', { class: 'timeline-inner' },
      el('header', { class: 'view-head' }, el('h2', { class: 'view-title' }, 'Timeline'), choose,
        orphans ? el('span', { class: 'muted' }, `${orphans} orphan commit${orphans > 1 ? 's' : ''}`) : null),
      days.size
        ? [...days].map(([day, list]) => el('section', { class: 'tl-day' },
          el('h3', {}, day), el('ol', { class: 'tl-list' }, list.map(row))))
        : el('p', { class: 'muted' }, 'Nothing here yet.')));
  }

  S.timeline = { render, events };
})();
