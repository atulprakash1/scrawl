/* Read-only mode for browsers without the File System Access API (Firefox, Safari). The repo folder is
   picked with <input webkitdirectory>, its .scrawl/ files are kept in memory behind the same interface
   as fs.js, and every write is refused. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  // entries: [{ path: 'my-repo/.scrawl/items/0001-x.md', file: File }]. Only .scrawl/ is kept.
  function fsFrom(entries) {
    const files = new Map();
    for (const { path, file } of entries) {
      const parts = path.split('/');
      const at = parts.indexOf('.scrawl');
      if (at >= 0) files.set(parts.slice(at).join('/'), file);
    }
    const refuse = async () => {
      throw new DOMException('This browser can only read the board', 'NoModificationAllowedError');
    };
    const impl = {
      supported: false,
      pick: refuse,
      remembered: async () => null,
      permission: async () => true,
      dir: async () => ({}),
      read: async (root, p) => (files.has(p) ? { text: await files.get(p).text(), mtime: files.get(p).lastModified } : null),
      file: async (root, p) => files.get(p) || null,
      mtime: async (root, p) => (files.has(p) ? files.get(p).lastModified : null),
      list: async (root, dir) => [...files]
        .filter(([k]) => k.startsWith(`${dir}/`) && !k.slice(dir.length + 1).includes('/'))
        .map(([k, f]) => ({ name: k.slice(dir.length + 1), handle: { kind: 'file', getFile: async () => f } })),
      write: refuse,
      append: refuse,
      remove: refuse,
    };
    return { count: files.size, impl };
  }

  // A folder picker that works everywhere, calling onPicked(entries).
  function button(label, onPicked) {
    const input = el('input', {
      type: 'file', webkitdirectory: true, multiple: true, hidden: true,
      onchange: (e) => onPicked([...e.target.files].map((f) => ({ path: f.webkitRelativePath || f.name, file: f }))),
    });
    return [input, el('button', { class: 'btn btn-big', onclick: () => input.click() }, label)];
  }

  S.readonly = { fsFrom, button };
})();
