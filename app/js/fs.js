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

  async function pick() {
    const handle = await window.showDirectoryPicker({ id: 'scrawl', mode: 'readwrite' });
    try { await idb('readwrite', (s) => s.put(handle, 'root')); } catch { /* still usable this session */ }
    return handle;
  }

  async function remembered() {
    try { return (await idb('readonly', (s) => s.get('root'))) || null; } catch { return null; }
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

  S.fs = { supported, pick, remembered, permission, dir, read, mtime, write, append, list };
})();
