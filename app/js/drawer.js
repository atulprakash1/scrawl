/* Item drawer: slides in from the right with description, acceptance, commits and the activity thread. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const { parser, store } = S;

  let current = null;
  let editingDescription = false;

  const panel = () => document.getElementById('drawer');

  function open(file) {
    current = file;
    editingDescription = false;
    render();
    panel().classList.add('open');
    panel().setAttribute('aria-hidden', 'false');
    panel().querySelector('.drawer-title')?.focus();
  }

  function close() {
    current = null;
    panel().classList.remove('open');
    panel().setAttribute('aria-hidden', 'true');
  }

  const save = (mutate, opts) => store.update(current, mutate, opts).then(render);

  function select(name, options, value, onchange) {
    return el('label', { class: 'field' }, el('span', {}, name),
      el('select', { onchange: (e) => onchange(e.target.value) },
        options.map((o) => el('option', { value: o, selected: o === value }, o))));
  }

  // Re-render on outside changes, but never under the user's fingers.
  function refresh() {
    if (!current) return;
    const active = document.activeElement;
    if (editingDescription || (active && panel().contains(active) && /INPUT|TEXTAREA/.test(active.tagName))) return;
    render();
  }

  function render() {
    S.attachments.release();
    const item = current && store.get(current);
    if (!item) { if (current) close(); return; }
    const m = item.meta;
    const id = item.id;
    const who = m.assignee || 'me';
    const statusLabel = (s) => (store.config.columns.find((c) => c.status === s) || {}).label;

    const head = el('header', { class: 'drawer-head' },
      el('span', { class: 'num' }, `#${id}`),
      el('span', { class: `type-badge type-${m.type || 'story'}` }, el('span', { 'aria-hidden': 'true' }, S.board.TYPE_ICON[m.type] || '•'), m.type || 'item'),
      el('button', { class: 'icon-btn', title: 'Close (Esc)', 'aria-label': 'Close', onclick: close }, '✕'));

    const title = el('input', {
      class: 'drawer-title', value: m.title || '', 'aria-label': 'Title',
      onchange: (e) => e.target.value.trim() && save((d) => { d.meta.title = e.target.value.trim(); }),
    });

    // Where the item sits in the plan: its feature above, its stories below.
    const parent = m.parent ? store.byId(m.parent) : null;
    const partOf = m.parent
      ? el('p', { class: 'part-of' }, 'Part of ',
        parent
          ? el('button', { class: 'link-btn', onclick: () => open(parent.file) }, `#${parent.id} ${parent.meta.title || ''}`)
          : el('span', { class: 'muted' }, `#${m.parent} (not found)`))
      : null;

    const fields = el('div', { class: 'fields' },
      select('status', store.STATUSES, m.status, (v) => save((d) => { d.meta.status = v; },
        { activity: `Moved to ${v}${statusLabel(v) ? ` (${statusLabel(v)})` : ''}` })),
      select('assignee', ['me', 'claude'], who, (v) => save((d) => { d.meta.assignee = v; })),
      select('type', store.TYPES, m.type, (v) => save((d) => { d.meta.type = v; })),
      m.type === 'bug' ? select('severity', store.SEVERITIES, m.severity, (v) => save((d) => { d.meta.severity = v; })) : null);

    const actions = el('div', { class: 'actions' },
      m.status === 'proposed'
        ? [el('button', { class: 'btn btn-ship', onclick: () => S.plan.accept(item).then(render) }, '✔ Accept proposal'),
          el('button', { class: 'btn btn-reject', onclick: () => S.plan.reject(item).then(render) }, '✗ Reject')]
        : null,
      el('button', { class: 'btn btn-claude', onclick: () => S.util.copy(`/resolve ${id}`) }, `📋 Copy /resolve ${id}`),
      who !== 'claude' || m.status !== 'ready'
        ? el('button', {
          class: 'btn',
          onclick: () => save((d) => { d.meta.status = 'ready'; d.meta.assignee = 'claude'; }, { activity: "Handed to Claude (Claude's tray)" }),
        }, '🤖 Hand to Claude')
        : null,
      m.status === 'review'
        ? el('button', {
          class: 'btn btn-ship',
          title: 'Moves to Resolved; it ships by itself once its commit is on main',
          onclick: () => save((d) => { d.meta.status = 'resolved'; }, { activity: 'Reviewed and accepted (Resolved)' }),
        }, '✔ Accept')
        : null,
      m.status === 'resolved'
        ? el('button', {
          class: 'btn',
          title: 'Mark shipped without waiting for main',
          onclick: () => save((d) => { d.meta.status = 'done'; d.meta.shipped = store.mainHead(); }, { activity: 'Shipped by hand' }),
        }, '🚢 Ship now')
        : null);

    const smudge = item.errors.length
      ? el('div', { class: 'smudge-box' }, el('strong', {}, 'Smudged: '), item.errors.join('; '),
        el('div', { class: 'muted' }, `Fix the header in .scrawl/items/${item.file}. Nothing was dropped.`))
      : null;

    const desc = parser.getSection(item.body, 'Description');

    // Attached files are saved next to the item and linked from the Description, so Claude sees them.
    // While editing, the links go into the textarea; otherwise straight into the file.
    async function attach(files) {
      if (!files.length) return;
      const lines = await S.attachments.add(id, files);
      if (!lines.length) return;
      const box = panel().querySelector('textarea[name="desc"]');
      if (editingDescription && box) {
        const at = box.selectionEnd ?? box.value.length;
        const insert = `${box.value && !box.value.slice(0, at).endsWith('\n') ? '\n' : ''}${lines.join('\n')}\n`;
        box.value = box.value.slice(0, at) + insert + box.value.slice(at);
        S.util.toast('Attached. Save the description to keep the links.');
        return;
      }
      const names = lines.map((l) => l.match(/\[(.*?)\]/)[1]).join(', ');
      await save((d) => {
        const current = parser.getSection(d.body, 'Description').trim();
        d.body = parser.setSection(d.body, 'Description', [current, ...lines].filter(Boolean).join('\n\n'));
      }, { activity: `Attached ${names}` });
    }
    // Deletes the file and takes its link out of the Description.
    async function detach(name) {
      if (!window.confirm(`Remove ${name} from #${id}? The file is deleted.`)) return;
      await S.attachments.remove(id, name);
      await save((d) => {
        d.body = parser.setSection(d.body, 'Description', S.attachments.unlink(parser.getSection(d.body, 'Description'), id, name));
      }, { activity: `Removed attachment ${name}` });
    }
    const picker = el('input', { type: 'file', multiple: true, hidden: true, onchange: (e) => attach([...e.target.files]) });
    const dropZone = (body) => el('div', {
      class: 'desc-drop',
      title: 'Drop files here to attach them',
      ondragover: (e) => {
        if (!S.attachments.hasFiles(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        e.currentTarget.classList.add('over');
      },
      ondragleave: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.classList.remove('over'); },
      ondrop: (e) => {
        if (!S.attachments.hasFiles(e)) return;
        e.preventDefault();
        e.currentTarget.classList.remove('over');
        attach([...e.dataTransfer.files]);
      },
    }, body);

    const attachedList = el('ul', { class: 'attach-list', hidden: true });
    S.attachments.list(id).then((files) => {
      if (!files.length) return;
      attachedList.replaceChildren(...files.map(({ name, file }) => el('li', {},
        el('a', { href: S.attachments.urlFor(file), target: '_blank', rel: 'noopener' }, `📎 ${name}`),
        el('span', { class: 'muted' }, ` ${file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1048576).toFixed(1)} MB`}`),
        el('button', {
          class: 'attach-remove', title: `Remove ${name}`, 'aria-label': `Remove ${name}`,
          onclick: () => detach(name),
        }, '×'))));
      attachedList.hidden = false;
    }).catch(() => {});

    const descView = el('div', { class: 'md', html: desc ? S.util.markdown(desc) : '<p class="muted">Nothing yet. Drop files here to attach them.</p>' });
    S.attachments.hydrate(descView).catch(() => {});

    const description = el('section', { class: 'drawer-section' },
      el('h4', {}, 'Description ',
        el('button', { class: 'link-btn', onclick: () => { editingDescription = !editingDescription; render(); } }, editingDescription ? 'cancel' : 'edit'),
        el('button', { class: 'link-btn', title: `Attach files (up to ${S.attachments.MAX_MB} MB each)`, onclick: () => picker.click() }, 'attach'),
        picker),
      dropZone(editingDescription
        ? el('form', {
          onsubmit: (e) => {
            e.preventDefault();
            const text = e.target.elements.desc.value;
            editingDescription = false;
            save((d) => { d.body = parser.setSection(d.body, 'Description', text); });
          },
        },
        el('textarea', { name: 'desc', rows: 8, value: desc }),
        el('button', { class: 'btn', type: 'submit' }, 'Save'))
        : descView),
      attachedList);

    const checks = parser.checklist(item.body);
    const acceptance = el('section', { class: 'drawer-section' },
      el('h4', {}, 'Acceptance'),
      el('ul', { class: 'checklist' }, checks.map((c, i) => el('li', {},
        el('label', {},
          el('input', { type: 'checkbox', checked: c.done, onchange: (e) => save((d) => { d.body = parser.toggleCheck(d.body, i, e.target.checked); }) }),
          el('span', { html: S.util.markdown(c.text).replace(/^<p>|<\/p>\s*$/g, '') }))))),
      el('form', {
        class: 'inline-form',
        onsubmit: (e) => {
          e.preventDefault();
          const text = e.target.elements.check.value.trim();
          if (text) save((d) => { d.body = parser.addCheck(d.body, text); });
        },
      }, el('input', { name: 'check', placeholder: 'Add a criterion…' }), el('button', { class: 'btn', type: 'submit' }, '+')));

    const kids = store.list().filter((i) => i.meta.parent === id && i.meta.status !== 'wontfix').sort(store.compareRank);
    const finished = kids.filter((k) => k.meta.status === 'done' || k.meta.status === 'resolved').length;
    const stories = kids.length
      ? el('section', { class: 'drawer-section' },
        el('h4', {}, 'Stories ', el('span', { class: 'muted kids-count' }, `${finished}/${kids.length} done`)),
        el('ul', { class: 'kids' }, kids.map((k) => el('li', {},
          el('button', { class: 'link-btn', onclick: () => open(k.file) }, `#${k.id} ${k.meta.title || '(untitled)'}`),
          ' ', el('span', { class: `pill pill-${k.meta.status}` }, statusLabel(k.meta.status) || k.meta.status)))))
      : null;

    const commitList = store.commitsFor(item);
    const commits = commitList.length
      ? el('section', { class: 'drawer-section' }, el('h4', {}, 'Commits'),
        el('ul', { class: 'commits-list' }, commitList.map((c) => el('li', {},
          el('code', {}, c.sha), ' ', c.subject, el('span', { class: 'muted' }, ` · ${c.author} · ${(c.date || '').slice(0, 16).replace('T', ' ')}`)))))
      : null;

    const thread = parser.activity(item.body);
    const activity = el('section', { class: 'drawer-section' },
      el('h4', {}, 'Activity'),
      el('ol', { class: 'activity' }, thread.map((a) => el('li', { class: `who-${a.who}` },
        el('span', { class: 'who-icon', 'aria-hidden': 'true' }, S.board.WHO_ICON[a.who] || '•'),
        el('span', { class: 'muted' }, `${a.at} · ${a.who}`), el('div', { html: S.util.markdown(a.text) })))),
      el('form', {
        class: 'comment-form',
        onsubmit: (e) => {
          e.preventDefault();
          const text = e.target.elements.comment.value.trim();
          if (!text) return;
          e.target.elements.comment.value = '';
          save(() => {}, { activity: text });
        },
      },
      el('textarea', { name: 'comment', rows: 2, placeholder: 'Comment… (mention @claude to ask Claude)' }),
      el('button', { class: 'btn', type: 'submit' }, 'Comment')));

    const footer = el('p', { class: 'muted file-path' }, `.scrawl/items/${item.file}`);

    panel().replaceChildren(el('div', { class: 'drawer-inner' }, head, title, partOf, fields, actions, smudge, description, acceptance, stories, commits, activity, footer));
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current) close(); });

  S.drawer = { open, close, refresh };
})();
