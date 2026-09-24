/* ============================================================
   APP — shell, navigation, modes, progression.
   Presentation only. Content lives in /content, state in state.js.
   ============================================================ */

window.App = (function () {

  const S = window.State;
  const B = window.BOOK;
  const M = window.MODEL;
  const esc = window.Blocks.esc;

  const el = {
    reader: document.getElementById('reader'),
    main: document.getElementById('main'),
    sidebar: document.getElementById('sidebar'),
    sidebarScroll: document.getElementById('sidebarScroll'),
    sidebarFoot: document.getElementById('sidebarFoot'),
    stepRail: document.getElementById('stepRail'),
    chapCount: document.getElementById('chapCount'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    prevLabel: document.getElementById('prevLabel'),
    nextLabel: document.getElementById('nextLabel'),
    overlay: document.getElementById('overlay'),
    overlayBody: document.getElementById('overlayBody'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayPanel: document.getElementById('overlayPanel'),
    toast: document.getElementById('toast'),
    navToggle: document.getElementById('navToggle')
  };

  let blockIndex = {};
  let lastFocus = null;

  /* ---------- chapter list per mode ---------- */

  function chaptersForMode() {
    const mode = S.get().currentMode;
    if (mode === 'practice') return B.chapters.filter(function (c) { return c.id === 'ch15'; });
    if (mode === 'reference') return B.chapters.filter(function (c) { return c.id === 'ch16'; });
    return B.chapters;
  }

  function currentChapter() {
    const list = chaptersForMode();
    const found = list.find(function (c) { return c.id === S.get().currentChapter; });
    return found || list[0];
  }

  function sectionIndex(ch) {
    const cur = S.get().currentSection;
    const i = ch.sections.findIndex(function (s) { return s.id === cur; });
    return i < 0 ? 0 : i;
  }

  /* ---------- rendering ---------- */

  function renderSidebar() {
    const mode = S.get().currentMode;
    const ch = currentChapter();

    if (mode === 'learn') {
      el.sidebarScroll.innerHTML = B.groups.map(function (g) {
        return '<div class="navgroup"><div class="navgroup__label">' + esc(g.label) + '</div>' +
          g.chapters.map(function (cid) {
            const c = B.chapters.find(function (x) { return x.id === cid; });
            const p = S.chapterProgress(c);
            const isCur = c.id === ch.id;
            return '<button class="navitem' + (isCur ? ' is-current' : '') + '" data-goch="' + c.id + '">' +
              '<span class="navitem__num">' + String(c.num).padStart(2, '0') + '</span>' +
              '<span>' + esc(c.title) + '</span>' +
              '<span class="navitem__tick">' + (p.complete ? '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 12.5 4.5 4.5L19 7"/></svg>' : '') + '</span>' +
              '</button>' +
              (isCur ? '<div class="sublist">' + c.sections.map(function (s, i) {
                const done = S.isSectionComplete(c.id, s.id);
                const cur = i === sectionIndex(c);
                return '<button class="subitem' + (done ? ' is-done' : '') + (cur ? ' is-current' : '') + '" data-gosec="' + s.id + '">' +
                  '<span class="subitem__dot"></span><span>' + esc(s.title) + '</span></button>';
              }).join('') + '</div>' : '');
          }).join('') + '</div>';
      }).join('');
    } else {
      const label = mode === 'practice' ? 'Independent practice' : 'Reference';
      el.sidebarScroll.innerHTML = '<div class="navgroup"><div class="navgroup__label">' + label + '</div>' +
        ch.sections.map(function (s, i) {
          const cur = i === sectionIndex(ch);
          return '<button class="navitem' + (cur ? ' is-current' : '') + '" data-gosec="' + s.id + '">' +
            '<span class="navitem__num">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span>' + esc(s.title) + '</span><span class="navitem__tick"></span></button>';
        }).join('') + '</div>' +
        (mode === 'reference' ? '<div class="navgroup"><div class="navgroup__label">Jump to</div>' +
          [['ch01', 'The two dimensions'], ['ch03', 'Discover procedure'], ['ch04', 'Requirement discovery'], ['ch05', 'Architecture impact'], ['ch08', 'Create a Ready Story'], ['ch11', 'Verify'], ['ch13', 'Release']].map(function (j) {
            return '<button class="navitem" data-goch="' + j[0] + '" data-learn="1"><span class="navitem__num">→</span><span>' + esc(j[1]) + '</span><span class="navitem__tick"></span></button>';
          }).join('') + '</div>' : '');
    }

    /* lifecycle rail */
    el.sidebarFoot.innerHTML = '<div class="lifecycle-rail__label">Lifecycle progress</div><div class="lifecycle-rail">' +
      M.lifecycle.map(function (l) {
        const st = S.stageStatus(l.id);
        return '<span class="lc-pip' + (st === 'active' ? ' is-active' : st === 'done' ? ' is-done' : '') + '">' + esc(l.short) + '</span>';
      }).join('') + '</div>';
  }

  function renderReader() {
    const ch = currentChapter();
    blockIndex = {};

    const head =
      '<div class="chapline"><span>' + esc(ch.kicker) + '</span><span class="chapline__rule"></span>' +
      '<span>Chapter ' + String(ch.num).padStart(2, '0') + '</span></div>' +
      '<h1 class="chap-title">' + esc(ch.title) + '</h1>' +
      '<p class="chap-question">' + esc(ch.question) + '</p>' +
      '<p class="chap-intro">' + esc(ch.intro) + '</p>';

    const body = ch.sections.map(function (sec) {
      const blocks = (sec.blocks || []).map(function (b) {
        if (b.type === 'exercise' || b.type === 'gate') blockIndex[b.id] = b;
        return window.Blocks.render(b);
      }).join('');
      return '<section class="section" id="sec-' + esc(sec.id) + '" data-sec="' + esc(sec.id) + '">' +
        (sec.kicker ? '<div class="sec-kicker">' + esc(sec.kicker) + '</div>' : '') +
        '<h2 class="sec-title" tabindex="-1">' + esc(sec.title) + '</h2>' +
        (sec.lede ? '<p class="sec-lede">' + esc(sec.lede) + '</p>' : '') +
        blocks + '</section>';
    }).join('');

    el.reader.innerHTML = head + body;
    window.Blocks.hydrate(el.reader, { blockIndex: blockIndex });
  }

  function renderFoot() {
    const ch = currentChapter();
    const i = sectionIndex(ch);
    const list = chaptersForMode();
    const chIdx = list.findIndex(function (c) { return c.id === ch.id; });

    el.stepRail.innerHTML = ch.sections.map(function (s, n) {
      const done = S.isSectionComplete(ch.id, s.id);
      return '<button class="srail' + (done ? ' is-done' : '') + (n === i ? ' is-current' : '') + '" data-gosec="' + s.id + '" ' +
        'title="' + esc(s.title) + '" aria-label="' + esc(s.title) + '"><span class="srail__bar"></span></button>';
    }).join('');

    const atFirst = i === 0 && chIdx === 0;
    const atLast = i === ch.sections.length - 1 && chIdx === list.length - 1;
    el.prevBtn.disabled = atFirst;
    el.nextBtn.disabled = atLast;
    el.prevLabel.textContent = i === 0 ? (chIdx > 0 ? list[chIdx - 1].title : 'Previous') : 'Previous';
    el.nextLabel.textContent = i === ch.sections.length - 1
      ? (chIdx < list.length - 1 ? 'Chapter ' + String(list[chIdx + 1].num).padStart(2, '0') : 'End')
      : 'Continue';

    el.chapCount.textContent = String(ch.num).padStart(2, '0') + ' / ' + String(B.chapters.length).padStart(2, '0');
  }

  function render(scroll) {
    renderSidebar();
    renderReader();
    renderFoot();
    if (scroll !== false) scrollToSection();
  }

  function rerender() {
    const y = el.main.scrollTop;
    renderSidebar();
    renderReader();
    renderFoot();
    el.main.scrollTop = y;
  }

  function scrollToSection(focus) {
    const ch = currentChapter();
    const sec = ch.sections[sectionIndex(ch)];
    const node = document.getElementById('sec-' + sec.id);
    if (!node) { el.main.scrollTop = 0; return; }
    const top = node.offsetTop - 24;
    el.main.scrollTo({ top: sectionIndex(ch) === 0 ? 0 : top, behavior: prefersReduced() ? 'auto' : 'smooth' });
    if (focus) node.querySelector('.sec-title').focus();
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- navigation ---------- */

  function goChapter(chId, secId, forceLearn) {
    if (forceLearn) setMode('learn', true);
    const list = chaptersForMode();
    const ch = list.find(function (c) { return c.id === chId; }) || list[0];
    S.set({ currentChapter: ch.id, currentSection: secId || ch.sections[0].id });
    render();
    closeOverlay();
    el.sidebar.classList.remove('is-open');
    el.navToggle.setAttribute('aria-expanded', 'false');
  }

  function goSection(secId) {
    S.set({ currentSection: secId });
    render();
    el.sidebar.classList.remove('is-open');
    el.navToggle.setAttribute('aria-expanded', 'false');
  }

  function next() {
    const ch = currentChapter();
    const i = sectionIndex(ch);
    S.markSectionComplete(ch.id, ch.sections[i].id);
    if (i < ch.sections.length - 1) {
      S.set({ currentSection: ch.sections[i + 1].id });
      render();
    } else {
      const list = chaptersForMode();
      const ci = list.findIndex(function (c) { return c.id === ch.id; });
      if (ci < list.length - 1) {
        const nc = list[ci + 1];
        S.set({ currentChapter: nc.id, currentSection: nc.sections[0].id });
        render();
        toast('Chapter ' + String(nc.num).padStart(2, '0') + ' — ' + nc.title);
      }
    }
  }

  function prev() {
    const ch = currentChapter();
    const i = sectionIndex(ch);
    if (i > 0) { S.set({ currentSection: ch.sections[i - 1].id }); render(); return; }
    const list = chaptersForMode();
    const ci = list.findIndex(function (c) { return c.id === ch.id; });
    if (ci > 0) {
      const pc = list[ci - 1];
      S.set({ currentChapter: pc.id, currentSection: pc.sections[pc.sections.length - 1].id });
      render();
    }
  }

  function setMode(mode, silent) {
    S.set({ currentMode: mode });
    document.querySelectorAll('.mode').forEach(function (b) {
      const on = b.getAttribute('data-mode') === mode;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const list = chaptersForMode();
    if (!list.find(function (c) { return c.id === S.get().currentChapter; })) {
      S.set({ currentChapter: list[0].id, currentSection: list[0].sections[0].id });
    }
    if (!silent) {
      render();
      const msg = { learn: 'Learn — sequential, guided.', reference: 'Reference — direct access to procedures, artifacts, rules and checklists.', practice: 'Practice — run the model yourself, with minimal scaffolding.' };
      toast(msg[mode]);
    }
  }

  /* ---------- overlay ---------- */

  function openOverlay(title, html) {
    lastFocus = document.activeElement;
    el.overlayTitle.textContent = title;
    el.overlayBody.innerHTML = html;
    el.overlay.hidden = false;
    const first = el.overlayBody.querySelector('input, button') || document.getElementById('overlayClose');
    if (first) first.focus();
  }

  function closeOverlay() {
    if (el.overlay.hidden) return;
    el.overlay.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openMap() {
    const html = '<div class="map"><div class="map__grid">' +
      '<div class="map__col"><h3>What — the hierarchy</h3>' +
      M.hierarchy.map(function (h) { return '<button class="lookup__item" data-goch="ch06" data-sec="s2"><b>' + esc(h.name) + '</b><small>' + esc(h.question) + '</small></button>'; }).join('') +
      '</div><div class="map__col"><h3>When and how — the lifecycle</h3>' +
      M.lifecycle.map(function (l) {
        const st = S.stageStatus(l.id);
        return '<button class="lookup__item" data-goch="' + esc(l.chapter || 'ch01') + '"><b>' + esc(l.name) +
          (st === 'done' ? ' ✓' : st === 'active' ? ' •' : '') + '</b><small>' + esc(l.question) + '</small></button>';
      }).join('') +
      '</div></div>' +
      '<div class="map__col" style="margin-top:22px"><h3>Gates</h3>' +
      [['gate-discover', 'Discover Gate', 'ch03', 's4'], ['gate-ready', 'Ready Gate', 'ch09', 's3'], ['gate-release', 'Release Gate', 'ch13', 's4'], ['gate-sim-discover', 'Simulation — Discover Gate', 'ch15', 's3'], ['gate-sim-ready', 'Simulation — Ready Gate', 'ch15', 's6']].map(function (g) {
        const r = S.getIn('gateResults.' + g[0], null);
        const status = r ? (r.status === 'pass' ? 'Passed on attempt ' + r.attempts : 'Failed — ' + (r.failed || []).length + ' condition(s) outstanding') : 'Not yet run';
        return '<button class="lookup__item" data-goch="' + g[2] + '" data-sec="' + g[3] + '"><b>' + esc(g[1]) + '</b><small>' + esc(status) + '</small></button>';
      }).join('') + '</div>' +
      '<div class="map__col" style="margin-top:22px"><h3>Current artifact context</h3>' +
      '<div class="panel panel--sunk"><div class="trace">' +
      window.EXAMPLE.traceChain.slice(0, 8).map(function (t) {
        return '<div class="trace__link"><div class="trace__k">' + esc(t.k) + '</div><div class="trace__v">' + esc(t.v) + '<span class="id">' + esc(t.id) + '</span></div></div>';
      }).join('') + '</div></div></div>' +
      '<div class="map__col" style="margin-top:22px"><h3>Session</h3>' +
      '<button class="lookup__item" data-reset><b>Reset all progress</b><small>Clears answers, gate results and checklists for this browser.</small></button></div>' +
      '</div>';
    openOverlay('Model map', html);
  }

  function openLookup() {
    const html = '<input class="lookup__input" id="lookupInput" type="text" placeholder="Search procedures, artifacts, gates, rules, anti-patterns, checklists…" autocomplete="off" aria-label="Reference lookup">' +
      '<div id="lookupResults"></div>';
    openOverlay('Reference lookup', html);
    const input = document.getElementById('lookupInput');
    const results = document.getElementById('lookupResults');
    function paint(q) {
      const term = (q || '').trim().toLowerCase();
      const items = term
        ? B.index.filter(function (i) { return (i.title + ' ' + i.sub).toLowerCase().indexOf(term) !== -1; }).slice(0, 60)
        : B.index.filter(function (i) { return i.group !== 'Sections'; }).slice(0, 40);
      const byGroup = {};
      items.forEach(function (i) { (byGroup[i.group] = byGroup[i.group] || []).push(i); });
      results.innerHTML = Object.keys(byGroup).map(function (g) {
        return '<div class="lookup__group"><div class="lookup__glabel">' + esc(g) + '</div>' +
          byGroup[g].map(function (i) {
            return '<button class="lookup__item" data-goch="' + esc(i.go.ch) + '"' + (i.go.sec ? ' data-sec="' + esc(i.go.sec) + '"' : '') + ' data-learn="1">' +
              '<b>' + esc(i.title) + '</b>' + (i.sub ? '<small>' + esc(i.sub) + '</small>' : '') + '</button>';
          }).join('') + '</div>';
      }).join('') || '<p style="color:var(--ink-3)">Nothing matches that.</p>';
    }
    paint('');
    input.addEventListener('input', function () { paint(input.value); });
  }

  /* ---------- toast ---------- */

  let toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.remove('is-on'); }, 3600);
  }

  /* ---------- events ---------- */

  function wire() {
    document.querySelectorAll('.mode').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });

    el.nextBtn.addEventListener('click', next);
    el.prevBtn.addEventListener('click', prev);

    document.getElementById('mapBtn').addEventListener('click', openMap);
    document.getElementById('searchBtn').addEventListener('click', openLookup);
    document.getElementById('overlayClose').addEventListener('click', closeOverlay);
    el.overlay.addEventListener('mousedown', function (e) { if (e.target === el.overlay) closeOverlay(); });

    el.navToggle.addEventListener('click', function () {
      const open = el.sidebar.classList.toggle('is-open');
      el.navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* delegated navigation */
    document.addEventListener('click', function (e) {
      const reset = e.target.closest('[data-reset]');
      if (reset) {
        S.reset();
        setMode('learn', true);
        goChapter('ch01');
        toast('Progress cleared.');
        return;
      }
      const goch = e.target.closest('[data-goch]');
      if (goch) {
        goChapter(goch.getAttribute('data-goch'), goch.getAttribute('data-sec'), goch.hasAttribute('data-learn'));
        return;
      }
      const gosec = e.target.closest('[data-gosec]');
      if (gosec) { goSection(gosec.getAttribute('data-gosec')); }
    });

    /* keyboard */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeOverlay(); el.sidebar.classList.remove('is-open'); return; }

      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === '/' && !typing) { e.preventDefault(); openLookup(); return; }
      if ((e.key === 'm' || e.key === 'M') && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openMap(); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === 'j') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'k') { e.preventDefault(); prev(); }
    });

    /* focus trap inside the overlay */
    el.overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const f = el.overlayPanel.querySelectorAll('button, input, [href], textarea, select');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* mark a section complete once the reader has scrolled past it */
    let ticking = false;
    el.main.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        const ch = currentChapter();
        const mid = el.main.scrollTop + el.main.clientHeight * 0.6;
        let changed = false;
        ch.sections.forEach(function (sec) {
          const node = document.getElementById('sec-' + sec.id);
          if (node && node.offsetTop + node.offsetHeight < mid && !S.isSectionComplete(ch.id, sec.id)) {
            S.markSectionComplete(ch.id, sec.id);
            changed = true;
          }
        });
        if (changed) { renderSidebar(); renderFoot(); }
      });
    }, { passive: true });
  }

  function init() {
    const st = S.get();
    if (!st.currentSection) {
      const ch = B.chapters.find(function (c) { return c.id === st.currentChapter; }) || B.chapters[0];
      S.set({ currentSection: ch.sections[0].id });
    }
    setMode(st.currentMode || 'learn', true);
    wire();
    render(false);
    el.main.scrollTop = 0;
  }

  return { init: init, rerender: rerender, toast: toast, goChapter: goChapter };
})();

document.addEventListener('DOMContentLoaded', window.App.init);
