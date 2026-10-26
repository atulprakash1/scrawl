/* Kanban board: sticky-note cards in columns, drag to move and reorder. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  const TYPE_ICON = { feature: '★', story: '✎', bug: '🐞', idea: '💡' };
  const SEVERITY_ICON = { ant: '🐜', beetle: '🪲', cockroach: '🪳', kraken: '🦑' };
  const WHO_ICON = { claude: '🤖', me: '☕', scrawl: '📌' };

  const filters = { text: '', who: '' };
  let dragging = false;
  let pending = false;
  const sortables = [];

  function matches(item) {
    const m = item.meta;
    if (filters.who && (m.assignee || 'me') !== filters.who) return false;
    if (!filters.text) return true;
    const q = filters.text.toLowerCase();
    const hay = `#${item.id} ${m.title || ''} ${m.type || ''} ${(m.labels || []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  }

  function card(item) {
    const m = item.meta;
    const type = m.type || 'story';
    const who = m.assignee || 'me';
    const checks = S.parser.checklist(item.body);
    const done = checks.filter((c) => c.done).length;
    const commits = store.commitsFor(item).length;
    const badge = m.status === 'review' && who === 'claude' ? ['needs', 'Needs you']
      : m.status === 'done' ? ['shipped', 'Shipped'] : null;

    return el('article', {
      class: `card type-${type}${item.errors.length ? ' smudged' : ''}`,
      dataset: { file: item.file },
      tabindex: 0,
      'aria-label': `#${item.id} ${type}: ${m.title || 'untitled'}`,
      onclick: () => S.drawer.open(item.file),
      onkeydown: (e) => onCardKey(e, item),
    },
    el('div', { class: 'card-top' },
      el('span', { class: 'type-badge' }, el('span', { 'aria-hidden': 'true' }, TYPE_ICON[type] || '•'), type),
      type === 'bug' && m.severity ? el('span', { class: 'sev', title: `severity: ${m.severity}` }, `${SEVERITY_ICON[m.severity] || ''} ${m.severity}`) : null,
      el('span', { class: 'num' }, `#${item.id}`)),
    el('h3', {}, m.title || '(untitled)'),
    el('div', { class: 'card-foot' },
      el('span', { class: `chip who who-${who}`, title: `assignee: ${who}` }, `${WHO_ICON[who] || '👤'} ${who}`),
      checks.length
        ? el('span', { class: 'chip checks', title: `acceptance: ${done} of ${checks.length}` }, `${done}/${checks.length}`,
          el('span', { class: 'meter', 'aria-hidden': 'true' }, el('span', { style: `width:${Math.round((done / checks.length) * 100)}%` })))
        : null,
      commits ? el('span', { class: 'chip commits', title: 'linked commits' }, `⎇ ${commits}`) : null,
      (m.labels || []).map((l) => el('span', { class: 'chip label' }, l)),
      badge ? el('span', { class: `badge badge-${badge[0]}` }, badge[1]) : null),
    item.errors.length ? el('span', { class: 'smudge', title: item.errors.join('\n') }, 'smudged') : null);
  }

  function render() {
    if (dragging) { pending = true; return; }
    const root = document.getElementById('board');
    const scroll = root.scrollLeft;
    sortables.splice(0).forEach((s) => s.destroy());
    root.replaceChildren();

    for (const col of store.config.columns) {
      const recent = col.sort === 'recent';
      const all = recent ? store.column(col.status).sort(byRecent) : store.column(col.status);
      const shown = all.filter(matches);
      const over = col.wip && all.length > col.wip;
      const folded = isFolded(col);
      // A folded column keeps its width and an empty list, so it still works as a drop target.
      const cards = el('div', { class: 'cards', dataset: { status: col.status } }, folded ? [] : shown.map(card));
      const toggle = isFoldable(col)
        ? el('button', {
          class: 'fold-btn',
          title: folded ? `Show ${col.label}` : `Hide ${col.label}`,
          'aria-expanded': String(!folded),
          onclick: () => setFolded(col, !folded),
        }, folded ? '▸ show' : '▾ hide')
        : null;
      root.append(el('section', { class: `column col-${col.status}${over ? ' over-wip' : ''}${folded ? ' folded' : ''}` },
        el('header', {},
          el('h2', {}, col.label),
          el('span', { class: 'count', title: col.wip ? 'items / WIP limit' : 'items' },
            col.wip ? `${all.length}/${col.wip}` : String(all.length)),
          toggle),
        folded && all.length ? el('p', { class: 'fold-note muted' }, `${all.length} hidden`) : null,
        cards));
      sortables.push(window.Sortable.create(cards, {
        group: 'board',
        sort: !recent, // date-ordered columns accept drops but can't be hand-reordered
        disabled: store.state.readOnly,
        animation: 180,
        easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
        ghostClass: 'card-ghost',
        chosenClass: 'card-chosen',
        dragClass: 'card-drag',
        forceFallback: true, // a real copy of the card follows the pointer, same in every browser
        fallbackOnBody: true, // so the copy isn't clipped by the column's scroll box
        fallbackTolerance: 4, // a click with a tiny wobble is still a click
        onStart: () => { dragging = true; document.body.classList.add('dragging'); },
        onEnd: onDrop,
      }));
    }
    root.scrollLeft = scroll;
    renderHidden();
    noticeShipped();
  }

  // `sort: "recent"` in config.json: newest change first (for Shipped, that's when it shipped).
  function byRecent(a, b) {
    const ua = String(a.meta.updated || '');
    const ub = String(b.meta.updated || '');
    return ua !== ub ? (ua < ub ? 1 : -1) : b.id - a.id;
  }

  // Columns marked `foldable` in config.json (Someday pile, Shipped) get a hide button. They start open;
  // hiding one is remembered per browser. (`collapsed` is the older name for the same flag.)
  const folds = {}; // this session's choice, in case localStorage is unavailable
  const isFoldable = (col) => Boolean(col.foldable || col.collapsed);

  function isFolded(col) {
    if (!isFoldable(col)) return false;
    if (col.status in folds) return folds[col.status];
    try { return localStorage.getItem(`scrawl-fold-${col.status}`) === '1'; } catch { return false; }
  }

  function setFolded(col, folded) {
    folds[col.status] = folded;
    try { localStorage.setItem(`scrawl-fold-${col.status}`, folded ? '1' : '0'); } catch { /* private window */ }
    render();
  }

  // Statuses with no column (proposed, wontfix) still exist; say so instead of hiding them silently.
  function renderHidden() {
    const shown = new Set(store.config.columns.map((c) => c.status));
    const hidden = store.list().filter((i) => !shown.has(i.meta.status));
    const note = document.getElementById('hidden-note');
    note.textContent = hidden.length ? `+${hidden.length} not on the board (proposed / wontfix). Proposals wait in the Plan view.` : '';
  }

  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cards changed outside the board (Claude, git, an editor) glow briefly where they now sit.
  function flash(files) {
    if (reducedMotion()) return;
    for (const file of files) {
      const node = document.querySelector(`.card[data-file="${CSS.escape(file)}"]`);
      if (!node) continue;
      node.classList.remove('just-changed');
      void node.offsetWidth; // restart the animation if it is still running
      node.classList.add('just-changed');
      node.addEventListener('animationend', () => node.classList.remove('just-changed'), { once: true });
    }
  }

  // A card that has just become Shipped gets a small burst of confetti (from the column header if
  // Shipped is folded). Statuses from the previous render tell us what changed.
  let lastStatus = null; // file -> status
  function noticeShipped() {
    const now = new Map(store.list().map((i) => [i.file, i.meta.status]));
    const shipped = lastStatus ? [...now].filter(([f, st]) => st === 'done' && lastStatus.has(f) && lastStatus.get(f) !== 'done') : [];
    lastStatus = now;
    shipped.slice(0, 3).forEach(([f]) => celebrate(f));
  }

  function celebrate(file) {
    if (reducedMotion()) return;
    const node = document.querySelector(`.card[data-file="${CSS.escape(file)}"]`) || document.querySelector('.col-done > header');
    if (!node) return;
    const r = node.getBoundingClientRect();
    const css = getComputedStyle(document.documentElement);
    const colors = ['--c-feature', '--c-story', '--c-bug', '--c-idea', '--accent'].map((v) => css.getPropertyValue(v).trim());
    for (let i = 0; i < 18; i++) {
      const bit = el('span', { class: 'confetti', style: `left:${r.left + r.width / 2}px;top:${r.top + 16}px;background:${colors[i % colors.length]}` });
      document.body.append(bit);
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.35;
      const dist = 38 + Math.random() * 46;
      const ms = 850 + Math.random() * 350;
      setTimeout(() => bit.remove(), ms + 50);
      bit.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist + 26}px)) rotate(${200 + Math.random() * 300}deg)`, opacity: 0 },
      ], { duration: ms, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' });
    }
  }

  function pointerOf(evt) {
    const e = evt.originalEvent;
    const p = e && e.changedTouches ? e.changedTouches[0] : e;
    return p && typeof p.clientX === 'number' ? { x: p.clientX, y: p.clientY } : null;
  }

  // Animate a freshly rendered card from where it was let go to where it now sits.
  function flyHome(file, from) {
    const node = document.querySelector(`.card[data-file="${CSS.escape(file)}"]`);
    if (!node || !from || reducedMotion()) return;
    const r = node.getBoundingClientRect();
    const dx = from.x - (r.left + r.width / 2);
    const dy = from.y - (r.top + r.height / 2);
    node.animate([
      { translate: `${dx}px ${dy}px`, rotate: '3deg', scale: '1.04' },
      { translate: '0 0', rotate: '0deg', scale: '1' },
    ], { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' });
  }

  // A little squash as the card lands.
  function land(file) {
    const node = document.querySelector(`.card[data-file="${CSS.escape(file)}"]`);
    if (!node || reducedMotion()) return;
    node.animate([{ scale: '1.04 0.94' }, { scale: '0.98 1.03' }, { scale: '1' }], { duration: 220, easing: 'ease-out' });
  }

  async function onDrop(evt) {
    dragging = false;
    document.body.classList.remove('dragging');
    const file = evt.item.dataset.file;
    const at = pointerOf(evt);
    // Let go outside every column: nothing is saved and the card flies back to where it came from.
    const target = at && document.elementFromPoint(at.x, at.y);
    if (at && !(target && target.closest('.column'))) {
      pending = false;
      render();
      flyHome(file, at);
      return;
    }
    let saved = false;
    try {
      if (evt.from === evt.to && evt.oldIndex === evt.newIndex) return;
      saved = true;
      await place(file, evt.to);
    } catch (e) {
      console.error(e);
      S.util.toast(`Couldn't save the move: ${e.message}`, 'warn');
    } finally {
      pending = false;
      render();
      if (saved) land(file);
    }
  }

  // Save a card's new column and rank from where it now sits in `list` (a column's .cards element).
  async function place(file, list) {
    const status = list.dataset.status;
    const files = [...list.children].map((n) => n.dataset.file);
    const idx = files.indexOf(file);
    const rankOf = (f) => (f && store.get(f) ? store.get(f).meta.rank : undefined);
    const prev = rankOf(files[idx - 1]);
    const next = rankOf(files[idx + 1]);
    const label = store.config.columns.find((c) => c.status === status).label;
    const moved = store.get(files[idx]);
    const activity = moved.meta.status !== status ? `Moved to ${status} (${label})` : undefined;

    const neighboursOk = (idx === 0 || prev) && (idx === files.length - 1 || next) && (!prev || !next || prev < next);
    if (neighboursOk) {
      const rank = S.rank.between(prev || '', next || null);
      await store.update(files[idx], (d) => { d.meta.status = status; d.meta.rank = rank; }, { activity });
    } else {
      // Neighbours have no usable rank (e.g. Claude created them): re-rank the whole column once.
      const keys = S.rank.spread(files.length);
      for (let i = 0; i < files.length; i++) {
        await store.update(files[i], (d) => {
          d.meta.status = status;
          d.meta.rank = keys[i];
        }, i === idx ? { activity } : {});
      }
    }
  }

  /* Keyboard moves: Space picks up the focused card, arrows carry it (left/right between columns,
     up/down within one), Space or Enter drops it, Esc puts it back. Rendering waits meanwhile. */
  let carrying = null; // { file, from: list, index }

  const cardEl = (file) => document.querySelector(`.card[data-file="${CSS.escape(file)}"]`);
  const lists = () => [...document.querySelectorAll('#board .cards')];

  function announce(text) {
    const live = document.getElementById('board-live');
    if (live) live.textContent = text;
  }

  function describe(node) {
    const list = node.parentElement;
    const label = store.config.columns.find((c) => c.status === list.dataset.status).label;
    return `${label}, position ${[...list.children].indexOf(node) + 1} of ${list.children.length}`;
  }

  function pickUp(node) {
    carrying = { file: node.dataset.file, from: node.parentElement, index: [...node.parentElement.children].indexOf(node) };
    dragging = true;
    node.classList.add('carrying');
    announce(`Picked up #${store.get(carrying.file).id}. ${describe(node)}. Arrows move it, Space drops, Escape cancels.`);
  }

  function carry(node, key) {
    const list = node.parentElement;
    const at = [...list.children].indexOf(node);
    if (key === 'ArrowUp' && at > 0) list.insertBefore(node, list.children[at - 1]);
    else if (key === 'ArrowDown' && at < list.children.length - 1) list.insertBefore(node, list.children[at + 2] || null);
    else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const all = lists();
      const to = all[all.indexOf(list) + (key === 'ArrowLeft' ? -1 : 1)];
      if (!to) return;
      to.insertBefore(node, to.children[Math.min(at, to.children.length)] || null);
    } else return;
    node.focus();
    node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    announce(describe(node));
  }

  async function drop(node) {
    const { file, from, index } = carrying;
    const moved = node.parentElement !== from || [...from.children].indexOf(node) !== index;
    carrying = null;
    dragging = false;
    node.classList.remove('carrying');
    try {
      if (moved) await place(file, node.parentElement);
      announce(moved ? `Dropped. ${describe(node)}.` : 'Dropped in the same place.');
    } catch (e) {
      console.error(e);
      S.util.toast(`Couldn't save the move: ${e.message}`, 'warn');
    } finally {
      pending = false;
      render();
      cardEl(file)?.focus();
      if (moved) land(file);
    }
  }

  function cancel() {
    if (!carrying) return;
    const { file } = carrying;
    carrying = null;
    dragging = false;
    pending = false;
    render();
    cardEl(file)?.focus();
    announce('Move cancelled.');
  }

  function onCardKey(e, item) {
    const node = e.currentTarget;
    if (carrying && carrying.file === item.file) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); drop(node); } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      } else if (e.key.startsWith('Arrow')) { e.preventDefault(); carry(node, e.key); }
      return;
    }
    if (e.key === 'Enter') S.drawer.open(item.file);
    else if (e.key === ' ' && !carrying && !store.state.readOnly) { e.preventDefault(); pickUp(node); }
  }

  // A click anywhere puts a carried card back.
  document.addEventListener('pointerdown', () => { if (carrying) cancel(); }, true);

  function bindToolbar() {
    const form = document.getElementById('quick-add');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.elements.title;
      const raw = input.value.trim();
      if (!raw) return;
      // "bug: crash on empty form" -> type bug. Default is story.
      const m = raw.match(/^(feature|story|bug|idea)\s*:\s*(.+)$/i);
      const type = m ? m[1].toLowerCase() : 'story';
      const title = m ? m[2] : raw;
      input.value = '';
      const item = await store.create({ type, title });
      if (item) S.util.toast(`Added #${item.id} to the Someday pile`);
    });
    document.getElementById('filter-text').addEventListener('input', (e) => { filters.text = e.target.value.trim(); render(); });
    document.getElementById('filter-who').addEventListener('change', (e) => { filters.who = e.target.value; render(); });
  }

  S.board = { render, bindToolbar, flash, TYPE_ICON, SEVERITY_ICON, WHO_ICON };
})();
