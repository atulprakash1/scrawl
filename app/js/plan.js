/* Plan view: a Proposed lane (what /plan suggested, to accept or reject) next to the tree of
   features → their stories. Drag a story onto another feature to re-parent it. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  let dragging = false;
  let pending = false;
  const sortables = [];

  // Proposed items live in the lane, rejected ones nowhere; the tree shows everything else.
  const inTree = (i) => i.meta.status !== 'proposed' && i.meta.status !== 'wontfix';
  const label = (status) => (store.config.columns.find((c) => c.status === status) || {}).label;

  function accept(item) {
    const where = label('backlog');
    return store.update(item.file, (d) => { d.meta.status = 'backlog'; }, { activity: `Accepted${where ? ` (${where})` : ''}` });
  }

  function reject(item) {
    return store.update(item.file, (d) => { d.meta.status = 'wontfix'; }, { activity: 'Rejected (wontfix)' });
  }

  function row(item, ...extra) {
    const m = item.meta;
    return el('div', {
      class: `plan-row type-${m.type || 'story'}`,
      tabindex: 0,
      'aria-label': `#${item.id} ${m.type}: ${m.title || 'untitled'}`,
      onclick: () => S.drawer.open(item.file),
      onkeydown: (e) => { if (e.key === 'Enter' && e.target === e.currentTarget) S.drawer.open(item.file); },
    },
    el('span', { class: 'num' }, `#${item.id}`),
    el('span', { class: 'kind', title: m.type }, S.board.TYPE_ICON[m.type] || '•'),
    el('span', { class: 'plan-title' }, m.title || '(untitled)'),
    m.size ? el('span', { class: 'size', title: 'size' }, m.size) : null,
    ...extra);
  }

  const pill = (item) => el('span', { class: `pill pill-${item.meta.status}` }, label(item.meta.status) || item.meta.status);

  function decide(item) {
    const click = (fn) => (e) => { e.stopPropagation(); fn(item); };
    return el('span', { class: 'decide' },
      el('button', { class: 'btn btn-ship', title: 'Accept: move to the Someday pile', onclick: click(accept) }, '✔ accept'),
      el('button', { class: 'btn btn-reject', title: 'Reject: mark wontfix', onclick: click(reject) }, '✗'));
  }

  function proposedLane() {
    const items = store.list().filter((i) => i.meta.status === 'proposed').sort(store.compareRank);
    const ids = new Set(items.map((i) => i.id));
    const shown = new Set();

    // A proposed feature carries its proposed stories; anything else stands alone with a note
    // saying where it would go.
    function entry(item) {
      shown.add(item.id);
      const kids = items.filter((i) => i.meta.parent === item.id && !shown.has(i.id));
      const parent = !ids.has(item.meta.parent) && item.meta.parent ? store.byId(item.meta.parent) : null;
      return el('li', {},
        row(item, decide(item)),
        parent ? el('p', { class: 'muted plan-under' }, `under #${parent.id} ${parent.meta.title || ''}`) : null,
        kids.length ? el('ul', { class: 'plan-list' }, kids.map(entry)) : null);
    }

    const tops = items.filter((i) => !ids.has(i.meta.parent)).map(entry);
    const rest = items.filter((i) => !shown.has(i.id)).map(entry); // parent loops: still show them
    return el('section', { class: 'plan-lane' },
      el('header', {}, el('h2', {}, 'Proposed'), el('span', { class: 'count' }, String(items.length))),
      items.length
        ? el('ul', { class: 'plan-list' }, tops, rest)
        : el('p', { class: 'muted plan-empty' }, 'Nothing waiting. Run /plan in Claude Code and its proposals land here.'));
  }

  function tree() {
    const items = store.list().filter(inTree);
    const features = items.filter((i) => i.meta.type === 'feature').sort(store.compareRank);
    const featureIds = new Set(features.map((f) => f.id));
    const proposed = store.list().filter((i) => i.meta.status === 'proposed');

    const kidsOf = (parent) => items
      .filter((i) => (parent ? i.meta.parent === parent : i.meta.type === 'story' && !featureIds.has(i.meta.parent)))
      .filter((i) => i.meta.type !== 'feature')
      .sort(store.compareRank);
    const children = (parent, kids) => el('ul', { class: 'plan-list plan-children', dataset: { parent: String(parent) } },
      kids.map((i) => el('li', { dataset: { file: i.file } }, row(i, pill(i)))));
    const finished = (kids) => kids.filter((k) => k.meta.status === 'done' || k.meta.status === 'resolved').length;

    // Each feature is a card: its header row, its stories, and how far along they are.
    const groups = features.map((f) => {
      const kids = kidsOf(f.id);
      const waiting = proposed.filter((p) => p.meta.parent === f.id).length;
      const done = finished(kids);
      return el('section', { class: 'plan-feature type-feature' },
        row(f, pill(f)),
        children(f.id, kids),
        el('footer', { class: 'plan-feature-foot' },
          el('span', {}, kids.length ? `${done}/${kids.length} done` : 'no stories yet'),
          kids.length ? el('span', { class: 'meter', 'aria-hidden': 'true' }, el('span', { style: `width:${Math.round((done / kids.length) * 100)}%` })) : null,
          waiting ? el('span', { class: 'plan-waiting', title: 'proposed stories waiting in the lane' }, `+${waiting} proposed`) : null));
    });
    const loose = kidsOf(0);
    groups.push(el('section', { class: 'plan-feature plan-orphans' },
      el('h3', {}, 'Stories without a feature', el('span', { class: 'count' }, String(loose.length))),
      children(0, loose)));

    return el('section', { class: 'plan-tree' },
      el('header', {}, el('h2', {}, 'Features'), el('span', { class: 'count' }, String(features.length)),
        el('span', { class: 'muted' }, 'drag a story onto another feature to move it')),
      groups);
  }

  function render() {
    if (dragging) { pending = true; return; }
    const root = document.getElementById('plan');
    const scroll = root.scrollTop;
    sortables.splice(0).forEach((s) => s.destroy());
    root.replaceChildren(proposedLane(), tree());
    for (const list of root.querySelectorAll('.plan-children')) {
      sortables.push(window.Sortable.create(list, {
        group: 'plan',
        sort: false, // order comes from rank on the board; here only the parent changes
        disabled: store.state.readOnly,
        animation: 150,
        ghostClass: 'card-ghost',
        dragClass: 'card-drag',
        forceFallback: true,
        fallbackOnBody: true,
        fallbackTolerance: 4,
        emptyInsertThreshold: 24, // an empty feature is still easy to drop on
        onStart: () => { dragging = true; document.body.classList.add('dragging'); },
        onEnd: onDrop,
      }));
    }
    root.scrollTop = scroll;
  }

  async function onDrop(evt) {
    dragging = false;
    document.body.classList.remove('dragging');
    try {
      if (evt.from === evt.to) return;
      const item = store.get(evt.item.dataset.file);
      const parent = Number(evt.to.dataset.parent);
      const old = item.meta.parent;
      const feature = parent && store.byId(parent);
      const activity = parent
        ? `Moved under #${parent}${feature ? ` (${feature.meta.title})` : ''}`
        : `Taken out of #${old}`;
      await store.update(item.file, (d) => {
        if (parent) d.meta.parent = parent;
        else delete d.meta.parent;
      }, { activity });
    } catch (e) {
      console.error(e);
      S.util.toast(`Couldn't save the move: ${e.message}`, 'warn');
    } finally {
      pending = false;
      render();
    }
  }

  S.plan = { render, accept, reject };
})();
