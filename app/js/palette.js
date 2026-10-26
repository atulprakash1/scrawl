/* Command palette (Ctrl+K / Cmd+K): find an item by number or title, switch views, copy a Claude
   command, or add an item, without the mouse. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  const VIEWS = [['board', 'Board'], ['plan', 'Plan'], ['bugs', 'Bug jar'], ['today', 'Today'], ['timeline', 'Timeline'], ['releases', 'Releases']];
  const LIMIT = 8;

  let selected = 0;
  let entries = [];

  const dialog = () => document.getElementById('palette');

  // Items whose number or title matches every word typed, best matches first.
  function findItems(q) {
    const words = q.toLowerCase().replace(/#/g, ' ').split(/\s+/).filter(Boolean);
    const num = q.match(/^#?(\d+)$/);
    return S.store.list()
      .map((i) => {
        const hay = `${i.id} ${i.meta.title || ''} ${i.meta.type || ''}`.toLowerCase();
        if (!words.every((w) => hay.includes(w))) return null;
        const score = (num && i.id === Number(num[1]) ? 0 : 2) + (['done', 'wontfix'].includes(i.meta.status) ? 1 : 0);
        return { i, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score || b.i.id - a.i.id)
      .slice(0, LIMIT)
      .map((x) => x.i);
  }

  function build(q) {
    const out = [];
    const items = q ? findItems(q) : [];
    for (const i of items) {
      out.push({ kind: 'item', icon: S.board.TYPE_ICON[i.meta.type] || '•', label: `#${i.id} ${i.meta.title || '(untitled)'}`, hint: i.meta.status, run: () => S.drawer.open(i.file) });
    }
    if (items[0]) {
      const id = items[0].id;
      out.push({ kind: 'cmd', icon: '📋', label: `Copy /resolve ${id}`, hint: 'Claude', run: () => S.util.copy(`/resolve ${id}`) });
    }
    const ql = q.toLowerCase();
    for (const [view, name] of VIEWS) {
      if (!q || name.toLowerCase().includes(ql) || 'go view open'.includes(ql)) {
        out.push({ kind: 'view', icon: '→', label: `Go to ${name}`, hint: 'view', run: () => S.app.setView(view) });
      }
    }
    if (!q || '/next copy claude'.includes(ql)) out.push({ kind: 'cmd', icon: '📋', label: 'Copy /next', hint: 'Claude', run: () => S.util.copy('/next') });
    // "bug: …" (or story/feature/idea) picks the type; otherwise offer a story and a bug.
    const typed = q.match(/^(story|bug|feature|idea)\s*:\s*/i);
    const title = q.slice(typed ? typed[0].length : 0).trim();
    if (title && !/^#?\d+$/.test(q)) {
      for (const type of typed ? [typed[1].toLowerCase()] : ['story', 'bug']) {
        out.push({
          kind: 'add', icon: '+', label: `Add ${type}: ${title}`, hint: 'Someday pile',
          run: async () => S.util.toast(`Added #${(await S.store.create({ type, title })).id} to the Someday pile`),
        });
      }
    }
    return out;
  }

  function paint() {
    const list = dialog().querySelector('.palette-list');
    list.replaceChildren(...entries.map((e, n) => el('li', {
      class: `palette-entry palette-${e.kind}${n === selected ? ' selected' : ''}`,
      role: 'option',
      'aria-selected': String(n === selected),
      onmousemove: () => { if (selected !== n) { selected = n; paint(); } },
      onclick: () => choose(n),
    }, el('span', { class: 'palette-icon', 'aria-hidden': 'true' }, e.icon), el('span', { class: 'palette-label' }, e.label), el('span', { class: 'palette-hint' }, e.hint))));
    if (!entries.length) list.append(el('li', { class: 'palette-empty muted' }, 'Nothing matches.'));
    list.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
  }

  function update(q) {
    entries = build(q.trim());
    selected = 0;
    paint();
  }

  function choose(n) {
    const e = entries[n];
    if (!e) return;
    close();
    e.run();
  }

  function open() {
    if (!S.store.state.root || document.getElementById('app').hidden) return;
    const box = dialog();
    const input = el('input', {
      class: 'palette-input', type: 'text', placeholder: 'Type #42, a title, a view, or something to add…', 'aria-label': 'Command palette',
      oninput: (e) => update(e.target.value),
      onkeydown: (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (entries.length) selected = (selected + (e.key === 'ArrowDown' ? 1 : entries.length - 1)) % entries.length;
          paint();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          choose(selected);
        }
      },
    });
    box.replaceChildren(el('div', { class: 'palette' }, input, el('ul', { class: 'palette-list', role: 'listbox' }),
      el('p', { class: 'palette-foot muted' }, '↑↓ to choose · Enter to run · Esc to close')));
    update('');
    if (!box.open) box.showModal();
    input.focus();
  }

  function close() {
    if (dialog().open) dialog().close();
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog().open) close();
      else open();
    }
  });

  S.palette = { open, close, build };
})();
