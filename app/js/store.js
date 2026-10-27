/* In-memory view of .scrawl/. Every change is written straight to disk; files always win. */
(function () {
  const S = window.Scrawl;
  const { parser, fs, util } = S;

  const DIR = '.scrawl';
  const ITEMS = `${DIR}/items`;
  const CONFIG = `${DIR}/config.json`;
  const PROJECT = `${DIR}/project.md`;
  const COMMITS_TXT = `${DIR}/log/commits.txt`;
  const COMMITS_JSONL = `${DIR}/log/commits.jsonl`;
  const MAIN = `${DIR}/log/main.txt`; // short shas reachable from main, written by the git hooks
  const RELEASES = `${DIR}/releases`;

  const STATUSES = ['proposed', 'backlog', 'ready', 'doing', 'review', 'resolved', 'done', 'wontfix'];
  const TYPES = ['feature', 'story', 'bug', 'idea'];
  const SEVERITIES = ['ant', 'beetle', 'cockroach', 'kraken'];

  const DEFAULT_CONFIG = {
    version: 1,
    nextId: 1,
    columns: [
      { status: 'backlog', label: 'Someday pile', foldable: true },
      { status: 'ready', label: "Claude's tray", wip: 5 },
      { status: 'doing', label: 'On the bench', wip: 2 },
      { status: 'review', label: 'Eyeball it' },
      { status: 'resolved', label: 'Resolved' },
      { status: 'done', label: 'Shipped!', foldable: true, sort: 'recent' },
    ],
  };

  const state = {
    root: null,
    config: null,
    project: '',
    projectEmpty: false,
    items: new Map(), // file name -> item
    commits: [],
    main: [], // commits on main, newest first: { sha, refs }
    releases: [], // .scrawl/releases/v*.md, newest version first: { file, version, text }
    releasesSeen: '',
    known: new Map(), // path -> lastModified we last saw or wrote
    readOnly: false, // Firefox/Safari: nothing may be written
    lastIndex: '',
  };
  const listeners = new Set();

  // In read-only mode every change is refused with a short note instead.
  function refused() {
    if (!state.readOnly) return false;
    util.toast('Read-only here: open scrawl.html in Chrome or Edge to make changes', 'warn');
    return true;
  }

  function on(fn) { listeners.add(fn); }
  function emit(change) { for (const fn of listeners) fn(change); }

  /* ---------- loading ---------- */

  function ingest(file, text, mtime) {
    const doc = parser.parse(text);
    let id = doc.meta.id;
    if (typeof id !== 'number') id = parseInt(file, 10) || 0;
    const item = { id, file, ...doc, mtime };
    for (const other of state.items.values()) {
      if (other.id === id && other.file !== file) item.errors.push(`duplicate id #${id} (also ${other.file})`);
    }
    state.items.set(file, item);
    state.known.set(`${ITEMS}/${file}`, mtime);
    return item;
  }

  async function loadConfig() {
    const f = await fs.read(state.root, CONFIG);
    state.known.set(CONFIG, f ? f.mtime : null);
    if (!f) return false;
    try {
      state.config = { ...DEFAULT_CONFIG, ...JSON.parse(f.text) };
    } catch {
      state.config = state.config || { ...DEFAULT_CONFIG };
      util.toast('config.json is smudged (bad JSON) - using defaults', 'warn');
    }
    return true;
  }

  async function loadProject() {
    const f = await fs.read(state.root, PROJECT);
    const text = f ? f.text : '';
    const h = text.match(/^#\s+(.+)$/m);
    state.project = h ? h[1].trim() : state.root.name;
    // Nothing but headings (what `init` writes) means the project wizard hasn't been filled in yet.
    state.projectEmpty = !text.split('\n').some((l) => l.trim() && !l.trim().startsWith('#'));
  }

  async function saveProject(text) {
    if (refused()) return;
    await fs.write(state.root, PROJECT, text);
    await loadProject();
  }

  /* Which items a commit belongs to. Only a leading "#18" counts, because GitHub appends the PR
     number to squash titles ("#18 Add wizard (#12)"). Merge commits name the branch instead:
     "Merge pull request #12 from me/scrawl/18-add-wizard" or "Merge branch 'scrawl/18-add-wizard'". */
  function refsOf(subject = '') {
    const merge = subject.match(/^Merge (?:pull request #\d+ from |branch ')\S*?scrawl\/(\d+)-/);
    if (merge) return [Number(merge[1])];
    if (/^Merge /.test(subject)) return [];
    const lead = subject.match(/^(?:#\d+[\s,]*)+/);
    return lead ? [...lead[0].matchAll(/#(\d+)/g)].map((m) => Number(m[1])) : [];
  }

  async function loadCommits() {
    const out = [];
    const txt = await fs.read(state.root, COMMITS_TXT);
    state.known.set(COMMITS_TXT, txt ? txt.mtime : null);
    for (const line of (txt ? txt.text : '').split('\n')) {
      if (!line.trim()) continue;
      // Subject may itself contain "|", so only the first three separators count.
      const [sha, date, author, ...rest] = line.split('|');
      out.push({ sha, date, author, subject: rest.join('|') });
    }
    const jl = await fs.read(state.root, COMMITS_JSONL);
    state.known.set(COMMITS_JSONL, jl ? jl.mtime : null);
    for (const line of (jl ? jl.text : '').split('\n')) {
      try { if (line.trim()) out.push(JSON.parse(line)); } catch { /* skip bad line */ }
    }
    const seen = new Set();
    state.commits = out.filter((c) => c.sha && !seen.has(c.sha) && seen.add(c.sha)).map((c) => ({
      ...c,
      refs: c.items || refsOf(c.subject),
    }));
  }

  async function loadMain() {
    const f = await fs.read(state.root, MAIN);
    state.known.set(MAIN, f ? f.mtime : null);
    // "sha|subject" per line, newest first (older hooks wrote the sha alone).
    state.main = (f ? f.text : '').split('\n').filter((l) => l.trim()).map((l) => {
      const [sha, ...rest] = l.trim().split('|');
      return { sha: sha.slice(0, 7), refs: refsOf(rest.join('|')) };
    });
  }

  // Version numbers compare part by part, so v0.10.0 is newer than v0.9.0.
  function compareVersions(a, b) {
    const pa = a.split(/[.-]/);
    const pb = b.split(/[.-]/);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const x = pa[i] || '0';
      const y = pb[i] || '0';
      const d = /^\d+$/.test(x) && /^\d+$/.test(y) ? Number(x) - Number(y) : x.localeCompare(y);
      if (d) return d;
    }
    return 0;
  }

  // Cheap to call every poll: only the listing is compared, files are read when it changes.
  async function loadReleases() {
    const files = (await fs.list(state.root, RELEASES)).filter((f) => /^v.+\.md$/.test(f.name));
    const stamps = await Promise.all(files.map(async (f) => `${f.name}@${(await f.handle.getFile()).lastModified}`));
    const seen = stamps.sort().join('|');
    if (seen === state.releasesSeen) return false;
    state.releasesSeen = seen;
    state.releases = (await Promise.all(files.map(async (f) => ({
      file: f.name,
      version: f.name.slice(1, -3),
      text: await (await f.handle.getFile()).text(),
    })))).sort((a, b) => compareVersions(b.version, a.version));
    return true;
  }

  async function loadItems() {
    state.items.clear();
    for (const { name, handle } of await fs.list(state.root, ITEMS)) {
      if (!name.endsWith('.md')) continue;
      const f = await handle.getFile();
      ingest(name, await f.text(), f.lastModified);
    }
  }

  // Returns false when the folder has no .scrawl/ yet.
  async function open(root) {
    state.root = root;
    state.known.clear();
    state.releasesSeen = '';
    if (!(await loadConfig())) return false;
    await Promise.all([loadProject(), loadItems(), loadCommits(), loadMain(), loadReleases()]);
    await writeIndex();
    await autoShip();
    return true;
  }

  async function init(root) {
    state.root = root;
    const name = root.name;
    await fs.write(root, CONFIG, JSON.stringify(DEFAULT_CONFIG, null, 2) + '\n');
    await fs.write(root, PROJECT,
      `# ${name}\n\n## Goal\n\n## For whom\n\n## Stack\n\n## Must-haves\n\n## Out of scope\n`);
    await fs.dir(root, ITEMS, true);
    await fs.append(root, `${DIR}/log/activity.jsonl`, '');
    return open(root);
  }

  /* ---------- polling for outside changes (Claude, git, your editor) ---------- */

  async function poll() {
    const changed = [];
    const seen = new Set();
    for (const { name, handle } of await fs.list(state.root, ITEMS)) {
      if (!name.endsWith('.md')) continue;
      seen.add(name);
      let f;
      try {
        f = await handle.getFile();
      } catch (e) {
        // Listed but gone a moment later: the browser (or git) is still swapping the file into place.
        // Keep what we have; the next refresh reads it.
        if (e.name === 'NotFoundError') continue;
        throw e;
      }
      if (state.known.get(`${ITEMS}/${name}`) !== f.lastModified) {
        ingest(name, await f.text(), f.lastModified);
        changed.push(name);
      }
    }
    for (const name of [...state.items.keys()]) {
      if (!seen.has(name)) {
        state.items.delete(name);
        state.known.delete(`${ITEMS}/${name}`);
        changed.push(name);
      }
    }
    if ((await fs.mtime(state.root, CONFIG)) !== state.known.get(CONFIG)) await loadConfig();
    const commitsMoved = (await fs.mtime(state.root, COMMITS_TXT)) !== state.known.get(COMMITS_TXT)
      || (await fs.mtime(state.root, COMMITS_JSONL)) !== state.known.get(COMMITS_JSONL);
    if (commitsMoved) await loadCommits();
    const mainMoved = (await fs.mtime(state.root, MAIN)) !== state.known.get(MAIN);
    if (mainMoved) await loadMain();
    const releasesMoved = await loadReleases();

    if (changed.length || commitsMoved || mainMoved || releasesMoved) {
      if (changed.length) await writeIndex();
      emit({ outside: changed, commits: commitsMoved });
      await autoShip();
    }
  }

  /* ---------- writing ---------- */

  // index.json is a cache for cheap overviews (one line per item). Rewritten only when it differs.
  async function writeIndex() {
    if (state.readOnly) return;
    const rows = list().sort((a, b) => a.id - b.id).map((i) => {
      const m = i.meta;
      const row = { id: i.id, type: m.type, title: m.title, status: m.status };
      if (m.parent) row.parent = m.parent;
      if (m.assignee) row.assignee = m.assignee;
      if (m.rank) row.rank = m.rank;
      return row;
    });
    const text = `[\n${rows.map((r) => '  ' + JSON.stringify(r)).join(',\n')}\n]\n`;
    if (text === state.lastIndex) return;
    state.lastIndex = text;
    await fs.write(state.root, `${DIR}/index.json`, text);
  }

  async function log(entry) {
    const line = JSON.stringify({ at: util.stamp(), who: 'me', ...entry });
    try { await fs.append(state.root, `${DIR}/log/activity.jsonl`, line + '\n'); } catch { /* log is best-effort */ }
  }

  /* Apply `mutate` to the latest copy on disk, not our cached one. That is the field-level merge:
     whatever Claude changed meanwhile survives, and only the fields we touch are overwritten. */
  async function update(file, mutate, { activity, who = 'me' } = {}) {
    if (refused()) return undefined;
    const path = `${ITEMS}/${file}`;
    const disk = await fs.read(state.root, path);
    if (!disk) {
      util.toast(`${file} is gone from disk`, 'warn');
      return;
    }
    const outside = disk.mtime !== state.known.get(path);
    const doc = parser.parse(disk.text);
    const before = { ...doc.meta };
    mutate(doc);
    // Reopened: whatever is on main by now was already shipped, so only later commits can ship it again.
    if (before.status === 'done' && doc.meta.status !== 'done' && mainHead()) doc.meta.shipped = mainHead();
    doc.meta.updated = util.stamp();
    if (activity) doc.body = parser.appendActivity(doc.body, who, activity);
    const text = parser.serialize(doc);
    const mtime = await fs.write(state.root, path, text);
    const item = ingest(file, text, mtime);

    if (before.status !== doc.meta.status) log({ id: item.id, action: 'move', from: before.status, to: doc.meta.status, who });
    if (outside) util.toast(`✎ Claude was here - merged with the latest #${item.id}`);
    await writeIndex();
    emit({ local: [file] });
    if (SHIPPABLE.has(doc.meta.status)) await autoShip();
    return item;
  }

  /* Review/Resolved -> Shipped once the item's work is on main: a commit on main names the item
     (squash, rebase or merge commit), or one of its own commits got there. The browser can't run
     git, so this relies on .scrawl/log/main.txt from the hooks and scrawl-sync.
     `shipped:` remembers the main commit an item shipped (or was reopened) at; only newer commits can ship it again. */
  const SHIPPABLE = new Set(['review', 'resolved']);

  function mainHitFor(item) {
    const own = new Set(commitsFor(item).map((c) => c.sha.slice(0, 7)));
    const since = item.meta.shipped ? state.main.findIndex((c) => c.sha === String(item.meta.shipped).slice(0, 7)) : -1;
    const newer = since >= 0 ? state.main.slice(0, since) : state.main;
    return newer.find((c) => c.refs.includes(item.id) || own.has(c.sha));
  }

  async function autoShip() {
    if (state.readOnly) return;
    if (!state.main.length) return;
    for (const item of list()) {
      if (!SHIPPABLE.has(item.meta.status)) continue;
      const hit = mainHitFor(item);
      if (!hit) continue;
      await update(item.file, (d) => { d.meta.status = 'done'; d.meta.shipped = hit.sha; },
        { activity: `Shipped: ${hit.sha} is on main`, who: 'scrawl' });
      util.toast(`🚢 #${item.id} shipped - its work is on main`);
    }
  }

  // Newest commit on main, so a hand-shipped item also ignores older commits if it's reopened.
  function mainHead() { return state.main.length ? state.main[0].sha : undefined; }

  // Takes the next free item number and records it in config.json.
  async function takeId() {
    await loadConfig(); // Claude may have bumped nextId since we last looked
    const maxId = Math.max(0, ...list().map((i) => i.id));
    const id = Math.max(Number(state.config.nextId) || 1, maxId + 1);
    state.config.nextId = id + 1;
    state.known.set(CONFIG, await fs.write(state.root, CONFIG, JSON.stringify(state.config, null, 2) + '\n'));
    return id;
  }

  async function create({ type = 'story', title, status = 'backlog', assignee = 'me', description = '', severity = 'beetle' }) {
    if (refused()) return null;
    const id = await takeId();

    const last = column(status).at(-1);
    const now = util.stamp();
    const meta = { id, type, title: title.trim(), status, assignee, rank: S.rank.between(last && last.meta.rank, null) };
    if (type === 'bug') meta.severity = severity;
    Object.assign(meta, { labels: [], created: now, updated: now });

    const doc = { meta, keys: [], extra: [], body: parser.appendActivity(parser.newBody(description), 'me', 'Created') };
    const file = `${String(id).padStart(4, '0')}-${type}-${util.slugify(title)}.md`;
    const text = parser.serialize(doc);
    const mtime = await fs.write(state.root, `${ITEMS}/${file}`, text);
    const item = ingest(file, text, mtime);
    log({ id, action: 'create', to: status });
    await writeIndex();
    emit({ local: [file] });
    return item;
  }

  /* Rewrite a smudged item's header cleanly. Every field that parses is kept; a missing id, type, title
     or status comes from the file name (or a default), and nothing that is there is changed; unreadable header lines are moved into the
     Description so nothing is lost; an id that another item already uses gets a new number (and the
     file is renamed to match). Returns the repaired item. */
  async function repair(file) {
    if (refused()) return null;
    const path = `${ITEMS}/${file}`;
    const disk = await fs.read(state.root, path);
    if (!disk) {
      util.toast(`${file} is gone from disk`, 'warn');
      return null;
    }
    const doc = parser.parse(disk.text);
    const m = doc.meta;
    const name = file.match(/^(\d+)?-?(feature|story|bug|idea)?-?(.*?)\.md$/i) || [];
    if (!m.type) m.type = TYPES.includes((name[2] || '').toLowerCase()) ? name[2].toLowerCase() : 'story';
    if (!m.title) m.title = (name[3] || '').replace(/[-_]+/g, ' ').trim().replace(/^./, (c) => c.toUpperCase()) || 'Untitled';
    if (!m.status) m.status = 'backlog';
    if (typeof m.id !== 'number' && name[1]) m.id = Number(name[1]);
    const taken = list().some((i) => i.id === m.id && i.file !== file);
    const renumber = typeof m.id !== 'number' || taken;
    if (renumber) m.id = await takeId();
    if (doc.extra.length) {
      const desc = parser.getSection(doc.body, 'Description').trim();
      const kept = `Recovered from the old header:\n\n\`\`\`\n${doc.extra.join('\n')}\n\`\`\``;
      doc.body = parser.setSection(doc.body, 'Description', [desc, kept].filter(Boolean).join('\n\n'));
      doc.extra = [];
    }
    m.updated = util.stamp();
    doc.body = parser.appendActivity(doc.body, 'me', renumber ? `Fixed the smudged header (new number #${m.id})` : 'Fixed the smudged header');

    const target = renumber ? `${String(m.id).padStart(4, '0')}-${m.type}-${util.slugify(m.title)}.md` : file;
    const text = parser.serialize(doc);
    const mtime = await fs.write(state.root, `${ITEMS}/${target}`, text);
    if (target !== file) {
      await fs.remove(state.root, path);
      state.items.delete(file);
      state.known.delete(path);
    }
    const item = ingest(target, text, mtime);
    log({ id: item.id, action: 'repair' });
    await writeIndex();
    emit({ local: [target] });
    return item;
  }

  /* ---------- queries ---------- */

  function list() { return [...state.items.values()]; }
  function get(file) { return state.items.get(file); }
  function byId(id) { return list().find((i) => i.id === Number(id)); }

  function compareRank(a, b) {
    const ra = a.meta.rank || '';
    const rb = b.meta.rank || '';
    if (ra && rb && ra !== rb) return ra < rb ? -1 : 1;
    if (!ra !== !rb) return ra ? -1 : 1; // unranked items sink to the bottom
    return a.id - b.id;
  }

  function column(status) {
    return list().filter((i) => i.meta.status === status).sort(compareRank);
  }

  function commitsFor(item) {
    const pinned = new Set(Array.isArray(item.meta.commits) ? item.meta.commits : []);
    return state.commits.filter((c) => c.refs.includes(item.id) || [...pinned].some((p) => c.sha.startsWith(p) || p.startsWith(c.sha)));
  }

  S.store = {
    STATUSES, TYPES, SEVERITIES, state, on, open, init, poll, update, create, repair, saveProject,
    list, get, byId, column, compareRank, commitsFor, refsOf, mainHead,
    get config() { return state.config; },
    get project() { return state.project; },
  };
})();
