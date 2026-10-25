/* Item files: a flat `key: value` header between --- fences, then a Markdown body.
   Tolerant by design: unknown fields are kept, unreadable lines are kept verbatim and flagged. */
(function () {
  const S = window.Scrawl;

  // Canonical field order for new items. Existing files keep their own order.
  const ORDER = ['id', 'type', 'title', 'status', 'severity', 'parent', 'assignee', 'size',
    'rank', 'labels', 'created', 'updated', 'commits'];
  const NUMERIC = new Set(['id', 'parent']);

  function parseValue(key, raw) {
    let v = raw.trim();
    // Allow trailing "# comment" except in titles, which may legitimately contain " # ".
    if (key !== 'title') v = v.replace(/\s+#\s.*$/, '').trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      return v.slice(1, -1).split(',').map((x) => x.trim()).filter(Boolean);
    }
    if (NUMERIC.has(key) && /^\d+$/.test(v)) return Number(v);
    return v;
  }

  function parse(text) {
    text = text.replace(/^﻿/, '').replace(/\r\n/g, '\n');
    const m = text.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/);
    if (!m) return { meta: {}, keys: [], extra: [], body: text, errors: ['no --- header found'] };

    const meta = {};
    const keys = [];
    const extra = [];
    const errors = [];
    m[1].split('\n').forEach((line, i) => {
      if (!line.trim() || line.trim().startsWith('#')) return;
      const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s?(.*)$/);
      if (!kv) {
        extra.push(line);
        errors.push(`header line ${i + 2} unreadable: "${line.trim()}"`);
        return;
      }
      if (!(kv[1] in meta)) keys.push(kv[1]);
      meta[kv[1]] = parseValue(kv[1], kv[2]);
    });
    if (typeof meta.id !== 'number') errors.push('missing or non-numeric id');
    if (!meta.title) errors.push('missing title');
    return { meta, keys, extra, body: m[2], errors };
  }

  function formatValue(v) {
    return Array.isArray(v) ? `[${v.join(', ')}]` : String(v);
  }

  function serialize(doc) {
    const keys = doc.keys.filter((k) => k in doc.meta);
    for (const k of ORDER) if (k in doc.meta && !keys.includes(k)) keys.push(k);
    for (const k of Object.keys(doc.meta)) if (!keys.includes(k)) keys.push(k);

    const lines = [];
    for (const k of keys) {
      const v = doc.meta[k];
      if (v == null) continue;
      const s = formatValue(v);
      lines.push(s === '' ? `${k}:` : `${k}: ${s}`);
    }
    lines.push(...(doc.extra || []));
    const body = (doc.body || '').replace(/^\n+/, '').replace(/\s*$/, '\n');
    return `---\n${lines.join('\n')}\n---\n${body}`;
  }

  /* ---------- body sections (## Description / ## Acceptance / ## Activity) ---------- */

  function findSection(lines, name) {
    const re = new RegExp(`^##\\s+${name}\\s*$`, 'i');
    const start = lines.findIndex((l) => re.test(l));
    if (start < 0) return null;
    let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
    if (end < 0) end = lines.length;
    return { start, end };
  }

  function getSection(body, name) {
    const lines = (body || '').split('\n');
    const s = findSection(lines, name);
    return s ? lines.slice(s.start + 1, s.end).join('\n').trim() : '';
  }

  function setSection(body, name, content) {
    const lines = (body || '').split('\n');
    const s = findSection(lines, name);
    const text = (content || '').trim();
    const block = [`## ${name}`, ...(text ? text.split('\n') : []), ''];
    if (s) {
      lines.splice(s.start, s.end - s.start, ...block);
    } else {
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      if (lines.length) lines.push('');
      lines.push(...block);
    }
    return lines.join('\n');
  }

  const CHECK = /^(\s*[-*]\s+\[)([ xX])(\]\s+)(.*)$/;

  function checklist(body) {
    return getSection(body, 'Acceptance').split('\n')
      .map((l) => l.match(CHECK)).filter(Boolean)
      .map((m) => ({ done: m[2] !== ' ', text: m[4] }));
  }

  function toggleCheck(body, index, done) {
    let n = -1;
    const section = getSection(body, 'Acceptance').split('\n').map((l) => {
      const m = l.match(CHECK);
      if (!m || ++n !== index) return l;
      return `${m[1]}${done ? 'x' : ' '}${m[3]}${m[4]}`;
    });
    return setSection(body, 'Acceptance', section.join('\n'));
  }

  function addCheck(body, text) {
    const cur = getSection(body, 'Acceptance');
    return setSection(body, 'Acceptance', `${cur}\n- [ ] ${text.trim()}`);
  }

  // Activity lines: "- 2026-10-25 11:02 · claude · Picked up."
  const ACT = /^[-*]\s+(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2})\s+·\s+([^·]+?)\s+·\s+(.*)$/;

  function activity(body) {
    return getSection(body, 'Activity').split('\n').filter((l) => l.trim()).map((l) => {
      const m = l.match(ACT);
      return m ? { at: m[1].replace('T', ' '), who: m[2], text: m[3] } : { at: '', who: '', text: l.replace(/^[-*]\s+/, '') };
    });
  }

  function appendActivity(body, who, text) {
    const at = S.util.stamp().replace('T', ' ');
    const oneLine = text.trim().replace(/\s*\n\s*/g, ' ');
    const cur = getSection(body, 'Activity');
    return setSection(body, 'Activity', `${cur}\n- ${at} · ${who} · ${oneLine}`);
  }

  function newBody(description) {
    return `## Description\n${description ? description.trim() + '\n' : ''}\n## Acceptance\n\n## Activity\n`;
  }

  S.parser = {
    ORDER, parse, serialize, getSection, setSection,
    checklist, toggleCheck, addCheck, activity, appendActivity, newBody,
  };
})();
