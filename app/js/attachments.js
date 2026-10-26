/* Attachments: files attached to (or dropped on) an item's description. They are saved in
   .scrawl/attachments/<id>/ and linked from the Description, so Claude finds them when it reads the item. */
(function () {
  const S = window.Scrawl;

  const DIR = '.scrawl/attachments';
  const MAX_MB = 20; // the board branch is a git repo; keep it lean

  const folder = (id) => `${DIR}/${id}`;
  // Item files live in .scrawl/items/, so their Markdown links are relative to that folder.
  const linkTo = (id, name) => `../attachments/${id}/${encodeURIComponent(name)}`;
  const ATTACHMENT_LINK = /^(?:\.\.\/)?(?:\.scrawl\/)?attachments\/(\d+)\/([^?#]+)$/;

  function safeName(name) {
    const clean = String(name).normalize('NFKC').replace(/[\\/:*?"<>|\x00-\x1f]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 100);
    return clean || 'file';
  }

  async function list(id) {
    const files = await S.fs.list(S.store.state.root, folder(id));
    return Promise.all(files.map(async (f) => ({ name: f.name, file: await f.handle.getFile() })));
  }

  // Saves the files next to the item and returns one Markdown line per file (images embedded).
  async function add(id, files) {
    const root = S.store.state.root;
    const taken = new Set((await S.fs.list(root, folder(id))).map((f) => f.name));
    const lines = [];
    for (const file of files) {
      if (file.size > MAX_MB * 1024 * 1024) {
        S.util.toast(`${file.name} is over ${MAX_MB} MB, so it wasn't attached`, 'warn');
        continue;
      }
      let name = safeName(file.name);
      const dot = name.lastIndexOf('.');
      const base = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : '';
      for (let n = 2; taken.has(name); n++) name = `${base}-${n}${ext}`;
      taken.add(name);
      await S.fs.write(root, `${folder(id)}/${name}`, file);
      lines.push(`${file.type.startsWith('image/') ? '!' : ''}[${name}](${linkTo(id, name)})`);
    }
    return lines;
  }

  // The page can't load "../attachments/…" by itself, so rendered links and images get blob URLs.
  let urls = [];
  function release() {
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
  }

  function urlFor(file) {
    const u = URL.createObjectURL(file);
    urls.push(u);
    return u;
  }

  async function hydrate(container) {
    const root = S.store.state.root;
    for (const node of container.querySelectorAll('img[src], a[href]')) {
      const attr = node.tagName === 'IMG' ? 'src' : 'href';
      const m = (node.getAttribute(attr) || '').match(ATTACHMENT_LINK);
      if (!m) continue;
      const file = await S.fs.file(root, `${folder(m[1])}/${decodeURIComponent(m[2])}`);
      if (!file) {
        node.classList.add('attachment-missing');
        node.title = 'This attachment is missing from .scrawl/attachments/';
        continue;
      }
      node.setAttribute(attr, urlFor(file));
      if (attr === 'href') { node.target = '_blank'; node.rel = 'noopener'; }
    }
  }

  // Only the description box takes drops. Anywhere else, a dropped file would make the browser
  // leave the board to show it, so swallow those.
  const hasFiles = (e) => [...(e.dataTransfer?.types || [])].includes('Files');
  window.addEventListener('dragover', (e) => {
    if (!hasFiles(e) || e.target.closest?.('.desc-drop')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'none';
  });
  window.addEventListener('drop', (e) => {
    if (hasFiles(e) && !e.target.closest?.('.desc-drop')) e.preventDefault();
  });

  S.attachments = { add, list, hydrate, release, urlFor, hasFiles, MAX_MB };
})();
