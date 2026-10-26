/* Shared helpers. Classic scripts (file:// blocks modules), so everything hangs off window.Scrawl. */
(function () {
  const S = (window.Scrawl = window.Scrawl || {});

  function el(tag, attrs, ...kids) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'dataset') Object.assign(node.dataset, v);
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'value') node.value = v;
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      node.append(kid instanceof Node ? kid : String(kid));
    }
    return node;
  }

  const pad = (n, w = 2) => String(n).padStart(w, '0');

  // Local time, minute precision: 2026-10-25T10:12
  function stamp(d = new Date()) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function slugify(s) {
    const slug = String(s).toLowerCase().normalize('NFKD')
      .replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 40).replace(/-+$/, '');
    return slug || 'item';
  }

  function toast(msg, kind = 'info') {
    const box = document.getElementById('toasts');
    if (!box) return;
    const t = el('div', { class: `toast toast-${kind}`, role: 'status' }, msg);
    box.append(t);
    setTimeout(() => t.classList.add('leaving'), 3200);
    setTimeout(() => t.remove(), 3700);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = el('textarea', { value: text, style: 'position:fixed;opacity:0' });
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast(`Copied: ${text}`);
  }

  function markdown(md) {
    return window.DOMPurify.sanitize(window.marked.parse(md || ''));
  }

  S.util = { el, pad, stamp, slugify, toast, copy, markdown };
})();
