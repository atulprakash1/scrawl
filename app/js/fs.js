/* File System Access wrapper. The folder handle is kept in IndexedDB so you don't re-pick every visit. */
(function () {
  const S = window.Scrawl;
  const DB = 'scrawl';
  const STORE = 'handles';

  function idb(mode, fn) {
    return new Promise((resolve, reject) => {
      const open = indexedDB.open(DB, 1);
      open.onupgradeneeded = () => open.result.createObjectStore(STORE);
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const tx = open.result.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
      };
    });
  }

  const supported = typeof window.showDirectoryPicker === 'function';

  /* Every file:// page shares one origin, so all copies of scrawl.html share this database. The folder
     to reopen is kept per page path, so a fresh copy in a new project doesn't open another project's board. */
  const ROOT = `root:${location.pathname}`;

  async function pick() {
    const handle = await window.showDirectoryPicker({ id: 'scrawl', mode: 'readwrite' });
    try { await idb('readwrite', (s) => s.put(handle, ROOT)); } catch { /* still usable this session */ }
    return handle;
  }

  const RECENT_MAX = 6;

  async function recent() {
    try { return (await idb('readonly', (s) => s.get('recent'))) || []; } catch { return []; }
  }

  // Puts a folder at the top of the recent list (no duplicates) and makes it the one reopened next time.
  async function remember(handle) {
    try {
      const others = [];
      for (const h of await recent()) if (!(await h.isSameEntry(handle))) others.push(h);
      await idb('readwrite', (s) => s.put([handle, ...others].slice(0, RECENT_MAX), 'recent'));
      await idb('readwrite', (s) => s.put(handle, ROOT));
    } catch { /* still usable this session */ }
  }

  async function remembered() {
    try { return (await idb('readonly', (s) => s.get(ROOT))) || null; } catch { return null; }
  }

  // ask=true must run inside a user gesture (click).
  async function permission(handle, ask) {
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    return ask ? (await handle.requestPermission(opts)) === 'granted' : false;
  }

  async function dir(root, path, create = false) {
    let d = root;
    for (const part of path.split('/').filter(Boolean)) d = await d.getDirectoryHandle(part, { create });
    return d;
  }

  async function fileHandle(root, path, create = false) {
    const i = path.lastIndexOf('/');
    return (await dir(root, path.slice(0, i), create)).getFileHandle(path.slice(i + 1), { create });
  }

  const missing = (e) => e && (e.name === 'NotFoundError' || e.name === 'TypeMismatchError');

  async function read(root, path) {
    try {
      const f = await (await fileHandle(root, path)).getFile();
      return { text: await f.text(), mtime: f.lastModified };
    } catch (e) {
      if (missing(e)) return null;
      throw e;
    }
  }

  // The File itself (a Blob), or null when it isn't there.
  async function file(root, path) {
    try { return await (await fileHandle(root, path)).getFile(); } catch (e) {
      if (missing(e)) return null;
      throw e;
    }
  }

  async function mtime(root, path) {
    try { return (await (await fileHandle(root, path)).getFile()).lastModified; } catch (e) {
      if (missing(e)) return null;
      throw e;
    }
  }

  // createWritable() writes to a temp file and swaps on close(), so a crash never leaves half an item.
  async function write(root, path, text) {
    const fh = await fileHandle(root, path, true);
    const w = await fh.createWritable();
    await w.write(text);
    await w.close();
    return (await fh.getFile()).lastModified;
  }

  async function append(root, path, text) {
    const fh = await fileHandle(root, path, true);
    const size = (await fh.getFile()).size;
    const w = await fh.createWritable({ keepExistingData: true });
    await w.seek(size);
    await w.write(text);
    await w.close();
  }

  async function remove(root, path) {
    const i = path.lastIndexOf('/');
    try {
      await (await dir(root, path.slice(0, i))).removeEntry(path.slice(i + 1));
    } catch (e) {
      if (!missing(e)) throw e;
    }
  }

  async function list(root, path) {
    try {
      const d = await dir(root, path);
      const out = [];
      for await (const [name, handle] of d.entries()) if (handle.kind === 'file') out.push({ name, handle });
      return out;
    } catch (e) {
      if (missing(e)) return [];
      throw e;
    }
  }

  S.fs = { supported, pick, remembered, recent, remember, permission, dir, read, file, mtime, write, append, remove, list };
})();
