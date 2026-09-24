/* ============================================================
   STATE — explicit local application state.
   No backend. Survives navigation, and persists within the
   browser where storage is available.
   ============================================================ */

window.State = (function () {

  const KEY = 'delivery-model-state-v1';

  const initial = {
    currentChapter: 'ch01',
    currentSection: null,
    currentMode: 'learn',
    completedSections: {},      // "ch03/s2": true
    visitedChapters: { ch01: true },
    answers: {},                // exerciseId -> payload
    exerciseStatus: {},         // exerciseId -> 'correct' | 'partial' | 'incorrect' | 'submitted'
    failedChecks: {},           // exerciseId -> [itemIndex]
    gateResults: {},            // gateId -> { status, answers, attempts, failed:[checkId], at }
    artifactProgress: {},       // artifact fields the reader produced
    checklists: {},             // checklistId -> { itemIndex: true }
    dtree: {},                  // ruleId -> path of option indexes
    reveals: {}                 // revealId -> true
  };

  let s = load();
  const listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return clone(initial);
      const parsed = JSON.parse(raw);
      return Object.assign(clone(initial), parsed);
    } catch (e) {
      return clone(initial);
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode: in-memory only */ }
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function get() { return s; }

  function set(patch) {
    Object.assign(s, patch);
    save();
    emit();
  }

  function setIn(path, value) {
    const parts = path.split('.');
    let node = s;
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof node[parts[i]] !== 'object' || node[parts[i]] === null) node[parts[i]] = {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
    save();
    emit();
  }

  function getIn(path, fallback) {
    const parts = path.split('.');
    let node = s;
    for (let i = 0; i < parts.length; i++) {
      if (node === null || typeof node !== 'object' || !(parts[i] in node)) return fallback;
      node = node[parts[i]];
    }
    return node === undefined ? fallback : node;
  }

  function on(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(function (f) { f(s); }); }

  /* ---- progress helpers ---- */

  function markSectionComplete(chId, secId) {
    if (!s.completedSections[chId + '/' + secId]) {
      s.completedSections[chId + '/' + secId] = true;
      save();
      emit();
    }
  }

  function isSectionComplete(chId, secId) {
    return !!s.completedSections[chId + '/' + secId];
  }

  function chapterProgress(ch) {
    const total = ch.sections.length;
    let done = 0;
    ch.sections.forEach(function (sec) { if (isSectionComplete(ch.id, sec.id)) done++; });
    return { done: done, total: total, complete: total > 0 && done === total };
  }

  function stageStatus(stageId) {
    // a lifecycle stage is done when every chapter tagged with it is complete
    const chs = window.BOOK.chapters.filter(function (c) { return c.stage === stageId; });
    if (!chs.length) return 'none';
    const current = window.BOOK.chapters.find(function (c) { return c.id === s.currentChapter; });
    if (current && current.stage === stageId) return 'active';
    const allDone = chs.every(function (c) { return chapterProgress(c).complete; });
    return allDone ? 'done' : 'todo';
  }

  function recordGate(gateId, result) {
    const prev = s.gateResults[gateId];
    s.gateResults[gateId] = {
      status: result.status,
      answers: result.answers,
      failed: result.failed,
      attempts: (prev ? prev.attempts : 0) + 1,
      at: new Date().toISOString()
    };
    save();
    emit();
  }

  function reset() {
    s = clone(initial);
    save();
    emit();
  }

  /* ---- capability assessment ---- */

  function capabilityVerdict(cap) {
    let attempted = 0, strong = 0, weak = 0;

    cap.evidence.forEach(function (ev) {
      if (ev.ex) {
        const st = s.exerciseStatus[ev.ex];
        if (!st) return;
        attempted++;
        if (st === 'correct') strong++;
        else if (st === 'incorrect') weak++;
        else strong += 0.5;
      } else if (ev.gate) {
        const g = s.gateResults[ev.gate];
        if (!g) return;
        attempted++;
        if (ev.check) {
          const failedThis = (g.failed || []).indexOf(ev.check) !== -1;
          if (failedThis) weak++; else strong++;
        } else {
          if (g.status === 'pass' && g.attempts === 1) strong++;
          else if (g.status === 'pass') strong += 0.5;
          else weak++;
        }
      } else if (ev.dtree) {
        if (s.dtree[ev.dtree]) { attempted++; strong += 0.5; }
      }
    });

    if (attempted === 0) return { v: 'pending', label: 'Not yet attempted' };
    const ratio = strong / attempted;
    if (weak > 0 && ratio < 0.5) return { v: 'review', label: 'Needs review' };
    if (ratio >= 0.95 && attempted >= 2) return { v: 'understood', label: 'Understood' };
    if (ratio >= 0.75) return { v: 'ready', label: 'Ready for independent practice' };
    return { v: 'practiced', label: 'Practiced' };
  }

  return {
    get: get, set: set, setIn: setIn, getIn: getIn, on: on,
    markSectionComplete: markSectionComplete, isSectionComplete: isSectionComplete,
    chapterProgress: chapterProgress, stageStatus: stageStatus,
    recordGate: recordGate, capabilityVerdict: capabilityVerdict, reset: reset
  };
})();
