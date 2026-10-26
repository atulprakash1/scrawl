/* Bug jar: every open bug as a critter in a jar, worst severity first, then oldest. One-line quick add,
   and "Hand to Claude" straight to Claude's tray. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  const WORST_FIRST = ['kraken', 'cockroach', 'beetle', 'ant'];
  const CLOSED = new Set(['done', 'resolved', 'wontfix', 'proposed']);

  const isOpen = (i) => i.meta.type === 'bug' && !CLOSED.has(i.meta.status);
  const rankOf = (i) => { const r = WORST_FIRST.indexOf(i.meta.severity); return r < 0 ? WORST_FIRST.indexOf('beetle') : r; };

  function age(item) {
    const created = Date.parse(item.meta.created || '');
    if (Number.isNaN(created)) return '';
    const days = Math.floor((Date.now() - created) / 86400000);
    return days < 1 ? 'today' : `${days}d`;
  }

  const inTray = (i) => i.meta.status === 'ready' && i.meta.assignee === 'claude';
  const label = (status) => (store.config.columns.find((c) => c.status === status) || {}).label || status;

  function critter(item) {
    const m = item.meta;
    const sev = m.severity || 'beetle';
    return el('li', {
      class: `critter sev-${sev}`,
      tabindex: 0,
      'aria-label': `#${item.id} ${sev} bug: ${m.title || 'untitled'}`,
      onclick: () => S.drawer.open(item.file),
      onkeydown: (e) => { if (e.key === 'Enter' && e.target === e.currentTarget) S.drawer.open(item.file); },
    },
    el('span', { class: 'critter-icon', title: sev }, S.board.SEVERITY_ICON[sev] || '🐞'),
    el('div', { class: 'critter-body' },
      el('div', {}, el('span', { class: 'num' }, `#${item.id}`), ' ', m.title || '(untitled)'),
      el('div', { class: 'muted critter-meta' }, `${sev} · ${age(item)} · ${label(m.status)} · ${S.board.WHO_ICON[m.assignee || 'me'] || ''} ${m.assignee || 'me'}`)),
    inTray(item)
      ? el('span', { class: 'muted critter-tray' }, "in Claude's tray")
      : el('button', {
        class: 'btn btn-claude',
        onclick: (e) => {
          e.stopPropagation();
          store.update(item.file, (d) => { d.meta.status = 'ready'; d.meta.assignee = 'claude'; }, { activity: "Handed to Claude (Claude's tray)" });
        },
      }, '🤖 Hand to Claude'));
  }

  function quickAdd() {
    return el('form', {
      class: 'bug-add',
      autocomplete: 'off',
      onsubmit: async (e) => {
        e.preventDefault();
        const f = e.target.elements;
        const title = f.title.value.trim();
        if (!title) return;
        f.title.value = '';
        const item = await store.create({ type: 'bug', title, severity: f.severity.value });
        S.util.toast(`Caught #${item.id} in the jar`);
      },
    },
    el('input', { name: 'title', placeholder: 'A bug in one line…', 'aria-label': 'Bug title' }),
    el('select', { name: 'severity', 'aria-label': 'Severity' },
      [...WORST_FIRST].reverse().map((s) => el('option', { value: s, selected: s === 'beetle' }, `${S.board.SEVERITY_ICON[s]} ${s}`))),
    el('button', { class: 'btn', type: 'submit' }, '+ catch'));
  }

  function render() {
    const root = document.getElementById('bugs');
    const bugs = store.list().filter(isOpen).sort((a, b) =>
      rankOf(a) - rankOf(b) || String(a.meta.created || '').localeCompare(String(b.meta.created || '')) || a.id - b.id);
    const counts = WORST_FIRST.map((s) => `${S.board.SEVERITY_ICON[s]} ${bugs.filter((b) => (b.meta.severity || 'beetle') === s).length}`).join('  ');
    root.replaceChildren(el('div', { class: 'bugs-inner' },
      el('header', { class: 'view-head' }, el('h2', { class: 'view-title' }, 'Bug jar'), el('span', { class: 'muted' }, counts)),
      quickAdd(),
      el('div', { class: 'jar' },
        el('div', { class: 'jar-lid', 'aria-hidden': 'true' }),
        bugs.length
          ? el('ul', { class: 'jar-critters' }, bugs.map(critter))
          : el('p', { class: 'muted jar-empty' }, 'The jar is empty. Nothing is crawling around.'))));
  }

  S.bugs = { render };
})();
