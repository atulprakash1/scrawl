/* Project wizard: five questions for a project whose project.md is still empty, then the /plan command to paste. */
(function () {
  const S = window.Scrawl;
  const { el } = S.util;

  // `heading` is the project.md section each answer goes under. `list` answers become one bullet per line.
  const QUESTIONS = [
    { heading: 'Goal', ask: 'What are you building?', hint: 'A sentence or two is plenty.', required: true },
    { heading: 'For whom', ask: 'Who is it for?', hint: 'You, a team, customers…' },
    { heading: 'Stack', ask: 'What will you build it with?', hint: 'Languages, frameworks, where it runs.' },
    { heading: 'Must-haves', ask: 'What must it do?', hint: 'One per line.', list: true },
    { heading: 'Out of scope', ask: 'What is it not going to do?', hint: 'One per line. Saying no early keeps the plan small.', list: true },
  ];

  const PLAN = '/plan';

  function compose(name, answers) {
    const sections = QUESTIONS.map((q, i) => {
      let a = (answers[i] || '').trim();
      if (q.list && a) {
        a = a.split('\n').map((l) => l.trim()).filter(Boolean)
          .map((l) => (/^[-*] /.test(l) ? l : `- ${l}`)).join('\n');
      }
      return `## ${q.heading}${a ? `\n${a}` : ''}`;
    });
    return `# ${name}\n\n${sections.join('\n\n')}\n`;
  }

  // Renders into `box` and calls `done` when the user wants the board.
  function start(box, done) {
    const answers = QUESTIONS.map(() => '');
    let step = 0;

    function ask() {
      const q = QUESTIONS[step];
      const last = step === QUESTIONS.length - 1;
      const input = el('textarea', { name: 'answer', rows: q.list ? 5 : 3, value: answers[step], 'aria-label': q.ask });

      const next = async (e) => {
        e.preventDefault();
        answers[step] = input.value;
        if (q.required && !input.value.trim()) { input.focus(); return S.util.toast('This one needs an answer', 'warn'); }
        if (!last) { step += 1; return ask(); }
        try {
          await S.store.saveProject(compose(S.store.project, answers));
          planned();
        } catch (err) {
          S.util.toast(`Couldn't write project.md: ${err.message}`, 'warn');
        }
      };

      box.replaceChildren(
        el('p', { class: 'muted wizard-step' }, `Question ${step + 1} of ${QUESTIONS.length}`),
        el('form', { class: 'wizard-form', onsubmit: next },
          el('h2', { class: 'wizard-ask' }, q.ask),
          el('p', { class: 'muted' }, q.hint),
          input,
          el('div', { class: 'welcome-actions' },
            step > 0
              ? el('button', { class: 'btn', type: 'button', onclick: () => { answers[step] = input.value; step -= 1; ask(); } }, '← Back')
              : null,
            el('button', { class: 'btn btn-big', type: 'submit' }, last ? '✎ Write project.md' : 'Next →'))),
        el('button', { class: 'link-btn', type: 'button', onclick: done }, 'skip for now'));

      // Ctrl/Cmd+Enter moves on, so you never have to leave the keyboard.
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) input.form.requestSubmit();
      });
      input.focus();
    }

    function planned() {
      box.replaceChildren(
        el('h2', { class: 'wizard-ask' }, 'project.md is written ✓'),
        el('p', {}, 'Now let Claude plan it. Paste this into Claude Code in this repo:'),
        el('div', { class: 'wizard-command' },
          el('code', {}, PLAN),
          el('button', { class: 'btn btn-claude', onclick: () => S.util.copy(PLAN) }, '📋 Copy')),
        el('div', { class: 'welcome-actions' },
          el('button', { class: 'btn btn-big', onclick: done }, 'Open the board →')));
    }

    ask();
  }

  S.wizard = { QUESTIONS, compose, start };
})();
