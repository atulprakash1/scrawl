/* Releases view: each .scrawl/releases/v*.md as a torn notebook page, newest first, plus a preview
   of the next one built from shipped items that no release has claimed yet (no `release:` field).
   /release writes the same format, so the preview is what you'll get. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;
  const store = S.store;

  const GROUPS = [['feature', 'Features'], ['story', 'Improvements'], ['bug', 'Bug fixes'], ['idea', 'Ideas']];
  const groupOf = (item) => (GROUPS.some(([t]) => t === item.meta.type) ? item.meta.type : 'story');

  function unreleased() {
    return store.list().filter((i) => i.meta.status === 'done' && !i.meta.release).sort((a, b) => a.id - b.id);
  }

  function changelog(version, date, items) {
    const lines = [`# v${version}`, '', date];
    for (const [type, label] of GROUPS) {
      const group = items.filter((i) => groupOf(i) === type);
      if (group.length) lines.push('', `## ${label}`, ...group.map((i) => `- #${i.id} ${i.meta.title || ''}`));
    }
    return lines.join('\n') + '\n';
  }

  // One minor version up from the newest release: 0.2.3 -> 0.3.0. No releases yet: 0.1.0.
  function nextVersion() {
    const last = store.state.releases[0];
    const m = last && last.version.match(/^(\d+)\.(\d+)/);
    return m ? `${m[1]}.${Number(m[2]) + 1}.0` : '0.1.0';
  }

  function page(md, extra) {
    return el('article', { class: 'release-page' }, extra, el('div', { class: 'md', html: S.util.markdown(md) }));
  }

  function render() {
    const root = document.getElementById('releases');
    const pending = unreleased();
    const next = nextVersion();
    const command = `/release ${next}`;
    const preview = pending.length
      ? page(changelog(next, S.util.stamp().slice(0, 10), pending),
        el('div', { class: 'release-next' },
          el('span', { class: 'stamp-draft' }, 'NEXT · PREVIEW'),
          el('button', { class: 'btn btn-claude', onclick: () => S.util.copy(command) }, `📋 Copy ${command}`)))
      : el('p', { class: 'muted release-empty' }, 'Nothing shipped since the last release.');
    const past = store.state.releases.map((r) => page(r.text));
    root.replaceChildren(el('div', { class: 'releases-inner' },
      el('h2', { class: 'view-title' }, 'Releases'),
      preview,
      past.length ? past : el('p', { class: 'muted release-empty' }, 'No releases yet. Run /release in Claude Code to make the first one.')));
  }

  S.releases = { render, changelog, unreleased, nextVersion };
})();
