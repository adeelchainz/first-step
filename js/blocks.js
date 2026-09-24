/* ============================================================
   BLOCKS — renders the content model into the reader.
   Content in, HTML out. Interaction is attached by hydrate().
   ============================================================ */

window.Blocks = (function () {

  const M = window.MODEL;
  const E = window.EXAMPLE;

  /* ---------- helpers ---------- */

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function ul(items, cls) {
    return '<ul class="' + (cls || '') + '">' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
  }
  function ol(items, cls) {
    return '<ol class="' + (cls || '') + '">' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol>';
  }
  function arrowDown() {
    return '<div class="flow__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v15m0 0-5-5m5 5 5-5"/></svg></div>';
  }
  function arrowRight() {
    return '<div class="flow__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15m0 0-5-5m5 5-5 5"/></svg></div>';
  }
  function tick() {
    return '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';
  }
  function blockTitle(t) { return t ? '<div class="block-title">' + esc(t) + '</div>' : ''; }
  function necessityChip(n) {
    const map = { always: ['always', 'Always'], when: ['when', 'When needed'], optional: ['optional', 'Optional'] };
    const m = map[n] || map.optional;
    return '<span class="chip chip--' + m[0] + '">' + m[1] + '</span>';
  }

  /* value renderer for artifact rows: string | {list} | {pairs} | {gherkin} */
  function val(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (v.list) return ul(v.list.map(esc));
    if (v.pairs) return v.pairs.map(function (p) { return '<div style="margin-bottom:9px"><strong>' + esc(p.k) + '</strong><br>' + esc(p.v) + '</div>'; }).join('');
    if (v.gherkin) return '<div class="gherkin">' + esc(v.gherkin) + '</div>';
    return esc(String(v));
  }

  /* ---------- renderers ---------- */

  const R = {};

  R.prose = function (b) {
    return '<div class="block">' + (b.p || []).map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>';
  };

  R.callout = function (b) {
    return '<div class="block"><div class="callout callout--' + esc(b.variant) + '">' +
      (b.label ? '<span class="callout__label">' + esc(b.label) + '</span>' : '') +
      '<p>' + b.text + '</p></div></div>';
  };

  R.flow = function (b) {
    const row = b.dir === 'row';
    const nodes = b.nodes.map(function (n) {
      const cls = 'flow__node' + (n.accent ? ' flow__node--accent' : '') + (n.muted ? ' flow__node--muted' : '');
      return '<div class="' + cls + '"><b>' + esc(n.t) + '</b>' + (n.s ? '<small>' + esc(n.s) + '</small>' : '') + '</div>';
    });
    const joined = [];
    nodes.forEach(function (n, i) { if (i) joined.push(row ? arrowRight() : arrowDown()); joined.push(n); });
    return '<div class="block">' + blockTitle(b.title) + '<div class="flow ' + (row ? 'flow--row' : '') + '">' + joined.join('') +
      (b.loop ? '<div class="flow__loop">↺ ' + esc(b.loop) + '</div>' : '') + '</div></div>';
  };

  R.twoflows = function () {
    const left = M.hierarchy.map(function (h) { return '<div class="flow__node"><b>' + esc(h.name) + '</b></div>'; });
    const right = M.lifecycle.map(function (l) { return '<div class="flow__node"><b>' + esc(l.short) + '</b></div>'; });
    function stack(nodes, loop) {
      const out = [];
      nodes.forEach(function (n, i) { if (i) out.push(arrowDown()); out.push(n); });
      if (loop) out.push('<div class="flow__loop">↺ back to Refine</div>');
      return '<div class="flow">' + out.join('') + '</div>';
    }
    return '<div class="block"><div class="map__grid">' +
      '<div class="map__col"><h3>What — the hierarchy</h3>' + stack(left) + '</div>' +
      '<div class="map__col"><h3>When and how — the lifecycle</h3>' + stack(right, true) + '</div>' +
      '</div></div>';
  };

  R.hierarchy = function () {
    return '<div class="block">' + M.hierarchy.map(function (h, i) {
      return reveal('hier-' + h.id, h.level + '. ' + h.name + ' — ' + h.question,
        '<p>' + esc(h.purpose) + '</p>' +
        '<div class="badgood" style="margin-top:12px">' +
        '<div class="bgcard bgcard--good"><div class="bgcard__h">Belongs here</div><div class="bgcard__b">' + ul(h.belongs.map(esc)) + '</div></div>' +
        '<div class="bgcard bgcard--bad"><div class="bgcard__h">Does not belong</div><div class="bgcard__b">' + ul(h.notBelongs.map(esc)) + '</div></div>' +
        '</div>' +
        '<div class="artifact__foot" style="margin-top:12px;border:1px solid var(--rule)">' +
        '<span><b>Owner</b> ' + esc(h.owner) + '</span><span><b>System of record</b> ' + esc(h.sor) + '</span></div>');
    }).join('') + '</div>';
  };

  R.hierarchydetail = function (b) {
    const ids = b.ids || M.hierarchy.map(function (h) { return h.id; });
    return '<div class="block proc">' + ids.map(function (id, i) {
      const h = M.hierarchy.find(function (x) { return x.id === id; });
      const body =
        field('Purpose', '<p>' + esc(h.purpose) + '</p>') +
        field('Question', '<p>' + esc(h.question) + '</p>') +
        field('Belongs', ul(h.belongs.map(esc))) +
        field('Not here', ul(h.notBelongs.map(esc))) +
        field('Inputs', ul(h.inputs.map(esc))) +
        field('Owner', '<p>' + esc(h.owner) + (h.participants.length ? ' · <em>with ' + esc(h.participants.join(', ')) + '</em>' : '') + '</p>') +
        field('Quality', ul(h.quality.map(esc))) +
        field('Mistakes', ul(h.mistakes.map(esc))) +
        field('Record in', '<p>' + esc(h.sor) + '</p>') +
        field('Connects', '<p>' + esc(h.relationships) + '</p>');
      return step(String(h.level).padStart(2, '0'), h.name, body, 'hd-' + h.id);
    }).join('') + '</div>';
  };

  R.hierarchytree = function () {
    const rows = [
      { d: 0, k: 'Initiative', v: E.initiative.id + ' ' + E.initiative.name },
      { d: 1, k: 'Epic', v: E.epics[0].id + ' ' + E.epics[0].name },
      { d: 2, k: 'Feature', v: E.features[0].id + ' ' + E.features[0].name },
      { d: 3, k: 'Story', v: 'STORY-114 See late and at-risk deliverables in one list' },
      { d: 4, k: 'Task', v: 'TASK-501 … TASK-504' },
      { d: 3, k: 'Story', v: 'STORY-115 The list stays fast and current at portfolio scale' },
      { d: 3, k: 'Story', v: 'STORY-117 Open a flagged deliverable in one action' },
      { d: 3, k: 'Story', v: 'STORY-119 Acknowledge a flagged deliverable' },
      { d: 2, k: 'Feature', v: E.features[1].id + ' ' + E.features[1].name },
      { d: 3, k: 'Story', v: 'STORY-116 The project list shows which projects contain risk' },
      { d: 1, k: 'Epic', v: E.epics[1].id + ' ' + E.epics[1].name },
      { d: 2, k: 'Feature', v: E.features[2].id + ' ' + E.features[2].name },
      { d: 3, k: 'Story', v: 'STORY-118 Record whether a flagged risk preceded a missed deliverable' }
    ];
    return '<div class="block">' + blockTitle('The Atlas hierarchy') + '<div class="panel panel--sunk">' +
      rows.map(function (r) {
        return '<div style="display:flex;gap:10px;align-items:baseline;padding:4px 0 4px ' + (r.d * 22) + 'px;font-size:13px">' +
          '<span style="font:600 9px/1.6 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-4);min-width:62px">' + esc(r.k) + '</span>' +
          '<span style="color:var(--ink-2)">' + esc(r.v) + '</span></div>';
      }).join('') + '</div></div>';
  };

  R.lifecycle = function () {
    return '<div class="block">' + M.lifecycle.map(function (l) {
      return reveal('lc-' + l.id, l.name + ' — ' + l.question,
        field('Produces', ul(l.produces.map(esc))) +
        field('Evidence', '<p>' + esc(l.evidence) + '</p>') +
        field('Gate', '<p>' + (l.gate ? esc(l.gate.replace('-', ' ')) : 'No formal gate — governed by decision rules') + '</p>'));
    }).join('') + '<div class="flow__loop" style="margin-top:14px">↺ Operate feeds Refine — the lifecycle does not end</div></div>';
  };

  R.notlevels = function () {
    return '<div class="block">' + M.notLevels.map(function (n) {
      return reveal('nl-' + n.term.replace(/\s/g, ''), n.term,
        '<p><strong>What it actually is:</strong> ' + esc(n.is) + '</p><p>' + esc(n.why) + '</p>');
    }).join('') + '</div>';
  };

  R.models = function () {
    return '<div class="block"><table class="cmp"><thead><tr><th>Model</th><th>Question it owns</th><th>Gives</th><th>Takes from</th></tr></thead><tbody>' +
      M.models.map(function (m) {
        return '<tr><th scope="row">' + esc(m.name) + '</th><td>' + esc(m.q) + '<br><small style="color:var(--ink-4)">' + esc(m.owns) + '</small></td><td>' + esc(m.gives) + '</td><td>' + esc(m.takesFrom) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  R.layers = function (b) {
    const out = [];
    b.layers.forEach(function (l, i) {
      if (i) out.push('<div class="layer__link" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v15m0 0-4-4m4 4 4-4"/></svg></div>');
      out.push('<div class="layer"><div class="layer__name">' + esc(l.name) + '</div><div class="layer__chain">' +
        l.chain.map(function (c, j) { return (j ? '<span class="sep">→</span>' : '') + '<span>' + esc(c) + '</span>'; }).join('') +
        '</div><div class="layer__note">' + esc(l.note) + '</div></div>');
    });
    return '<div class="block"><div class="layers">' + out.join('') + '</div></div>';
  };

  R.opmodel = function (b) {
    const d = b.data;
    const cells = [
      ['Inputs', d.inputs], ['Actions', d.actions], ['Output', d.output], ['Evidence', d.evidence],
      ['Owner', d.owner], ['Participants', d.participants], ['Decision', d.decision], ['System of record', d.sor]
    ];
    return '<div class="block">' + blockTitle('Operating model') + '<div class="opgrid">' +
      cells.map(function (c) { return '<div class="opcell"><div class="opcell__k">' + esc(c[0]) + '</div><div class="opcell__v">' + esc(c[1]) + '</div></div>'; }).join('') +
      '<div class="opcell opcell--wide"><div class="opcell__k">Next</div><div class="opcell__v">' + esc(d.next) + '</div></div>' +
      '</div></div>';
  };

  R.responsibility = function () {
    return '<div class="block">' + blockTitle('Responsibility — four concepts, no RACI') + '<div class="opgrid">' +
      M.responsibility.map(function (r) {
        return '<div class="opcell"><div class="opcell__k">' + esc(r.k) + '</div><div class="opcell__v">' + esc(r.q) + '<br><small style="color:var(--ink-4)">' + esc(r.note) + '</small></div></div>';
      }).join('') + '</div></div>';
  };

  R.gateshape = function () {
    return '<div class="block">' + blockTitle('What a gate is') +
      '<div class="panel"><div class="flow">' +
      '<div class="flow__node flow__node--accent"><b>Current step</b><small>Conditions evaluated</small></div>' +
      arrowDown() +
      '<div class="badgood">' +
      '<div class="bgcard bgcard--good"><div class="bgcard__h">Pass</div><div class="bgcard__b">Work continues to the next stage. The result is recorded — including which conditions were evaluated and when.</div></div>' +
      '<div class="bgcard bgcard--bad"><div class="bgcard__h">Fail</div><div class="bgcard__b">The failing condition names the <strong>correction</strong>, the <strong>return point</strong>, what must be <strong>rechecked</strong>, and the <strong>owner</strong> of the fix.</div></div>' +
      '</div>' + arrowDown() +
      '<div class="flow__node"><b>Correct → Recheck → Pass</b><small>Re-evaluate the failed conditions and anything the correction touched</small></div>' +
      '</div></div></div>';
  };

  R.necessity = function () {
    const rows = M.artifacts.map(function (a) {
      return '<tr><th scope="row">' + esc(a.name) + '</th><td>' + necessityChip(a.necessity) + '</td><td>' + esc(a.purpose) + '</td></tr>';
    }).join('');
    return '<div class="block"><table class="cmp"><thead><tr><th>Artifact</th><th>Necessity</th><th>Why it exists</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  };

  R.transform = function (b) {
    const d = b.data;
    return '<div class="block">' + blockTitle('Artifact transformation') + '<div class="transform">' +
      '<div class="tcell"><div class="tcell__k">What we had</div><div class="tcell__v">' + esc(d.before) + '</div></div>' +
      '<div class="tcell tcell--now"><div class="tcell__k">What we create now</div><div class="tcell__v">' + esc(d.now) + '</div></div>' +
      '<div class="tcell"><div class="tcell__k">How it connects</div><div class="tcell__v">' + esc(d.connects) + '</div></div>' +
      '<div class="tcell"><div class="tcell__k">Where it goes</div><div class="tcell__v">' + esc(d.next) + '</div></div>' +
      '</div></div>';
  };

  R.claimevidence = function (b) {
    const d = b.data;
    return '<div class="block">' + blockTitle('Claim vs evidence') + '<div class="badgood">' +
      '<div class="bgcard bgcard--bad"><div class="bgcard__h">Claim</div><div class="bgcard__b">' + esc(d.claim) + '</div></div>' +
      '<div class="bgcard bgcard--good"><div class="bgcard__h">Evidence</div><div class="bgcard__b">' + esc(d.evidence) + '</div></div>' +
      '</div>' + (d.note ? '<div class="bg-why"><div class="callout callout--note"><span class="callout__label">Note</span><p>' + esc(d.note) + '</p></div></div>' : '') + '</div>';
  };

  R.badgood = function (b) {
    const d = b.data;
    function card(side, c) {
      return '<div class="bgcard bgcard--' + side + '"><div class="bgcard__h">' + esc(c.label) + '</div><div class="bgcard__b">' +
        (c.q ? '<span class="q">' + esc(c.q) + '</span>' : '') + (c.list ? ul(c.list.map(esc)) : '') + '</div></div>';
    }
    return '<div class="block"><div class="badgood">' + card('bad', d.bad) + card('good', d.good) + '</div>' +
      '<div class="bg-why"><div class="callout callout--warning"><span class="callout__label">Why the first one fails</span><p>' + esc(d.why) + '</p></div></div>' +
      (d.repair ? '<div class="bg-why"><div class="callout callout--principle"><span class="callout__label">The repair</span><p>' + esc(d.repair) + '</p></div></div>' : '') +
      '</div>';
  };

  R.compare = function (b) {
    return '<div class="block"><table class="cmp"><thead><tr><th></th><th>' + esc(b.cols[0]) + '</th><th>' + esc(b.cols[1]) + '</th></tr></thead><tbody>' +
      b.rows.map(function (r) { return '<tr><th scope="row">' + esc(r.k) + '</th><td>' + esc(r.a) + '</td><td>' + esc(r.b) + '</td></tr>'; }).join('') +
      '</tbody></table></div>';
  };

  R.versus = function (b) {
    const d = b.data;
    function side(x, cls) {
      return '<div class="bgcard bgcard--' + cls + '"><div class="bgcard__h">' + esc(x.k) + '</div><div class="bgcard__b">' +
        '<span class="q">' + esc(x.q) + '</span>' + ul(x.points.map(esc)) + '</div></div>';
    }
    return '<div class="block"><div class="badgood">' + side(d.left, 'good') + side(d.right, 'good') + '</div></div>';
  };

  R.propgrid = function (b) {
    return '<div class="block"><div class="opgrid">' + b.items.map(function (i) {
      return '<div class="opcell"><div class="opcell__k">' + esc(i.k) + '</div><div class="opcell__v">' + esc(i.d) +
        '<br><small style="color:var(--fail)">' + esc(i.fails) + '</small></div></div>';
    }).join('') + '</div></div>';
  };

  R.fourup = function (b) {
    return '<div class="block">' + b.items.map(function (i) {
      return '<div class="panel" style="margin-bottom:10px"><div class="opcell__k">' + esc(i.k) + '</div>' +
        '<p style="font-family:var(--serif);font-size:16px;margin:6px 0 10px">' + esc(i.q) + '</p>' +
        '<div class="arow"><div class="arow__k">Scope</div><div class="arow__v">' + esc(i.scope) + '</div></div>' +
        '<div class="arow" style="margin-top:8px"><div class="arow__k">Contains</div><div class="arow__v">' + esc(i.owns) + '</div></div>' +
        '<div class="arow" style="margin-top:8px"><div class="arow__k">Smell</div><div class="arow__v" style="color:var(--fail)">' + esc(i.smell) + '</div></div>' +
        '</div>';
    }).join('') + '</div>';
  };

  R.steplist = function (b) {
    return '<div class="block">' + blockTitle(b.title) + '<div class="panel">' +
      b.items.map(function (i) {
        return '<div style="display:grid;grid-template-columns:30px 1fr;gap:12px;padding:10px 0;border-bottom:1px solid var(--rule)">' +
          '<div style="font:500 11px/1.5 var(--mono);color:var(--accent)">' + String(i.n).padStart(2, '0') + '</div>' +
          '<div><div style="font:600 13.5px/1.35 var(--sans);margin-bottom:3px">' + esc(i.t) + '</div>' +
          '<div style="font-size:13px;color:var(--ink-2)">' + esc(i.d) + '</div></div></div>';
      }).join('') + '</div></div>';
  };

  R.activitytable = function (b) {
    return '<div class="block"><table class="cmp"><thead><tr><th>Activity</th><th>Where it belongs</th><th>Evidence</th></tr></thead><tbody>' +
      b.rows.map(function (r) {
        return '<tr><th scope="row">' + esc(r.a) + '</th><td>' + esc(r.where) + '<br><small style="color:var(--ink-4)">' + esc(r.note) + '</small></td><td>' + esc(r.evidence) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  R.notrelease = function (b) {
    return '<div class="block">' + blockTitle('A Release is not…') + '<div class="panel">' +
      b.rows.map(function (r) {
        return '<div class="arow" style="padding:9px 0;border-bottom:1px solid var(--rule)"><div class="arow__k">' + esc(r.k) + '</div><div class="arow__v">' + esc(r.d) + '</div></div>';
      }).join('') + '</div></div>';
  };

  /* ---- procedure ---- */

  function field(k, v) {
    return '<div class="field"><div class="field__k">' + esc(k) + '</div><div class="field__v">' + v + '</div></div>';
  }
  function step(n, title, body, id) {
    return '<div class="step" data-step="' + esc(id) + '">' +
      '<button class="step__head" aria-expanded="false"><span class="step__n">' + esc(n) + '</span>' +
      '<span class="step__t">' + esc(title) + '</span>' +
      '<span class="step__chev" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg></span></button>' +
      '<div class="step__body">' + body + '</div></div>';
  }

  function exampleBlock(ex) {
    if (!ex) return '';
    let inner = '';
    if (ex.before) inner += '<p><strong>Before:</strong> ' + esc(ex.before) + '</p>';
    if (ex.after) inner += '<p><strong>After:</strong> ' + esc(ex.after) + '</p>';
    if (ex.list) inner += ul(ex.list.map(esc));
    if (ex.twoLists) {
      inner += '<div class="badgood"><div class="bgcard bgcard--good"><div class="bgcard__h">' + esc(ex.twoLists.inLabel) + '</div><div class="bgcard__b">' + ul(ex.twoLists.inList.map(esc)) + '</div></div>' +
        '<div class="bgcard bgcard--bad"><div class="bgcard__h">' + esc(ex.twoLists.outLabel) + '</div><div class="bgcard__b">' + ul(ex.twoLists.outList.map(esc)) + '</div></div></div>';
    }
    if (ex.acList) inner += ol(ex.acList.map(function (a) { return '<strong>' + esc(a.id) + '</strong> — ' + esc(a.text); }));
    if (ex.taskList) inner += ul(ex.taskList.map(function (t) { return '<strong>' + esc(t.id) + '</strong> ' + esc(t.name) + ' — <em>' + esc(t.note) + '</em>'; }));
    if (ex.artifactRef === 'initiative') inner += '<p><em>The full record appears below this procedure.</em></p>';
    if (ex.note) inner += '<p style="color:var(--ink-3)">' + esc(ex.note) + '</p>';
    return field('Worked example', '<div style="border-left:2px solid var(--accent);padding-left:13px">' +
      '<p style="font:600 10px/1 var(--sans);letter-spacing:.13em;text-transform:uppercase;color:var(--accent-ink);margin-bottom:8px">' + esc(ex.label) + '</p>' + inner + '</div>');
  }

  R.procedure = function (b) {
    return '<div class="block proc">' + b.steps.map(function (s) {
      const body =
        field('Why', '<p>' + esc(s.why) + '</p>') +
        field('Inputs', ul((s.inputs || []).map(esc))) +
        field('Owner', '<p>' + esc(s.who) + '</p>') +
        ((s.participants && s.participants.length) ? field('Participants', '<p>' + esc(s.participants.join(', ')) + '</p>') : '') +
        field('Output', '<p>' + esc(s.what) + '</p>') +
        field('How', ol(s.how.map(esc), 'howlist')) +
        exampleBlock(s.example) +
        field('Mistakes', ul((s.mistakes || []).map(esc))) +
        field('Evidence', '<p>' + esc(s.evidence) + '</p>') +
        field('Record in', '<p>' + esc(s.where) + '</p>') +
        field('If failed', '<p style="color:var(--fail)">' + esc(s.ifFailed) + '</p>');
      return step('STEP ' + String(s.n).padStart(2, '0'), s.title, body, 'p-' + s.n + '-' + s.title.slice(0, 8));
    }).join('') + '</div>';
  };

  /* ---- reveal ---- */

  function reveal(id, label, body) {
    return '<div class="reveal" data-reveal="' + esc(id) + '">' +
      '<button class="reveal__btn" aria-expanded="false"><span class="reveal__sign" aria-hidden="true">+</span><span>' + esc(label) + '</span></button>' +
      '<div class="reveal__body">' + body + '</div></div>';
  }
  R.reveals = function (b) {
    return '<div class="block">' + blockTitle(b.title) + b.items.map(function (i, n) { return reveal(b.id + '-' + n, i.q, '<p>' + i.a + '</p>'); }).join('') + '</div>';
  };

  /* ---- artifacts ---- */

  R.artifactcard = function (b) {
    const d = b.data;
    return '<div class="block"><div class="artifact">' +
      '<div class="artifact__head"><span class="artifact__type">' + esc(d.kind) + '</span><span class="artifact__id">' + esc(d.id) + '</span>' +
      '<span class="artifact__name">' + esc(d.name) + '</span></div>' +
      '<div class="artifact__body">' + d.rows.map(function (r) {
        return '<div class="arow"><div class="arow__k">' + esc(r.k) + '</div><div class="arow__v">' + val(r.v) + '</div></div>';
      }).join('') + '</div>' +
      (d.foot ? '<div class="artifact__foot">' + d.foot.map(function (f) { return '<span><b>' + esc(f.k) + '</b> ' + esc(f.v) + '</span>'; }).join('') + '</div>' : '') +
      '</div></div>';
  };

  R.storycard = function (b) {
    const s = E.stories.find(function (x) { return x.id === b.storyId; });
    return R.artifactcard({ data: {
      kind: 'Story', id: s.id, name: s.name,
      rows: [
        { k: 'Intent', v: s.intent },
        { k: 'Requirements', v: s.requirements.join(' · ') },
        { k: 'Acceptance Criteria', v: { list: s.ac.map(function (a) { return '<strong>' + esc(a.id) + '</strong> — ' + esc(a.text); }) } },
        { k: 'Dependencies', v: { list: s.dependencies } },
        { k: 'Architecture impact', v: s.archImpact },
        { k: 'Design', v: s.design },
        { k: 'Testability', v: s.testability },
        { k: 'Size', v: s.size },
        { k: 'Tasks', v: { list: E.tasks.filter(function (t) { return t.story === s.id; }).map(function (t) { return esc(t.id) + ' ' + esc(t.name); }) } }
      ],
      foot: [{ k: 'Owner', v: s.owner }, { k: 'Ready Gate', v: s.readyResult }, { k: 'System of record', v: 'Work management system' }]
    }});
  };

  R.requirements = function () {
    const labels = { functional: 'Functional', business: 'Business', ux: 'UX', nfr: 'Non-functional' };
    return '<div class="block">' + blockTitle('The requirement set — INIT-42') + '<table class="cmp"><thead><tr><th>ID</th><th>Requirement</th><th>Class</th><th>Stories</th></tr></thead><tbody>' +
      E.requirements.map(function (r) {
        return '<tr><th scope="row">' + esc(r.id) + '</th><td>' + esc(r.text) + '</td><td>' + esc(labels[r.cls]) + '</td><td>' + (r.stories.length ? esc(r.stories.join(', ')) : '<em>resolved without a Story</em>') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  R.archimpact = function () {
    const a = E.archImpact;
    const vmap = { no: ['chip--pass', 'Clean'], yes: ['chip--fail', 'Triggers'], contained: ['chip--when', 'Partial'] };
    return '<div class="block"><div class="artifact">' +
      '<div class="artifact__head"><span class="artifact__type">Architecture Impact Check</span><span class="artifact__id">' + esc(a.id) + '</span><span class="artifact__name">' + esc(a.scope) + '</span></div>' +
      '<div class="artifact__body">' +
      a.checks.map(function (c, i) {
        const v = vmap[c.v];
        return '<div class="arow" style="border-bottom:1px solid var(--rule);padding-bottom:10px">' +
          '<div class="arow__k">' + String(i + 1).padStart(2, '0') + ' ' + esc(c.k) + '</div>' +
          '<div class="arow__v">' + esc(c.f) + '<br><span class="chip ' + v[0] + '" style="margin-top:6px">' + v[1] + '</span></div></div>';
      }).join('') +
      '<div class="arow"><div class="arow__k">Outcome</div><div class="arow__v"><strong>' + esc(a.outcome) + '</strong><br>' + esc(a.reason) + '</div></div>' +
      '<div class="arow"><div class="arow__k">Decision</div><div class="arow__v">' + esc(a.decision) + '</div></div>' +
      '</div><div class="artifact__foot"><span><b>Owner</b> ' + esc(a.owner) + '</span><span><b>Recorded on</b> the requirements</span></div></div></div>';
  };

  R.testcards = function (b) {
    return '<div class="block">' + b.cases.map(function (t) {
      return R.artifactcard({ data: {
        kind: 'Test case', id: t.id, name: t.scenario,
        rows: [
          { k: 'Verifies', v: t.ac + ' of ' + t.story },
          { k: 'Preconditions', v: { list: t.preconditions } },
          { k: 'Test data', v: t.data },
          { k: 'Steps', v: { list: t.steps } },
          { k: 'Expected result', v: t.expected }
        ],
        foot: [{ k: 'Owner', v: t.owner }, { k: 'System of record', v: 'QA/test system' }]
      }});
    }).join('') + '</div>';
  };

  R.releasecard = function () {
    const r = E.release;
    return R.artifactcard({ data: {
      kind: 'Release', id: r.id, name: r.objective,
      rows: [
        { k: 'Stories in scope', v: r.stories.join(' · ') },
        { k: 'Explicitly excluded', v: { pairs: r.excluded.map(function (e) { return { k: e.item, v: e.why }; }) } },
        { k: 'Dependencies', v: { list: r.dependencies } },
        { k: 'Release criteria', v: { list: r.criteria } },
        { k: 'Decision', v: r.decision },
        { k: 'Deployment', v: r.deployment },
        { k: 'Production verification', v: { list: r.prodVerification } },
        { k: 'Closed', v: r.closed }
      ],
      foot: [{ k: 'Owner', v: 'Delivery lead' }, { k: 'System of record', v: 'Release record' }, { k: 'Not', v: 'A hierarchy level' }]
    }});
  };

  R.prodverify = function () {
    return '<div class="block">' + blockTitle('Production verification — REL-24.3') + '<div class="panel">' +
      ul(E.release.prodVerification.map(esc)) +
      '<p style="margin-top:12px;color:var(--ink-3);font-size:13px">Each line checks something that was predicted before the release: the smoke path, the NFR from REQ-06, the metric added by SD-42, and the cost consequence accepted in ADR-014.</p>' +
      '</div></div>';
  };

  R.cycle = function () {
    const nodes = ['Production', 'Monitor', 'Observe', 'Feedback · Bug · Incident', 'New requirement', 'Refine'];
    const out = [];
    nodes.forEach(function (n, i) {
      if (i) out.push(arrowDown());
      out.push('<div class="flow__node' + (i === nodes.length - 1 ? ' flow__node--accent' : '') + '"><b>' + esc(n) + '</b></div>');
    });
    out.push('<div class="flow__loop">↺ and onward through the lifecycle again</div>');
    return '<div class="block">' + blockTitle('The lifecycle is circular') + '<div class="flow">' + out.join('') + '</div></div>';
  };

  R.signals = function () {
    return '<div class="block">' + blockTitle('Signals from REL-24.3') + '<div class="panel">' +
      E.operate.signals.map(function (s) {
        return '<div class="arow" style="padding:11px 0;border-bottom:1px solid var(--rule)">' +
          '<div class="arow__k">' + esc(s.kind) + '</div><div class="arow__v">' + esc(s.text) +
          '<br><span style="color:var(--accent-ink)">→ ' + esc(s.action) + '</span></div></div>';
      }).join('') + '</div></div>';
  };

  R.trace = function () {
    return '<div class="block">' + blockTitle('Traceability — one thread, end to end') + '<div class="panel"><div class="trace">' +
      E.traceChain.map(function (t) {
        return '<div class="trace__link"><div class="trace__k">' + esc(t.k) + '</div><div class="trace__v">' + esc(t.v) + '<span class="id">' + esc(t.id) + '</span></div></div>';
      }).join('') + '</div></div></div>';
  };

  R.brief = function () {
    return '<div class="block"><div class="artifact">' +
      '<div class="artifact__head"><span class="artifact__type">Raw request</span><span class="artifact__id">SIM-01</span>' +
      '<span class="artifact__name">"Customers need an easier way to manage their projects."</span></div>' +
      '<div class="artifact__body">' +
      '<div class="arow"><div class="arow__k">Source</div><div class="arow__v">Head of Customer Success, forwarded from three separate account conversations this month.</div></div>' +
      '<div class="arow"><div class="arow__k">What you know</div><div class="arow__v">' + ul([
        'Atlas projects are created one at a time, from scratch.',
        'Projects cannot be renamed after creation without contacting support.',
        'There is no way to archive a finished project — it stays in the active list forever.',
        'The largest accounts have several hundred projects, most of them finished.',
        'The same architecture context as INIT-42 applies: modular monolith, Delivery module owns projects, Workspace module renders the list, ADR-006 forbids cross-module table reads.'
      ].map(esc)) + '</div></div>' +
      '<div class="arow"><div class="arow__k">Your instruction</div><div class="arow__v"><strong>You are the delivery team. Start at Discover.</strong> No worked example will be shown before you commit an answer.</div></div>' +
      '</div></div></div>';
  };

  R.quickref = function () {
    return '<div class="block">' + M.quickReference.map(function (q) {
      return '<div class="panel" style="margin-bottom:10px">' +
        '<div style="display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;margin-bottom:10px">' +
        '<span style="font:600 11px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--accent-ink)">' + esc(q.stage) + '</span>' +
        '<span style="font-family:var(--serif);font-style:italic;font-size:16px">' + esc(q.q) + '</span></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:11px">' +
        q.steps.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>' +
        '<div class="arow"><div class="arow__k">Gate</div><div class="arow__v">' + esc(q.gate) + '</div></div>' +
        '<div class="arow" style="margin-top:6px"><div class="arow__k">Evidence</div><div class="arow__v">' + esc(q.evidence) + '</div></div>' +
        '</div>';
    }).join('') + '</div>';
  };

  R.artifactstandards = function () {
    return '<div class="block">' + M.artifacts.map(function (a) {
      return reveal('as-' + a.id, a.name,
        '<p>' + necessityChip(a.necessity) + '</p>' +
        field('Purpose', '<p>' + esc(a.purpose) + '</p>') +
        field('Inputs', ul(a.inputs.map(esc))) +
        field('Creation', '<p>' + esc(a.creation) + '</p>') +
        field('Quality', ul(a.quality.map(esc))) +
        field('Anti-pattern', '<p style="color:var(--fail)">' + esc(a.antipattern) + '</p>') +
        field('Evidence', '<p>' + esc(a.evidence) + '</p>') +
        field('Owner', '<p>' + esc(a.owner) + '</p>') +
        field('Record in', '<p>' + esc(a.sor) + '</p>') +
        field('Connects', '<p>' + esc(a.relationships) + '</p>') +
        field('Lifecycle', '<p>' + esc(a.lifecycle) + '</p>'));
    }).join('') + '</div>';
  };

  R.sortable = function () {
    return '<div class="block"><table class="cmp"><thead><tr><th>Artifact</th><th>System of record</th><th>Note</th></tr></thead><tbody>' +
      M.systemsOfRecord.map(function (r) {
        return '<tr><th scope="row">' + esc(r.item) + '</th><td>' + esc(r.sor) + '</td><td>' + esc(r.note) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  R.antipatterns = function () {
    return '<div class="block">' + M.antipatterns.map(function (a) {
      return reveal('ap-' + a.id, a.name,
        '<div class="badgood"><div class="bgcard bgcard--bad"><div class="bgcard__h">Bad</div><div class="bgcard__b"><span class="q">' + esc(a.bad) + '</span></div></div>' +
        '<div class="bgcard bgcard--good"><div class="bgcard__h">Good</div><div class="bgcard__b"><span class="q">' + esc(a.good) + '</span></div></div></div>' +
        '<p style="margin-top:12px"><strong>Why it fails:</strong> ' + esc(a.why) + '</p>' +
        '<p><strong>The repair:</strong> ' + esc(a.repair) + '</p>');
    }).join('') + '</div>';
  };

  R.allchecklists = function () {
    const out = [];
    window.BOOK.chapters.forEach(function (c) {
      c.sections.forEach(function (s) {
        (s.blocks || []).forEach(function (b) {
          if (b.type === 'checklist') out.push(R.checklist(b));
        });
      });
    });
    return out.join('');
  };

  R.checklist = function (b) {
    const st = window.State.getIn('checklists.' + b.id, {});
    const done = Object.keys(st).filter(function (k) { return st[k]; }).length;
    return '<div class="block"><div class="checklist" data-checklist="' + esc(b.id) + '">' +
      '<div class="checklist__h"><span class="checklist__t">' + esc(b.title) + '</span><span class="checklist__count">' + done + ' / ' + b.items.length + '</span></div>' +
      '<ul class="checklist__list">' + b.items.map(function (it, i) {
        return '<li><label class="cbox"><input type="checkbox" data-ci="' + i + '"' + (st[i] ? ' checked' : '') + '>' +
          '<span class="cbox__box" aria-hidden="true">' + tick() + '</span><span class="cbox__t">' + esc(it) + '</span></label></li>';
      }).join('') + '</ul></div></div>';
  };

  /* ---- gate story (worked gate failure) ---- */

  R.gatestory = function (b) {
    const a1 = b.data.attempt1, a2 = b.data.attempt2;
    return '<div class="block"><div class="gate">' +
      '<div class="gate__head"><div class="gate__kind">Attempt 1 — Failed</div><div class="gate__title">Failed condition: ' + esc(a1.failed) + '</div></div>' +
      '<div class="gate__body">' +
      '<div class="gcheck is-fail is-shown"><div class="gcheck__q">What the condition found</div><div class="gcheck__cond">' + esc(a1.detail) + '</div>' +
      '<div class="gcheck__fb"><span class="lbl fail">Failure path</span>' +
      '<dl><dt>Return to</dt><dd>' + esc(a1.returnTo) + '</dd>' +
      '<dt>Correction</dt><dd>' + esc(a1.correction) + '</dd>' +
      '<dt>Owner</dt><dd>' + esc(a1.owner) + '</dd>' +
      '<dt>Cost</dt><dd>' + esc(a1.cost) + '</dd></dl></div></div>' +
      '<div class="callout callout--note"><span class="callout__label">Nearly missed</span><p>' + esc(a1.otherAtRisk) + '</p></div>' +
      '</div>' +
      '<div class="gate__verdict pass is-on"><h4>Attempt 2 — Pass</h4><p>' + esc(a2.detail) + '</p><p style="color:var(--ink-3)">' + esc(a2.note) + '</p></div>' +
      '</div></div>';
  };

  /* ---- slicing patterns ---- */

  R.slicepatterns = function () {
    const pats = [
      { k: 'By workflow step', d: 'Create · Rename · Archive. Each step of a journey is usually separately valuable.', ex: 'Used for FEAT-21: see the list, open an item, acknowledge an item.' },
      { k: 'By rule or variation', d: 'Handle the simple rule first, the exceptions later.', ex: 'Calendar-day classification shipped first; working-day and holiday handling followed as their own work.' },
      { k: 'By data scope', d: 'One project, then a portfolio, then an account.', ex: 'Risk within a project before risk across a portfolio.' },
      { k: 'By quality attribute', d: 'Make it work, then make it hold at scale — where the second is real work with its own acceptance.', ex: 'STORY-114 then STORY-115.' },
      { k: 'By interface surface', d: 'Only where surfaces have genuinely different value, not merely different widths.', ex: 'FEAT-22 (project list) separate from FEAT-21 (portfolio view).' },
      { k: 'By happy path then failure path', d: 'Use with care. Legitimate when failure handling is substantial work; illegitimate when it means shipping without an empty state.', ex: 'Never used to defer permission or empty states — those are acceptance criteria, not Stories.' }
    ];
    return '<div class="block">' + blockTitle('Ways to slice — and none of them is by layer') + '<div class="panel">' +
      pats.map(function (p) {
        return '<div class="arow" style="padding:10px 0;border-bottom:1px solid var(--rule)"><div class="arow__k">' + esc(p.k) + '</div>' +
          '<div class="arow__v">' + esc(p.d) + '<br><span style="color:var(--ink-4)">' + esc(p.ex) + '</span></div></div>';
      }).join('') + '</div></div>';
  };

  /* ---- assessment ---- */

  R.assessment = function () {
    return '<div class="block" data-assessment><div class="assess">' +
      window.BOOK.capabilities.map(function (c) {
        const v = window.State.capabilityVerdict(c);
        return '<div class="acap"><div class="acap__n">' + esc(c.name) + '</div><div class="acap__v ' + v.v + '">' + esc(v.label) + '</div></div>';
      }).join('') + '</div></div>';
  };

  /* ---- decision tree ---- */

  R.dtree = function (b) {
    const rule = M.decisionRules.find(function (r) { return r.id === b.ruleId; });
    return '<div class="block">' + blockTitle('Decision rule') +
      '<div class="dtree" data-dtree="' + esc(rule.id) + '">' +
      '<div class="dnode__q" style="font-family:var(--serif);font-size:19px">' + esc(rule.name) + '</div>' +
      '<div class="dnode__help">' + esc(rule.summary) + '</div>' +
      '<div class="dtree__body"></div></div></div>';
  };

  function renderDtreeBody(el, ruleId) {
    const rule = M.decisionRules.find(function (r) { return r.id === ruleId; });
    const path = window.State.getIn('dtree.' + ruleId, []);
    let node = rule.tree;
    const crumbs = [];
    for (let i = 0; i < path.length; i++) {
      const opt = node.options[path[i]];
      if (!opt) break;
      crumbs.push(opt.label);
      if (opt.result) { node = { result: opt.result }; break; }
      node = opt.next;
    }

    let html = '';
    if (crumbs.length) {
      html += '<div class="dpath">' + crumbs.map(function (c) { return '<span class="dpath__crumb">' + esc(c) + '</span>'; }).join('<span>→</span>') +
        ' <button class="btn btn--ghost" data-dreset style="padding:4px 9px">Start over</button></div>';
    }
    if (node.result) {
      const r = node.result;
      html += '<div class="dresult"><div class="dresult__k">Outcome</div><div class="dresult__v">' + esc(r.verdict) + '</div>' +
        '<p style="margin:9px 0 0;font-size:13.5px;color:var(--ink-2)">' + esc(r.detail) + '</p>' +
        '<div class="dresult__do"><div class="dresult__k">' + esc(r.doLabel || 'Do this') + '</div>' + ul(r.do.map(esc)) + '</div></div>';
    } else {
      html += '<div class="dnode__q">' + esc(node.q) + '</div>' +
        (node.help ? '<div class="dnode__help">' + esc(node.help) + '</div>' : '') +
        '<div class="dnode__opts">' + node.options.map(function (o, i) {
          return '<button class="choicebtn" data-dopt="' + i + '"><span class="choicebtn__mark" aria-hidden="true"></span><span>' + esc(o.label) + '</span></button>';
        }).join('') + '</div>';
    }
    el.innerHTML = html;
  }

  /* ---- exercises ---- */

  R.exercise = function (b) {
    const scafMap = { classify: 'Classification', choice: 'Scenario', order: 'Sequencing', build: 'Produce an artifact' };
    const head = '<div class="exercise__head"><span class="exercise__kind">' + esc(scafMap[b.kind] || 'Exercise') + '</span>' +
      '<span class="exercise__scaf">Exercise</span><span class="exercise__prompt">' + esc(b.prompt) + '</span></div>';
    let body = '';
    if (b.kind === 'classify') body = exClassify(b);
    else if (b.kind === 'choice') body = exChoice(b);
    else if (b.kind === 'order') body = exOrder(b);
    else if (b.kind === 'build') body = exBuild(b);
    return '<div class="block"><div class="exercise" data-ex="' + esc(b.id) + '" data-kind="' + esc(b.kind) + '">' + head + '<div class="exercise__body">' + body + '</div></div></div>';
  };

  function exClassify(b) {
    const saved = window.State.getIn('answers.' + b.id, null);
    const checked = !!saved;
    return '<div class="classify">' + b.items.map(function (it, i) {
      const picked = saved ? saved[i] : null;
      const right = picked === it.answer;
      const cls = checked ? (right ? ' is-right is-checked' : ' is-wrong is-checked') : '';
      return '<div class="citem' + cls + '" data-ci="' + i + '" data-answer="' + esc(it.answer) + '">' +
        '<div class="citem__text">' + esc(it.text) + '</div>' +
        '<div class="citem__opts">' + b.buckets.map(function (bu) {
          const isPicked = picked === bu.id;
          const isAnswer = checked && !right && bu.id === it.answer;
          return '<button class="opt' + (isPicked ? ' is-picked' : '') + (isAnswer ? ' is-answer' : '') + '" data-bucket="' + esc(bu.id) + '"' + (checked ? ' disabled' : '') + '>' + esc(bu.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="citem__fb"><span class="citem__verdict">' + (right ? 'Correct' : 'Not quite') + '</span>' + esc(it.explain) + '</div>' +
        '</div>';
    }).join('') + '</div>' +
      '<div class="exercise__actions"><button class="btn btn--primary" data-act="check"' + (checked ? ' disabled' : '') + '>Check answers</button>' +
      '<button class="btn btn--ghost" data-act="reset">Try again</button>' +
      '<span class="exercise__scaf" data-score></span></div>';
  }

  function exChoice(b) {
    const saved = window.State.getIn('answers.' + b.id, null);
    const checked = saved !== null && saved !== undefined;
    return (b.scenario ? '<div class="choice__scenario"><span class="lbl">Scenario</span>' + esc(b.scenario) + '</div>' : '') +
      '<div class="choice">' + b.options.map(function (o, i) {
        let cls = 'choicebtn';
        if (checked) {
          cls += ' show-fb';
          if (saved === i) cls += o.correct ? ' is-correct' : ' is-incorrect';
          else if (o.correct) cls += ' is-correct';
          if (saved === i) cls += ' is-picked';
        }
        return '<button class="' + cls + '" data-opt="' + i + '"' + (checked ? ' disabled' : '') + '>' +
          '<span class="choicebtn__mark" aria-hidden="true"></span><span>' + esc(o.text) + '</span>' +
          '<span class="choicebtn__fb">' + esc(o.explain) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="exercise__actions"><button class="btn btn--ghost" data-act="reset">Try again</button></div>';
  }

  function exOrder(b) {
    const saved = window.State.getIn('answers.' + b.id, null);
    const order = saved ? saved.order : shuffleStable(b.items.map(function (_, i) { return i; }), b.id);
    const checked = !!saved && saved.checked;
    return '<div class="order">' + order.map(function (idx, pos) {
      const it = b.items[idx];
      let cls = 'oitem';
      if (checked) cls += (idx === pos ? ' is-right' : ' is-wrong');
      return '<div class="' + cls + '" data-idx="' + idx + '" draggable="true">' +
        '<span class="oitem__n">' + String(pos + 1).padStart(2, '0') + '</span>' +
        '<span>' + esc(it.text) + '</span>' +
        '<span class="oitem__move"><button class="movebtn" data-move="up" aria-label="Move up">↑</button><button class="movebtn" data-move="down" aria-label="Move down">↓</button></span>' +
        '</div>';
    }).join('') + '</div>' +
      (checked ? '<div class="callout callout--note" style="margin-top:14px"><span class="callout__label">Why this order</span><p>' + esc(b.explain) + '</p></div>' : '') +
      '<div class="exercise__actions"><button class="btn btn--primary" data-act="check"' + (checked ? ' disabled' : '') + '>Check order</button><button class="btn btn--ghost" data-act="reset">Start over</button></div>';
  }

  function shuffleStable(arr, seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      h = (h * 1103515245 + 12345) >>> 0;
      const j = h % (i + 1);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    // never return the correct order
    if (a.every(function (v, i) { return v === i; }) && a.length > 1) { const t = a[0]; a[0] = a[1]; a[1] = t; }
    return a;
  }

  function exBuild(b) {
    const saved = window.State.getIn('answers.' + b.id, {});
    const revealed = window.State.getIn('reveals.sample-' + b.id, false);
    return (b.brief ? '<div class="choice__scenario"><span class="lbl">Brief</span>' + b.brief + '</div>' : '') +
      '<div class="build">' + b.fields.map(function (f) {
        return '<div class="bfield" data-bf="' + esc(f.id) + '">' +
          '<label class="bfield__label" for="' + esc(b.id + '-' + f.id) + '">' + esc(f.label) + '</label>' +
          '<div class="bfield__hint">' + esc(f.hint) + '</div>' +
          '<textarea id="' + esc(b.id + '-' + f.id) + '" rows="' + (f.rows || 3) + '">' + esc(saved[f.id] || '') + '</textarea>' +
          '<div class="bfield__fb"></div></div>';
      }).join('') + '</div>' +
      '<div class="exercise__actions"><button class="btn btn--primary" data-act="check">Check my work</button>' +
      '<button class="btn" data-act="sample"' + '>' + (revealed ? 'Hide' : 'Show') + ' the expert answer</button>' +
      '<button class="btn btn--ghost" data-act="reset">Clear</button></div>' +
      '<div class="sample" data-sample' + (revealed ? '' : ' hidden') + '>' +
      '<div class="panel panel--sunk"><div class="opcell__k" style="margin-bottom:10px">' + esc(b.sampleLabel || 'Expert answer') + '</div>' +
      b.sample.map(function (s) { return '<div class="arow" style="padding:7px 0"><div class="arow__k">' + esc(s.k) + '</div><div class="arow__v">' + esc(s.v) + '</div></div>'; }).join('') +
      '</div></div>';
  }

  function runChecks(field, text) {
    const t = (text || '').trim();
    const lower = t.toLowerCase();
    const words = t ? t.split(/\s+/).length : 0;
    const issues = [];
    (field.checks || []).forEach(function (c) {
      let failed = false;
      if (c.type === 'minWords') failed = words < c.value;
      else if (c.type === 'includesAny') failed = !c.value.some(function (v) { return lower.indexOf(String(v).toLowerCase()) !== -1; });
      else if (c.type === 'includesAll') failed = !c.value.every(function (v) { return lower.indexOf(String(v).toLowerCase()) !== -1; });
      else if (c.type === 'excludesAny') failed = c.value.some(function (v) { return lower.indexOf(String(v).toLowerCase()) !== -1; });
      else if (c.type === 'includesDigit') failed = !/\d/.test(t);
      if (failed) issues.push({ level: c.level, msg: c.msg });
    });
    if (!t) return { level: 'bad', issues: [{ level: 'bad', msg: 'Nothing written yet. Commit an answer before checking — the expert answer is worth much less if you read it first.' }] };
    const bad = issues.some(function (i) { return i.level === 'bad'; });
    const warn = issues.some(function (i) { return i.level === 'warn'; });
    return { level: bad ? 'bad' : (warn ? 'warn' : 'ok'), issues: issues };
  }

  /* ---- gate ---- */

  R.gate = function (b) {
    const saved = window.State.getIn('gateResults.' + b.id, null);
    return '<div class="block"><div class="gate" data-gate="' + esc(b.id) + '">' +
      '<div class="gate__head"><div class="gate__kind">Gate · decision mechanism</div>' +
      '<div class="gate__title">' + esc(b.title) + '</div><div class="gate__sub">' + esc(b.sub) + '</div></div>' +
      '<div class="gate__body">' + b.checks.map(function (c) {
        const a = saved ? saved.answers[c.id] : null;
        const shown = a != null;
        const pass = a === 'yes';
        return '<div class="gcheck' + (shown ? (pass ? ' is-pass is-shown' : ' is-fail is-shown') : '') + '" data-gc="' + esc(c.id) + '">' +
          '<div class="gcheck__q">' + esc(c.q) + '</div><div class="gcheck__cond">' + esc(c.cond) + '</div>' +
          '<div class="gcheck__opts">' +
          '<button class="opt' + (a === 'yes' ? ' is-picked' : '') + '" data-ga="yes">Yes — condition met</button>' +
          '<button class="opt' + (a === 'no' ? ' is-picked' : '') + '" data-ga="no">No — not yet</button>' +
          '</div>' +
          '<div class="gcheck__fb">' +
          (pass
            ? '<span class="lbl pass">Condition met</span><p style="margin:0">Recorded. This condition does not need re-evaluating unless a later correction touches it.</p>'
            : '<span class="lbl fail">Condition failed</span><p style="margin:0">' + esc(c.fail.what) + '</p>' +
              '<dl><dt>Return to</dt><dd>' + esc(c.fail.returnTo) + '</dd>' +
              '<dt>Correct</dt><dd>' + esc(c.fail.correct) + '</dd>' +
              '<dt>Recheck</dt><dd>' + esc(c.fail.recheck) + '</dd>' +
              '<dt>Owner</dt><dd>' + esc(c.fail.owner) + '</dd></dl>') +
          '</div></div>';
      }).join('') +
      '<div class="exercise__actions"><button class="btn btn--primary" data-act="rungate">Evaluate the gate</button>' +
      '<button class="btn btn--ghost" data-act="resetgate">Run it again</button>' +
      '<span class="exercise__scaf" data-gatecount>' + (saved ? 'Attempt ' + saved.attempts : '') + '</span></div>' +
      '</div>' +
      '<div class="gate__verdict" data-verdict></div>' +
      '</div></div>';
  };

  /* ---------- dispatch ---------- */

  function render(block) {
    const fn = R[block.type];
    if (!fn) return '<div class="block"><div class="callout callout--warning"><p>Unknown block type: ' + esc(block.type) + '</p></div></div>';
    return fn(block);
  }

  /* ---------- hydration ---------- */

  function hydrate(root, ctx) {
    const S = window.State;

    /* reveals */
    root.querySelectorAll('[data-reveal]').forEach(function (el) {
      const id = el.getAttribute('data-reveal');
      const btn = el.querySelector('.reveal__btn');
      if (S.getIn('reveals.' + id, false)) { el.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); btn.querySelector('.reveal__sign').textContent = '–'; }
      btn.addEventListener('click', function () {
        const open = el.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('.reveal__sign').textContent = open ? '–' : '+';
        S.setIn('reveals.' + id, open);
      });
    });

    /* procedure steps */
    root.querySelectorAll('.step').forEach(function (el) {
      const btn = el.querySelector('.step__head');
      btn.addEventListener('click', function () {
        const open = el.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* checklists */
    root.querySelectorAll('[data-checklist]').forEach(function (el) {
      const id = el.getAttribute('data-checklist');
      el.addEventListener('change', function (e) {
        const cb = e.target.closest('input[data-ci]');
        if (!cb) return;
        S.setIn('checklists.' + id + '.' + cb.getAttribute('data-ci'), cb.checked);
        const st = S.getIn('checklists.' + id, {});
        const done = Object.keys(st).filter(function (k) { return st[k]; }).length;
        el.querySelector('.checklist__count').textContent = done + ' / ' + el.querySelectorAll('input[data-ci]').length;
      });
    });

    /* decision trees */
    root.querySelectorAll('[data-dtree]').forEach(function (el) {
      const ruleId = el.getAttribute('data-dtree');
      const body = el.querySelector('.dtree__body');
      renderDtreeBody(body, ruleId);
      el.addEventListener('click', function (e) {
        const opt = e.target.closest('[data-dopt]');
        if (opt) {
          const path = S.getIn('dtree.' + ruleId, []).slice();
          path.push(parseInt(opt.getAttribute('data-dopt'), 10));
          S.setIn('dtree.' + ruleId, path);
          renderDtreeBody(body, ruleId);
          return;
        }
        if (e.target.closest('[data-dreset]')) {
          S.setIn('dtree.' + ruleId, []);
          renderDtreeBody(body, ruleId);
        }
      });
    });

    /* exercises */
    root.querySelectorAll('[data-ex]').forEach(function (el) {
      const id = el.getAttribute('data-ex');
      const kind = el.getAttribute('data-kind');
      const block = ctx.blockIndex[id];
      if (!block) return;
      if (kind === 'classify') hydrateClassify(el, block);
      else if (kind === 'choice') hydrateChoice(el, block);
      else if (kind === 'order') hydrateOrder(el, block);
      else if (kind === 'build') hydrateBuild(el, block);
    });

    /* gates */
    root.querySelectorAll('[data-gate]').forEach(function (el) {
      hydrateGate(el, ctx.blockIndex[el.getAttribute('data-gate')]);
    });
  }

  function hydrateClassify(el, b) {
    const S = window.State;
    const picks = {};
    const saved = S.getIn('answers.' + b.id, null);
    if (saved) Object.keys(saved).forEach(function (k) { picks[k] = saved[k]; });

    el.addEventListener('click', function (e) {
      const opt = e.target.closest('.opt');
      if (opt && !opt.disabled) {
        const item = opt.closest('.citem');
        item.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('is-picked'); });
        opt.classList.add('is-picked');
        picks[item.getAttribute('data-ci')] = opt.getAttribute('data-bucket');
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.getAttribute('data-act') === 'check') {
        if (Object.keys(picks).length < b.items.length) { window.App.toast('Answer every item before checking.'); return; }
        S.setIn('answers.' + b.id, picks);
        let right = 0;
        b.items.forEach(function (it, i) { if (picks[i] === it.answer) right++; });
        S.setIn('exerciseStatus.' + b.id, right === b.items.length ? 'correct' : (right >= b.items.length * 0.6 ? 'partial' : 'incorrect'));
        S.setIn('failedChecks.' + b.id, b.items.map(function (it, i) { return picks[i] === it.answer ? null : i; }).filter(function (x) { return x !== null; }));
        window.App.rerender();
        window.App.toast(right + ' of ' + b.items.length + ' correct — read every explanation, including the ones you got right.');
      } else {
        S.setIn('answers.' + b.id, null);
        S.setIn('exerciseStatus.' + b.id, null);
        window.App.rerender();
      }
    });
  }

  function hydrateChoice(el, b) {
    const S = window.State;
    el.addEventListener('click', function (e) {
      const opt = e.target.closest('[data-opt]');
      if (opt && !opt.disabled) {
        const i = parseInt(opt.getAttribute('data-opt'), 10);
        S.setIn('answers.' + b.id, i);
        S.setIn('exerciseStatus.' + b.id, b.options[i].correct ? 'correct' : 'incorrect');
        window.App.rerender();
        return;
      }
      const act = e.target.closest('[data-act]');
      if (act) {
        S.setIn('answers.' + b.id, null);
        S.setIn('exerciseStatus.' + b.id, null);
        window.App.rerender();
      }
    });
  }

  function hydrateOrder(el, b) {
    const S = window.State;
    const list = el.querySelector('.order');

    function currentOrder() {
      return Array.prototype.map.call(list.querySelectorAll('.oitem'), function (n) { return parseInt(n.getAttribute('data-idx'), 10); });
    }
    function renumber() {
      list.querySelectorAll('.oitem').forEach(function (n, i) { n.querySelector('.oitem__n').textContent = String(i + 1).padStart(2, '0'); });
    }

    el.addEventListener('click', function (e) {
      const mv = e.target.closest('[data-move]');
      if (mv) {
        const item = mv.closest('.oitem');
        if (mv.getAttribute('data-move') === 'up' && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
        if (mv.getAttribute('data-move') === 'down' && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
        renumber();
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.getAttribute('data-act') === 'check') {
        const order = currentOrder();
        const correct = order.every(function (v, i) { return v === i; });
        S.setIn('answers.' + b.id, { order: order, checked: true });
        S.setIn('exerciseStatus.' + b.id, correct ? 'correct' : 'incorrect');
        window.App.rerender();
        window.App.toast(correct ? 'Correct order.' : 'Not yet — the explanation below says why this order and not another.');
      } else {
        S.setIn('answers.' + b.id, null);
        S.setIn('exerciseStatus.' + b.id, null);
        window.App.rerender();
      }
    });

    let dragged = null;
    list.addEventListener('dragstart', function (e) {
      const it = e.target.closest('.oitem'); if (!it) return;
      dragged = it; it.classList.add('is-dragging');
    });
    list.addEventListener('dragend', function () { if (dragged) dragged.classList.remove('is-dragging'); dragged = null; renumber(); });
    list.addEventListener('dragover', function (e) {
      e.preventDefault();
      const over = e.target.closest('.oitem');
      if (!over || !dragged || over === dragged) return;
      const rect = over.getBoundingClientRect();
      const after = (e.clientY - rect.top) > rect.height / 2;
      list.insertBefore(dragged, after ? over.nextElementSibling : over);
    });
  }

  function hydrateBuild(el, b) {
    const S = window.State;
    el.addEventListener('input', function (e) {
      const ta = e.target.closest('textarea'); if (!ta) return;
      const fid = ta.closest('.bfield').getAttribute('data-bf');
      S.setIn('answers.' + b.id + '.' + fid, ta.value);
    });
    el.addEventListener('click', function (e) {
      const act = e.target.closest('[data-act]'); if (!act) return;
      const a = act.getAttribute('data-act');

      if (a === 'check') {
        let worst = 'ok';
        b.fields.forEach(function (f) {
          const wrap = el.querySelector('[data-bf="' + f.id + '"]');
          const text = wrap.querySelector('textarea').value;
          const res = runChecks(f, text);
          const fb = wrap.querySelector('.bfield__fb');
          fb.className = 'bfield__fb is-on ' + res.level;
          if (res.level === 'ok') {
            fb.innerHTML = '<strong>Holds up.</strong> Nothing in this answer trips the checks. Compare it against the expert answer for rigour, not wording.';
          } else {
            fb.innerHTML = '<strong>' + (res.level === 'bad' ? 'Needs correction' : 'Worth another look') + '</strong>' + ul(res.issues.map(function (i) { return esc(i.msg); }));
          }
          if (res.level === 'bad') worst = 'bad';
          else if (res.level === 'warn' && worst !== 'bad') worst = 'warn';
        });
        S.setIn('exerciseStatus.' + b.id, worst === 'ok' ? 'correct' : (worst === 'warn' ? 'partial' : 'incorrect'));
        window.App.toast(worst === 'ok' ? 'Your answer passes every check. Now compare it with the expert answer.' : 'Some checks did not pass — read the feedback before revealing the expert answer.');
        return;
      }

      if (a === 'sample') {
        const s = el.querySelector('[data-sample]');
        const now = s.hasAttribute('hidden');
        if (now) s.removeAttribute('hidden'); else s.setAttribute('hidden', '');
        act.textContent = (now ? 'Hide' : 'Show') + ' the expert answer';
        S.setIn('reveals.sample-' + b.id, now);
        return;
      }

      if (a === 'reset') {
        S.setIn('answers.' + b.id, {});
        S.setIn('exerciseStatus.' + b.id, null);
        window.App.rerender();
      }
    });
  }

  function hydrateGate(el, b) {
    const S = window.State;
    const answers = {};
    const saved = S.getIn('gateResults.' + b.id, null);
    if (saved) Object.keys(saved.answers).forEach(function (k) { answers[k] = saved.answers[k]; });

    function paintVerdict(status, failed) {
      const v = el.querySelector('[data-verdict]');
      v.className = 'gate__verdict is-on ' + (status === 'pass' ? 'pass' : 'fail');
      if (status === 'pass') {
        v.innerHTML = '<h4>Gate passed</h4><p>' + esc(b.passText) + '</p>';
      } else {
        const names = failed.map(function (id) { return b.checks.find(function (c) { return c.id === id; }).q; });
        v.innerHTML = '<h4>Gate failed — ' + failed.length + ' condition' + (failed.length > 1 ? 's' : '') + '</h4>' +
          '<p>' + esc(b.failText) + '</p>' + ul(names.map(esc)) +
          '<div class="gate__loop">' +
          '<div class="flow__node"><b>Fail</b><small>Identify the missing condition — each is named above</small></div>' + arrowDown() +
          '<div class="flow__node"><b>Return</b><small>Go to the step the condition names</small></div>' + arrowDown() +
          '<div class="flow__node"><b>Correct</b><small>Fix the artifact, with the named owner</small></div>' + arrowDown() +
          '<div class="flow__node"><b>Recheck</b><small>Re-evaluate the failed conditions and anything the correction touched</small></div>' + arrowDown() +
          '<div class="flow__node flow__node--accent"><b>Pass</b><small>Record the result, including the failure and the correction</small></div>' +
          '</div>';
      }
    }

    if (saved) paintVerdict(saved.status, saved.failed || []);

    el.addEventListener('click', function (e) {
      const ga = e.target.closest('[data-ga]');
      if (ga) {
        const check = ga.closest('.gcheck');
        check.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('is-picked'); });
        ga.classList.add('is-picked');
        answers[check.getAttribute('data-gc')] = ga.getAttribute('data-ga');
        return;
      }
      const act = e.target.closest('[data-act]'); if (!act) return;

      if (act.getAttribute('data-act') === 'rungate') {
        if (Object.keys(answers).length < b.checks.length) { window.App.toast('Answer every condition. A gate you part-answer is a gate you did not run.'); return; }
        const failed = b.checks.filter(function (c) { return answers[c.id] !== 'yes'; }).map(function (c) { return c.id; });
        const status = failed.length ? 'fail' : 'pass';
        S.recordGate(b.id, { status: status, answers: answers, failed: failed });
        window.App.rerender();
        window.App.toast(status === 'pass' ? 'Gate passed and recorded.' : 'Gate failed — each condition names its return point.');
      } else {
        S.setIn('gateResults.' + b.id, null);
        window.App.rerender();
      }
    });
  }

  return { render: render, hydrate: hydrate, esc: esc };
})();
