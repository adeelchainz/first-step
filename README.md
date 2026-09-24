# The Delivery Model — Interactive Field Manual

A self-contained, offline interactive handbook that teaches a software delivery operating model
end to end, and teaches the reader to *operate* it — not just recognise it.

Open `index.html` in a browser. No build, no server, no dependencies, no network required.

---

## The three modes

| Mode | What it does |
|---|---|
| **Learn** | Sequential guided walkthrough of all 16 chapters, with progressive scaffolding. |
| **Reference** | Direct access to the quick reference, decision rules, artifact standards, systems of record, anti-patterns and every checklist. |
| **Practice** | Chapter 15 — the independent simulation, with minimal scaffolding. |

Keyboard: `→`/`j` continue · `←`/`k` back · `/` reference lookup · `m` model map · `Esc` close.

Progress, answers, gate results and checklist ticks persist in browser storage per device.
Clear them from **Model map → Reset all progress**.

---

## File layout

```
index.html              Application shell
styles/app.css          Design system — tokens, layout, all block styles
content/
  model.js              THE OPERATING MODEL — hierarchy, lifecycle, artifacts,
                        decision rules, anti-patterns, systems of record, quick reference
  example.js            THE CONTINUOUS EXAMPLE — one initiative, raw signal to production
  chapters-a.js         Chapters 01–05
  chapters-b.js         Chapters 06–10
  chapters-c.js         Chapters 11–16
  book.js               Assembles chapters, journey groups, lookup index, capability map
js/
  state.js              Explicit application state + persistence + capability assessment
  blocks.js             Block renderers and interaction hydration
  app.js                Shell, navigation, modes, progression, overlays
```

Content is data. Presentation is code. The two do not mix: you can rewrite the operating model
in `content/model.js` without touching a renderer.

---

## Editing the model

**Change the model itself** — `content/model.js` holds `hierarchy`, `lifecycle`, `notLevels`,
`models`, `artifacts`, `decisionRules`, `antipatterns`, `responsibility`, `systemsOfRecord`,
`quickReference`. Chapters 01, 02, 06 and 16 render straight from these, and so does the
reference lookup, so a change there propagates everywhere.

**Change the worked example** — `content/example.js`. Keep the ids consistent
(`INIT-42`, `REQ-nn`, `STORY-nnn`, `AC-n`, `TC-…`, `REL-…`); the chapters reference them by id
and the traceability chain is assembled from them.

**Change a lesson** — the chapter files. A chapter is:

```js
{ id, num, title, kicker, question, intro, stage, scaffold,
  sections: [ { id, title, kicker, lede, blocks: [ … ] } ] }
```

`stage` ties a chapter to a lifecycle stage for the progress rail. `scaffold` is
`high` → `moderate` → `low` → `none` across the book.

---

## Block types

Every block is `{ type: '…', …fields }`. Renderers live in `js/blocks.js` as `R.<type>`.
Adding a type means adding one renderer function — nothing else.

**Exposition** — `prose`, `callout` (`principle`/`warning`/`note`), `flow`, `layers`,
`steplist`, `compare`, `versus`, `propgrid`, `fourup`, `reveals`, `transform`, `claimevidence`,
`badgood`, `activitytable`, `notrelease`, `slicepatterns`.

**Model views** (render from `model.js`) — `twoflows`, `hierarchy`, `hierarchydetail`,
`lifecycle`, `notlevels`, `models`, `necessity`, `opmodel`, `responsibility`, `gateshape`,
`quickref`, `artifactstandards`, `sortable`, `antipatterns`, `allchecklists`.

**Example views** (render from `example.js`) — `artifactcard`, `storycard`, `requirements`,
`archimpact`, `hierarchytree`, `testcards`, `releasecard`, `prodverify`, `signals`, `cycle`,
`trace`, `brief`.

**Procedure** — `procedure` (the mandatory lesson template: why, inputs, owner, participants,
output, how, worked example, mistakes, evidence, record in, if failed), `checklist`.

**Interaction** — `exercise` (`classify` · `choice` · `order` · `build`), `gate`, `dtree`,
`assessment`.

### Exercises

```js
{ type:'exercise', kind:'classify', id, prompt,
  buckets:[{id,label}], items:[{text, answer:bucketId, explain}] }

{ type:'exercise', kind:'choice', id, prompt, scenario?,
  options:[{text, correct, explain}] }          // every option is explained, right or wrong

{ type:'exercise', kind:'order', id, prompt, explain,
  items:[{id,text}] }                            // authored in the CORRECT order; shuffled at render

{ type:'exercise', kind:'build', id, prompt, brief?, sampleLabel, sample:[{k,v}],
  fields:[{ id, label, hint, rows,
            checks:[{ type, value?, level:'bad'|'warn', msg }] }] }
```

Free-text checks: `minWords`, `includesAny`, `includesAll`, `excludesAny`, `includesDigit`.
They are deliberately blunt — they catch the specific failure the lesson is about (a solution
word left in a problem statement, a DoD item in acceptance criteria, an NFR with no number)
rather than pretending to grade prose. The expert answer is available but the reader is told
to commit first.

### Gates

```js
{ type:'gate', id, title, sub, passText, failText,
  checks:[{ id, q, cond,
            fail:{ what, returnTo, correct, recheck, owner } }] }
```

A gate passes only when every condition is answered *yes*. Each failed condition renders its
own failure path — what it means, where the work returns to, what to correct, what to recheck,
who owns it — and the verdict panel renders the fail → correct → recheck → pass loop.
Attempts are counted, and the count feeds the capability assessment.

### Capability assessment

`content/book.js` maps 21 capabilities to the exercises, gates and decision rules that
evidence them. Chapter 15 renders verdicts — *Understood*, *Ready for independent practice*,
*Practiced*, *Needs review*, *Not yet attempted*. There is no score and no ranking.

---

## Accessibility

Semantic landmarks, skip link, full keyboard operation including gates and ordering
(arrow buttons alongside drag), visible focus rings, `aria-expanded` on every disclosure,
`aria-pressed` on modes, live region for feedback, focus trap in the overlay, no hover-only
interactions, `prefers-reduced-motion` and `prefers-color-scheme` honoured, and a responsive
layout that collapses the navigation without breaking the procedural flow.
