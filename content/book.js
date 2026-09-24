/* ============================================================
   BOOK — assembles the content model.
   Chapters come from the chapter files; reference items are
   derived from the model so Reference mode stays in sync.
   ============================================================ */

window.BOOK = (function () {
  const chapters = []
    .concat(window.CHAPTERS_A)
    .concat(window.CHAPTERS_B)
    .concat(window.CHAPTERS_C);

  const M = window.MODEL;

  /* Journey groups for the sidebar */
  const groups = [
    { label: 'Foundations', chapters: ['ch01', 'ch02'] },
    { label: 'The lifecycle', chapters: ['ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09', 'ch10', 'ch11', 'ch12', 'ch13', 'ch14'] },
    { label: 'Independent practice', chapters: ['ch15'] },
    { label: 'Reference', chapters: ['ch16'] }
  ];

  /* Reference lookup index — built from the model, not hand-listed */
  function buildIndex() {
    const items = [];

    chapters.forEach(function (c) {
      items.push({ group: 'Chapters', title: String(c.num).padStart(2, '0') + ' — ' + c.title, sub: c.question, go: { ch: c.id } });
      c.sections.forEach(function (s) {
        items.push({ group: 'Sections', title: c.title + ' · ' + s.title, sub: s.lede || s.kicker || '', go: { ch: c.id, sec: s.id } });
      });
    });

    M.hierarchy.forEach(function (h) {
      items.push({ group: 'Hierarchy levels', title: h.name, sub: h.question, go: { ch: 'ch06', sec: 's2' } });
    });
    M.lifecycle.forEach(function (l) {
      items.push({ group: 'Lifecycle stages', title: l.name, sub: l.question, go: { ch: l.chapter || 'ch01' } });
    });
    M.artifacts.forEach(function (a) {
      items.push({ group: 'Artifacts', title: a.name, sub: a.purpose, go: { ch: 'ch16', sec: 's3' } });
    });
    M.decisionRules.forEach(function (d) {
      items.push({ group: 'Decision rules', title: d.name, sub: d.summary, go: { ch: 'ch16', sec: 's2' } });
    });
    M.antipatterns.forEach(function (a) {
      items.push({ group: 'Anti-patterns', title: a.name, sub: a.bad, go: { ch: 'ch16', sec: 's5' } });
    });
    M.quickReference.forEach(function (q) {
      items.push({ group: 'Quick reference', title: q.stage, sub: q.q, go: { ch: 'ch16', sec: 's1' } });
    });

    /* checklists live inside chapter blocks — collect them */
    chapters.forEach(function (c) {
      c.sections.forEach(function (s) {
        (s.blocks || []).forEach(function (b) {
          if (b.type === 'checklist') {
            items.push({ group: 'Checklists', title: b.title, sub: b.items.length + ' items · ' + c.title, go: { ch: c.id, sec: s.id } });
          }
        });
      });
    });

    return items;
  }

  /* Capability areas assessed in chapter 15 */
  const capabilities = [
    { id: 'cap-problem', name: 'Identify the problem', evidence: [{ ex: 'ex-03-problem' }, { ex: 'sim-discover' }, { gate: 'gate-sim-discover', check: 'sd1' }] },
    { id: 'cap-objective', name: 'Define the objective', evidence: [{ ex: 'sim-discover' }, { gate: 'gate-sim-discover', check: 'sd2' }] },
    { id: 'cap-success', name: 'Establish success criteria', evidence: [{ ex: 'sim-discover' }, { gate: 'gate-sim-discover', check: 'sd3' }] },
    { id: 'cap-scope', name: 'Establish a scope boundary', evidence: [{ ex: 'sim-discover' }, { gate: 'gate-sim-discover', check: 'sd4' }] },
    { id: 'cap-req', name: 'Identify requirements', evidence: [{ ex: 'sim-refine' }] },
    { id: 'cap-classify', name: 'Classify requirements', evidence: [{ ex: 'ex-04-classify' }] },
    { id: 'cap-impact', name: 'Identify architecture impact', evidence: [{ ex: 'ex-05-sc1' }, { ex: 'ex-05-sc2' }, { ex: 'ex-05-sc3' }, { ex: 'sim-refine' }] },
    { id: 'cap-design', name: 'Decide whether design is needed', evidence: [{ dtree: 'dr-design' }, { ex: 'sim-refine' }] },
    { id: 'cap-decompose', name: 'Decompose work', evidence: [{ ex: 'ex-06-levels' }, { ex: 'ex-06-order' }] },
    { id: 'cap-slice', name: 'Slice valuable Stories', evidence: [{ ex: 'ex-07-slice1' }, { ex: 'ex-07-build' }, { ex: 'sim-slice' }] },
    { id: 'cap-ac', name: 'Define Acceptance Criteria', evidence: [{ ex: 'ex-08-story' }, { ex: 'sim-slice' }] },
    { id: 'cap-deps', name: 'Identify dependencies', evidence: [{ gate: 'gate-ready', check: 'r4' }, { gate: 'gate-sim-ready', check: 'sr4' }] },
    { id: 'cap-ready', name: 'Determine readiness', evidence: [{ gate: 'gate-ready' }, { gate: 'gate-sim-ready' }] },
    { id: 'cap-deliver', name: 'Create implementation work', evidence: [{ ex: 'ex-10-q1' }, { ex: 'ex-10-q2' }] },
    { id: 'cap-verify', name: 'Understand verification', evidence: [{ ex: 'ex-11-tc' }, { dtree: 'dr-testcase' }] },
    { id: 'cap-testcase', name: 'Construct Test Cases', evidence: [{ ex: 'ex-11-tc' }, { ex: 'sim-slice' }] },
    { id: 'cap-evidence', name: 'Interpret evidence', evidence: [{ gate: 'gate-release', check: 'rl1' }, { gate: 'gate-release', check: 'rl3' }] },
    { id: 'cap-acdod', name: 'Distinguish AC from DoD', evidence: [{ ex: 'ex-12-acdod' }] },
    { id: 'cap-release', name: 'Prepare a Release', evidence: [{ gate: 'gate-release' }] },
    { id: 'cap-prod', name: 'Verify production', evidence: [{ gate: 'gate-release', check: 'rl4' }, { gate: 'gate-release', check: 'rl5' }] },
    { id: 'cap-loop', name: 'Feed operational learning back into refinement', evidence: [{ ex: 'ex-14-route' }] }
  ];

  return { chapters, groups, capabilities, index: buildIndex() };
})();
