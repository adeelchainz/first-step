/* ============================================================
   CHAPTERS 06 – 10
   ============================================================ */

window.CHAPTERS_B = (function () {
  const E = window.EXAMPLE;

  /* ---------------------------------------------------------
     06 — DECOMPOSE
     --------------------------------------------------------- */

  const ch06 = {
    id: 'ch06', num: 6, title: 'Decompose',
    kicker: 'Lifecycle · 02b',
    question: 'How does one intent become a structure of work?',
    stage: 'refine', scaffold: 'moderate',
    intro: 'Decomposition turns an Initiative and its requirements into Epics, Features and Stories. The failure mode is decomposing by team, by layer, or by phase — each of which produces items nobody can accept.',
    sections: [
      {
        id: 's1', title: 'Four levels, four questions', kicker: 'Understand',
        blocks: [
          { type: 'flow', dir: 'col', nodes: [
            { t: 'Initiative', s: 'What outcome are we pursuing, and why now?' },
            { t: 'Epic', s: 'What large coherent area of capability serves it?' },
            { t: 'Feature', s: 'What capability will people rely on?' },
            { t: 'Story', s: 'What single valuable behaviour can we deliver and verify?', accent: true }
          ]},
          { type: 'prose', p: [
            'Each level answers a different question, and the question is the test for whether you have used the level correctly. If your Epic does not answer "what area of capability", it is not an Epic — it is a bucket.',
            'Levels are available, not mandatory. Work that needs no grouping goes Initiative → Story and skips two levels. Creating an Epic to hold one Feature that holds one Story is three records where one would do.'
          ]},
          { type: 'callout', variant: 'principle', label: 'The acceptance test', text: 'At every level, ask: could someone accept this, and could it be released? Story answers yes to both. Feature and Epic answer yes to the first and "in pieces" to the second. Anything answering no to both is not a level.' }
        ]
      },
      {
        id: 's2', title: 'The levels in detail', kicker: 'See',
        lede: 'Open each level for purpose, what belongs, what does not, how it is created, who owns it, quality criteria and the mistakes people actually make.',
        blocks: [
          { type: 'hierarchydetail', ids: ['initiative', 'epic', 'feature', 'story'] }
        ]
      },
      {
        id: 's3', title: 'How to decompose', kicker: 'Follow',
        blocks: [
          { type: 'procedure', steps: [
            {
              n: 1, title: 'Group requirements by capability area',
              why: 'Epics come from the requirement set, not from the org chart. Grouping by capability keeps the structure stable when teams change.',
              inputs: ['Traced requirement set', 'Initiative outcomes'], who: 'Product lead', participants: ['Engineering lead', 'Design lead'],
              what: 'Candidate Epics.',
              how: [
                'Lay the requirements out by the outcome each serves.',
                'Look for clusters that share a centre of gravity — the same capability, the same user moment, the same data.',
                'Name each cluster as an area of capability, not as a team or a phase.',
                'Test each name against the Epic question: what large coherent area of capability serves the outcome?',
                'If a cluster has only two or three requirements and no others will join it, do not create an Epic — go straight to Features.'
              ],
              example: { label: 'Atlas — two Epics', list: [
                'EPIC-07 Risk visibility for delivery work — REQ-01 to REQ-07, REQ-10, REQ-11',
                'EPIC-08 Measurement of early-warning effectiveness — REQ-09'
              ], note: 'EPIC-08 holds one requirement and, eventually, one Story. It was created anyway, because measurement work is systematically forgotten when it is filed under the feature work it measures. That is a judgement call, made explicitly — not a rule.' },
              mistakes: ['Epics named after teams ("Platform Epic") or phases ("Discovery Epic").', 'One giant Epic that is the Initiative repeated with different words.'],
              output: 'Epics', evidence: 'Each Epic traces to requirements and to an outcome',
              where: 'Work management system', ifFailed: 'If an Epic name does not answer the Epic question, it is a bucket. Rename it or dissolve it.'
            },
            {
              n: 2, title: 'Break each Epic into Features',
              why: 'A Feature is the unit a stakeholder can be told about. It is also the unit that decomposes cleanly into several independently valuable Stories.',
              inputs: ['Epic', 'Requirements in that Epic'], who: 'Product lead', participants: ['Design lead', 'Engineering lead', 'QA'],
              what: 'Features under each Epic.',
              how: [
                'Within the Epic, ask: what distinct capabilities would a user say the product now has?',
                'Name each as a capability: "the product now lets me…".',
                'Check each Feature will produce several Stories. One Story means it is a Story, not a Feature.',
                'Check no Feature is named after a component, a service or a screen.',
                'Record dependencies between Features.'
              ],
              example: { label: 'Atlas — three Features', list: [
                'FEAT-21 At-risk work across a portfolio — the main capability',
                'FEAT-22 Risk indication in the project list — a separate surface, separately valuable',
                'FEAT-23 Early-warning effectiveness reporting — under EPIC-08'
              ], note: 'FEAT-22 could have been folded into FEAT-21. It was kept separate because the project list is a different surface with a different design, a different performance budget, and it could ship without the portfolio view. Separability is the test.' },
              mistakes: ['Features named "Projects API" or "Risk service" — components, not capabilities.', 'Bundling unrelated behaviour into one Feature to keep the board tidy.'],
              output: 'Features', evidence: 'Each Feature phrased as a capability and produces several Stories',
              where: 'Work management system', ifFailed: 'A Feature with exactly one Story is a Story. Delete the Feature and reparent.'
            },
            {
              n: 3, title: 'Identify the Stories under each Feature',
              why: 'Stories are where value becomes deliverable. Everything above them is organisation; this is the level that ships.',
              inputs: ['Feature', 'Requirements', 'Architecture impact outcome'], who: 'Product lead with the team', participants: ['Engineers', 'QA', 'Design'],
              what: 'A candidate Story list.',
              how: [
                'For the Feature, list the distinct valuable behaviours it is made of.',
                'For each, check it could be demonstrated on its own.',
                'Check it could be tested on its own.',
                'If either check fails, it is not yet a Story — chapter 07 is how to slice it until it is.',
                'Record which requirements each Story will satisfy.'
              ],
              example: { label: 'Atlas — FEAT-21', list: [
                'STORY-114 See late and at-risk deliverables in one list',
                'STORY-115 The list stays fast and current at portfolio scale',
                'STORY-117 Open a flagged deliverable in one action',
                'STORY-119 Acknowledge a flagged deliverable'
              ], note: 'STORY-115 looks like a non-functional concern rather than a behaviour. It is a Story because it delivers something a user notices — a list they can trust — and it has its own acceptance, its own tests and its own evidence. NFRs get Stories when satisfying them is real work.' },
              mistakes: ['Slicing by layer — the subject of the next chapter.', 'Creating a Story with no requirement behind it.'],
              output: 'Candidate Stories', evidence: 'Each Story traces to at least one requirement',
              where: 'Work management system', ifFailed: 'A Story satisfying no requirement is scope creep. Find its requirement or delete it.'
            },
            {
              n: 4, title: 'Check the structure end to end',
              why: 'Decomposition errors are cheapest to fix before Acceptance Criteria are written on top of them.',
              inputs: ['Draft hierarchy', 'Requirement set'], who: 'Product lead', participants: ['Team'],
              what: 'A verified structure.',
              how: [
                'Walk down: does every Epic answer the Epic question, every Feature the Feature question, every Story the Story question?',
                'Walk up: can every Story be traced to a requirement and an outcome?',
                'Check for orphans in both directions — requirements with no Story, Stories with no requirement.',
                'Check no level was created to hold exactly one child.',
                'Check no item is named after a team, a layer, a phase, a sprint or a release.'
              ],
              example: { label: 'Atlas — what the check found', before: 'A draft "Performance" Feature held STORY-115 alone.', after: 'Dissolved. "Performance" is not a capability — it answers no Feature question, and the Story it held belongs under FEAT-21 with the rest of the portfolio view. The name was a phase wearing a Feature\'s clothes.' },
              mistakes: ['Skipping the upward walk, which is the one that finds orphaned requirements.'],
              output: 'Verified hierarchy', evidence: 'No orphans in either direction',
              where: 'Work management system', ifFailed: 'Fix the structure before writing Acceptance Criteria. AC written on a bad structure has to be rewritten.'
            }
          ]},
          { type: 'hierarchytree' },
          { type: 'checklist', id: 'cl-decompose', title: 'Decompose — procedural checklist', items: [
            'Requirements grouped by capability area, not by team or phase',
            'Every Epic answers the Epic question',
            'Every Feature is phrased as a capability',
            'No Feature has exactly one Story',
            'No level created to hold exactly one child',
            'Every Story traces to at least one requirement',
            'Every requirement traces to Stories or is explicitly resolved',
            'Nothing named after a team, a layer, a phase, a sprint or a release',
            'Dependencies between Features recorded'
          ]}
        ]
      },
      {
        id: 's4', title: 'Build the hierarchy yourself', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'classify', id: 'ex-06-levels',
            prompt: 'Each of these was proposed during refinement of INIT-42. Where does it belong?',
            buckets: [
              { id: 'epic', label: 'Epic' }, { id: 'feature', label: 'Feature' },
              { id: 'story', label: 'Story' }, { id: 'task', label: 'Task' }, { id: 'none', label: 'Does not belong' }
            ],
            items: [
              { text: 'Risk visibility for delivery work', answer: 'epic', explain: 'Epic — a large coherent area of capability serving the Initiative outcome, containing several Features.' },
              { text: 'At-risk work across a portfolio', answer: 'feature', explain: 'Feature — a nameable capability a PM would say the product now has, which produces four Stories.' },
              { text: 'A project manager can see their late and at-risk deliverables in one list', answer: 'story', explain: 'Story — one valuable behaviour, demonstrable and independently testable, with its own acceptance.' },
              { text: 'Add classification logic and unit tests to the Delivery module', answer: 'task', explain: 'Task — implementation work under STORY-114. It is how, not what. On its own it delivers nothing a user notices.' },
              { text: 'Performance', answer: 'none', explain: 'Not a level at any height. It is a quality attribute, expressed as NFRs and satisfied by Stories like STORY-115. A "Performance" Feature answers no Feature question — it is a phase in disguise.' },
              { text: 'Backend work for risk classification', answer: 'none', explain: 'A technical layer, not a level. It cannot be accepted or released alone. The backend work belongs as Tasks under the Story whose behaviour it delivers.' },
              { text: 'Sprint 24 risk work', answer: 'none', explain: 'A time box. Work does not become smaller or more valuable by being placed in one. Use the iteration as a field, never as a parent — when the work rolls over, the parent becomes a lie.' },
              { text: 'Measurement of early-warning effectiveness', answer: 'epic', explain: 'Epic — a distinct area of capability under the same Initiative. It holds one requirement and one Story, which is a deliberate judgement call: measurement work is systematically forgotten when filed under the work it measures.' },
              { text: 'Expose DeliverableRisk.forMember through the published interface', answer: 'task', explain: 'Task — implementation under STORY-114. Note it is not a Story even though it produces a published interface: no user notices an interface existing.' },
              { text: 'Release 24.3', answer: 'none', explain: 'A shipping boundary, not a level. It references Stories from several Features and could include work from an unrelated Initiative — which no parent can do.' }
            ]
          },
          { type: 'exercise', kind: 'order', id: 'ex-06-order',
            prompt: 'Put the decomposition procedure back in order.',
            explain: 'Grouping comes first because Epics come from the requirement set, not the org chart. Features come from Epics, Stories from Features. The end-to-end check comes last, and it is the step that finds orphans in both directions — it is also the step teams skip.',
            items: [
              { id: 'a', text: 'Group requirements by capability area' },
              { id: 'b', text: 'Break each Epic into Features' },
              { id: 'c', text: 'Identify the Stories under each Feature' },
              { id: 'd', text: 'Walk the structure down, then up, checking for orphans' }
            ]
          }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     07 — SLICE STORIES
     --------------------------------------------------------- */

  const ch07 = {
    id: 'ch07', num: 7, title: 'Slice Stories',
    kicker: 'Lifecycle · 02c',
    question: 'Can this work be delivered as a valuable, testable increment?',
    stage: 'refine', scaffold: 'moderate',
    intro: 'Slicing is the highest-leverage skill in the model. A well-sliced Story makes acceptance obvious, testing possible, and dependencies visible. A badly sliced one hides all three.',
    sections: [
      {
        id: 's1', title: 'The four properties', kicker: 'Understand',
        blocks: [
          { type: 'prose', p: ['A Story must be all four of these. Failing any one is a slicing failure, and each failure shows up somewhere different and later.'] },
          { type: 'propgrid', items: [
            { k: 'Valuable', d: 'Shipping only this Story changes something for someone. If nothing changes until a sibling also lands, it is not a Story — it is a fragment.', fails: 'Shows up as: nobody can say what this is for.' },
            { k: 'Demonstrable', d: 'You can show it working to someone who did not build it.', fails: 'Shows up as: the demo is a code walkthrough.' },
            { k: 'Independently testable', d: 'It has its own acceptance, verifiable without its siblings.', fails: 'Shows up as: testing is deferred to the end of the Feature.' },
            { k: 'Small enough', d: 'It completes comfortably inside one iteration, with room for the correction the gate may demand.', fails: 'Shows up as: it rolls over, twice.' }
          ]},
          { type: 'callout', variant: 'principle', label: 'The rule', text: 'A Story describes valuable behaviour. The technical work required to implement it — front end, back end, data, infrastructure — belongs underneath it as Tasks.' }
        ]
      },
      {
        id: 's2', title: 'The nine steps', kicker: 'Follow',
        blocks: [
          { type: 'steplist', title: 'Slice a Story', items: [
            { n: 1, t: 'Start from the Feature', d: 'Read the Feature\'s capability statement. Everything you slice must serve it.' },
            { n: 2, t: 'Identify one valuable behaviour', d: 'One thing someone can do, or one thing the system reliably does for them. Not a layer, not a screen, not a phase.' },
            { n: 3, t: 'Define the user or business outcome', d: 'Complete the sentence: "…so that…". If you cannot, the behaviour is not valuable on its own.' },
            { n: 4, t: 'Check it can be demonstrated', d: 'Could you show this to the product lead on a screen share and have them recognise it as working? If not, it is a fragment.' },
            { n: 5, t: 'Check it can be tested independently', d: 'Could you write acceptance for it without referring to its siblings? If acceptance needs a sibling, the slice is wrong.' },
            { n: 6, t: 'Define Acceptance Criteria', d: 'Happy path first, then every failure and edge condition. Chapter 08 is the full procedure.' },
            { n: 7, t: 'Identify dependencies', d: 'What must exist first — an interface, a migration, a design, another team\'s work? Write each one down with an owner. Unwritten dependencies are the ones that stall the iteration.' },
            { n: 8, t: 'Check size', d: 'Comfortably inside one iteration. If the team hesitates, it is too big — hesitation is data.' },
            { n: 9, t: 'Slice again if necessary', d: 'Return to step 2 with the part that did not fit. Slicing is recursive.' }
          ]},
          { type: 'slicepatterns' }
        ]
      },
      {
        id: 's3', title: 'The layer-slicing trap', kicker: 'See',
        blocks: [
          { type: 'badgood', data: {
            bad: { label: 'Sliced by technical layer', q: 'FEAT-21 as four Stories', list: [
              'Backend: risk classification service',
              'Frontend: at-risk list component',
              'Database: index and query',
              'Testing: at-risk test suite'
            ]},
            good: { label: 'Sliced by valuable behaviour', q: 'FEAT-21 as four Stories', list: [
              'STORY-114 A PM can see their late and at-risk deliverables in one list',
              'STORY-115 The list stays fast and current at portfolio scale',
              'STORY-117 A PM can open a flagged deliverable in one action',
              'STORY-119 A PM can acknowledge a flagged deliverable'
            ]},
            why: 'Not one of the four layer Stories can be released, demonstrated or accepted alone. Value only appears when all four land, so acceptance is deferred to the end and the dependencies between them are hidden inside the slice rather than visible between Stories. The "Testing" Story is the worst of the four: it guarantees verification happens after implementation, which is the most expensive place to find defects. Meanwhile each behaviour-sliced Story carries its own front-end, back-end, data and test Tasks underneath it — the layers did not disappear, they moved to where they belong.',
            repair: 'Ask what a user can do that they could not do before. Make that the Story. Then list the technical work it needs and make those the Tasks.'
          }},
          { type: 'prose', p: [
            'The layer slice is seductive because it matches how the work feels to the people doing it, and because it maps neatly onto specialisms. Both are real. Neither survives contact with acceptance: at the end of the Feature you have four "done" Stories and nothing anyone can accept.'
          ]},
          { type: 'badgood', data: {
            bad: { label: 'Too large to test', q: 'One Story', list: ['As a PM, I want full visibility of project health.'] },
            good: { label: 'Sliced', q: 'Three Stories', list: [
              'A PM can see their late and at-risk deliverables in one list',
              'A PM can see which projects contain risk from the project list',
              'A PM can open a flagged deliverable in one action'
            ]},
            why: 'The first cannot be demonstrated, cannot be finished in an iteration, and its acceptance can only be written vaguely — which is why size failures always surface as acceptance failures. "Full visibility" has no boundary, so no criterion can be complete.',
            repair: 'Find the smallest behaviour a user would actually notice. Ship that. Then slice the next one.'
          }}
        ]
      },
      {
        id: 's4', title: 'Slice it yourself', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'choice', id: 'ex-07-slice1',
            prompt: 'Which set of Stories is correctly sliced?',
            scenario: 'FEAT-22: "A project manager scanning the existing project list can tell which projects contain risk without leaving the list."',
            options: [
              { text: 'Add risk field to project query · Render risk badge · Style the badge · Test the badge', correct: false, explain: 'Four layers. None is valuable, demonstrable or independently testable alone. These are the Tasks of one Story.' },
              { text: 'A PM can see a risk indicator on each project in the list · A PM can sort the project list by risk', correct: true, explain: 'Correct. Both are valuable on their own — the first changes what a PM can see today, and the second is useful even without the first once indicators exist. Both are demonstrable and independently testable. The second might even be dropped without harming the first, which is the clearest sign of a good slice.' },
              { text: 'One Story: "Show risk in the project list, sorted, with filters and a legend"', correct: false, explain: 'Bundled. Three behaviours in one Story means acceptance covers three things at once, and dropping any part means renegotiating the whole. Bundling is a size failure wearing a scope costume.' },
              { text: 'One Story per screen size: desktop list, tablet list, mobile list', correct: false, explain: 'Sliced by surface rather than behaviour. The value is identical in all three, so two of them deliver nothing new. Responsive behaviour belongs in the acceptance criteria of one Story — or, if genuinely large, as its own Story about a distinct behaviour, not a distinct width.' }
            ]
          },
          { type: 'exercise', kind: 'build', id: 'ex-07-build',
            prompt: 'Your turn: slice a Feature.',
            brief: 'A new Feature under EPIC-07: <em>"A project manager can adjust what counts as at risk for their own portfolio."</em> Today the 3-working-day window is fixed for everyone. Slice this into Stories.',
            fields: [
              { id: 's1', label: 'Story 1 — the smallest valuable behaviour', hint: 'Write it as: As a [role], I want [behaviour], so that [outcome].', rows: 3,
                checks: [
                  { type: 'minWords', value: 10, level: 'bad', msg: 'Too short to carry an actor, a behaviour and an outcome.' },
                  { type: 'includesAny', value: ['so that', 'so they', 'in order to'], level: 'warn', msg: 'No "so that" clause. Without the outcome you cannot tell whether this slice is valuable on its own.' },
                  { type: 'excludesAny', value: ['backend', 'frontend', 'database', 'api', 'endpoint', 'schema'], level: 'bad', msg: 'This is a technical layer, not a behaviour. Ask what the PM can do that they could not do before.' }
                ]
              },
              { id: 's2', label: 'Story 2 — the next behaviour', hint: 'It must be valuable even if Story 1 shipped alone and nothing else followed.', rows: 3,
                checks: [
                  { type: 'minWords', value: 8, level: 'bad', msg: 'Too short.' },
                  { type: 'excludesAny', value: ['backend', 'frontend', 'database', 'api', 'endpoint'], level: 'bad', msg: 'Technical layer again. Slice by what changes for the PM.' }
                ]
              },
              { id: 'dep', label: 'What dependency would you record, and who owns it?', hint: 'Slicing surfaces dependencies. Name one and give it an owner.', rows: 3,
                checks: [
                  { type: 'minWords', value: 6, level: 'bad', msg: 'Name the dependency and who owns it.' }
                ]
              }
            ],
            sampleLabel: 'How an expert sliced it',
            sample: [
              { k: 'Story 1', v: 'As a project manager, I want to set my own at-risk window in days, so that the list matches how far ahead I actually plan. — Valuable alone: a PM who plans two weeks ahead stops missing things. Demonstrable. Independently testable: set 10 days, assert a deliverable due in 8 days appears.' },
              { k: 'Story 2', v: 'As a project manager, I want my window to apply everywhere risk is shown, so that the project list and the at-risk view agree. — Valuable alone only if Story 1 shipped; this is a legitimate sequential dependency, recorded rather than hidden. Some teams would fold this into Story 1\'s acceptance. Either is defensible; leaving it unsaid is not.' },
              { k: 'Story 3 (not sliced yet)', v: 'As an account owner, I want a default window for my account, so that new PMs start somewhere sensible. — Different actor, different value. Deliberately left for later rather than bundled.' },
              { k: 'Dependency', v: 'Per-member preference storage does not exist for the Delivery module — only account-level settings. Owner: Delivery module maintainers. This is exactly the kind of dependency slicing surfaces: it was invisible while the Feature was one lump, and it is an architecture impact question (check 3, data boundaries) before it is a Story.' },
              { k: 'Note on layers', v: 'Every one of these Stories needs front-end, back-end and storage work. None of them is named after any of it.' }
            ]
          }
        ]
      },
      {
        id: 's5', title: 'Checklist', kicker: 'Reference',
        blocks: [
          { type: 'checklist', id: 'cl-slice', title: 'Slice a Story — procedural checklist', items: [
            'Starts from a Feature capability statement',
            'Describes one valuable behaviour',
            'Has a "so that" outcome',
            'Could be demonstrated to someone who did not build it',
            'Could be accepted without reference to sibling Stories',
            'Acceptance Criteria defined, including failure cases',
            'Dependencies written down, each with an owner',
            'Sized to complete comfortably within one iteration',
            'Not named after a layer, a screen, a phase or a team',
            'Traces to at least one requirement'
          ]}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     08 — CREATE A READY STORY
     --------------------------------------------------------- */

  const ch08 = {
    id: 'ch08', num: 8, title: 'Create a Ready Story',
    kicker: 'Lifecycle · 04',
    question: 'What does a Story need before anyone starts building it?',
    stage: 'ready', scaffold: 'moderate',
    intro: 'Ten steps take a sliced behaviour to something a team can build without discovering the work mid-flight. The tenth step is the gate, and it is the subject of the next chapter.',
    sections: [
      {
        id: 's1', title: 'The ten steps', kicker: 'Follow',
        blocks: [
          { type: 'opmodel', data: {
            inputs: 'A sliced behaviour under a Feature. Requirements. The architecture impact outcome. Design where impact produced one.',
            actions: 'The ten steps below.',
            output: 'A Story that passes the Ready Gate, with Tasks.',
            evidence: 'A recorded Ready Gate result, including any failed condition and what was corrected.',
            owner: 'Product lead writes the intent; the team completes the Story',
            participants: 'Engineers, QA, design',
            decision: 'The team, at the Ready Gate',
            sor: 'Work management system — Story record',
            next: 'Deliver. On gate failure: back to Refine or Design, correct, recheck.'
          }},
          { type: 'procedure', steps: [
            {
              n: 1, title: 'Write the Story intent',
              why: 'The intent is what everyone returns to when a detail is ambiguous. It has to carry an actor, a behaviour and a reason.',
              inputs: ['Sliced behaviour', 'Feature capability'], who: 'Product lead', participants: ['Team'],
              what: 'One sentence with actor, behaviour and outcome.',
              how: ['Write: as a [role], I want [behaviour], so that [outcome].', 'Check the role is the one from the problem statement.', 'Check the behaviour is observable.', 'Check the outcome is a reason, not a restatement of the behaviour.'],
              example: { label: 'Atlas — STORY-114', after: E.stories[0].intent, note: '"so that I can act before the client notices" is the Initiative\'s desired outcome, arriving intact at Story level. That is what traceability feels like in practice.' },
              mistakes: ['"So that it works" — a restatement, not a reason.', 'A role of "user" when the problem named project managers.'],
              output: 'Story intent', evidence: 'Intent contains all three parts', where: 'Story record',
              ifFailed: 'If the "so that" clause restates the behaviour, the Story may not be valuable on its own. Return to slicing.'
            },
            {
              n: 2, title: 'Link the requirements',
              why: 'Links are what make it possible, at release, to say whether what shipped satisfies what was required.',
              inputs: ['Requirement set'], who: 'Product lead', participants: ['Team'],
              what: 'Requirement links on the Story.',
              how: ['Name every requirement this Story satisfies.', 'Check each named requirement is at least partly satisfied by this Story alone.', 'If the Story satisfies no requirement, stop — it is scope creep or a missing requirement.'],
              example: { label: 'Atlas — STORY-114', list: E.stories[0].requirements },
              mistakes: ['Linking every requirement in the Feature "to be safe", which makes the trace meaningless.'],
              output: 'Requirement links', evidence: 'Links present in both directions', where: 'Story record',
              ifFailed: 'No requirement means no reason to build it. Find the requirement or delete the Story.'
            },
            {
              n: 3, title: 'Define Acceptance Criteria',
              why: 'AC defines when this Story is correct. It is the single most valuable field on the record, and the one most often written carelessly.',
              inputs: ['Story intent', 'Linked requirements', 'Known failure modes from the System Design'], who: 'Product lead with QA', participants: ['Engineers', 'Design'],
              what: 'A set of observable conditions with definite outcomes.',
              how: [
                'Write the happy path first, as Given / When / Then.',
                'Then write every failure case: empty, unauthorised, unavailable, stale, too large, malformed.',
                'Then every edge condition: boundaries of any rule with a number in it.',
                'For each criterion ask: could two people disagree about whether it passed? If yes, it is not observable enough.',
                'Check no criterion is a Definition of Done item.',
                'Check each linked requirement is covered by at least one criterion.'
              ],
              example: { label: 'Atlas — STORY-114 acceptance', acList: E.stories[0].ac, note: 'Seven criteria: one happy path, three exclusions at the boundaries of the rules, one permission case, one accessibility case, one empty state. The failure cases outnumber the happy path four to one — that ratio is normal for a well-written Story.' },
              mistakes: ['Only the happy path, so the empty state and the permission boundary are invented during implementation.', 'Copying the Definition of Done in.', 'Criteria that restate the title.'],
              output: 'Acceptance Criteria', evidence: 'Each linked requirement covered by at least one criterion', where: 'Inside the Story record',
              ifFailed: 'If a requirement has no criterion covering it, either the Story is wrong or a criterion is missing. Do not proceed to Ready.'
            },
            {
              n: 4, title: 'Identify dependencies',
              why: 'Unwritten dependencies are the single most common cause of a Story stalling mid-iteration.',
              inputs: ['System Design', 'Other Stories', 'External teams'], who: 'Engineering lead', participants: ['Team'],
              what: 'A dependency list with owners.',
              how: ['Ask what must exist before this can start, and before it can finish — they are different lists.', 'Include interfaces, migrations, designs, data, environments, other teams, third parties.', 'Give each dependency an owner and an expected date.', 'Mark any dependency without a named owner as unresolved — that is a gate failure, not a note.'],
              example: { label: 'Atlas — STORY-114', list: E.stories[0].dependencies, note: 'The index dependency is easy to overlook: the Story works without it on small data. It appears here because STORY-115 exists and the NFR is explicit.' },
              mistakes: ['"Probably fine" dependencies with no owner.', 'Only listing what is needed to start, not what is needed to finish.'],
              output: 'Dependency list', evidence: 'Each dependency has an owner and a date', where: 'Story record',
              ifFailed: 'A dependency with no owner is unresolved. The Story is not Ready.'
            },
            {
              n: 5, title: 'Resolve architecture impact',
              why: 'Ready means the team can build without discovering the architecture. An unresolved impact position guarantees the opposite.',
              inputs: ['Architecture Impact Check outcome'], who: 'Engineering lead', participants: ['Module owners'],
              what: 'A recorded impact position on the Story.',
              how: ['Confirm the check was run for the requirements this Story satisfies.', 'Record the outcome on the Story.', 'Where impact exists, confirm the System Design exists and covers this Story.', 'Where a significant decision was made, confirm the ADR is accepted, not draft.'],
              example: { label: 'Atlas — STORY-114', after: E.stories[0].archImpact },
              mistakes: ['Marking impact resolved while the ADR is still in draft.'],
              output: 'Recorded impact position', evidence: 'Outcome recorded; design and ADR linked where they exist', where: 'Story record',
              ifFailed: 'Return to the Architecture Impact Check. Do not make a Story Ready against a draft decision.'
            },
            {
              n: 6, title: 'Identify design needs',
              why: 'A Story that needs a design it does not have will stall or will be designed by whoever implements it, at build time, alone.',
              inputs: ['Acceptance Criteria', 'UX requirements'], who: 'Design lead', participants: ['Product lead', 'Engineers'],
              what: 'A statement that design is available, or is not needed.',
              how: ['Walk the Acceptance Criteria and ask which need a designed treatment — especially empty, error and stale states.', 'Check whether existing patterns cover them.', 'Where they do not, the design is a dependency with an owner and a date.'],
              example: { label: 'Atlas — STORY-114', after: E.stories[0].design, note: 'The empty state was designed because AC-7 demanded it. Empty and error states are the states most often left undesigned and then invented in code.' },
              mistakes: ['Assuming existing patterns cover the failure states.'],
              output: 'Design position', evidence: 'Design linked, or explicitly recorded as not needed', where: 'Story record',
              ifFailed: 'Design needed and not available is a dependency. The Story is not Ready.'
            },
            {
              n: 7, title: 'Check testability',
              why: 'Testability is a property of the Story, decided now. Discovering it later means the Story was never independently verifiable.',
              inputs: ['Acceptance Criteria', 'Test Strategy'], who: 'QA lead', participants: ['Engineers'],
              what: 'A statement of how each criterion will be verified, and what that needs.',
              how: [
                'For each criterion ask: how would we verify this?',
                'Name what verification needs — data, environment, a fixed clock, a seeded account, a way to simulate failure.',
                'Anything not available is a dependency.',
                'Apply the formal-test-case decision rule to decide what needs formal cases.'
              ],
              example: { label: 'Atlas — STORY-114', after: E.stories[0].testability, note: 'The fixed clock is a real dependency. Without it, the working-day criteria pass or fail depending on what day the test runs — which is how flaky date logic reaches production.' },
              mistakes: ['"We will test it" with no statement of what verification needs.', 'Leaving the time-dependent criteria to be discovered by a flaky test.'],
              output: 'Testability position', evidence: 'Each criterion has a stated verification approach', where: 'Story record',
              ifFailed: 'A criterion nobody can describe verifying is either badly written or genuinely untestable. Rewrite it or reslice the Story.'
            },
            {
              n: 8, title: 'Check size',
              why: 'Size failures surface as rollover, as deferred acceptance, and as gates that get waived under time pressure.',
              inputs: ['Acceptance Criteria', 'Dependencies', 'Design and impact position'], who: 'The team', participants: [],
              what: 'A size judgement.',
              how: ['Ask the team whether this completes comfortably in one iteration, including correction.', 'Treat hesitation as a no — hesitation is data.', 'If it is too big, return to slicing rather than splitting into layers.'],
              example: { label: 'Atlas — STORY-114', after: E.stories[0].size },
              mistakes: ['Splitting an oversized Story by layer to make it fit, which converts a size problem into a slicing problem.'],
              output: 'Size judgement', evidence: 'Team agreement recorded', where: 'Story record',
              ifFailed: 'Return to chapter 07 and slice again — by behaviour, not by layer.'
            },
            {
              n: 9, title: 'Create the Tasks',
              why: 'Tasks make the implementation visible and are where the layers legitimately live.',
              inputs: ['Acceptance Criteria', 'System Design'], who: 'Engineers', participants: ['QA'],
              what: 'Implementation Tasks under the Story.',
              how: ['Break the work into Tasks with unambiguous completion conditions.', 'Include test automation as Tasks, not as an afterthought.', 'Include instrumentation where the design calls for it.', 'Check no Task adds behaviour that no Acceptance Criterion covers.'],
              example: { label: 'Atlas — STORY-114', taskList: E.tasks.filter(function (t) { return t.story === 'STORY-114'; }) },
              mistakes: ['Tasks that smuggle in unplanned behaviour.', 'No test automation Task, so the tests are written if there is time.'],
              output: 'Tasks', evidence: 'Every Task traceable to a criterion or to the design', where: 'Work management system',
              ifFailed: 'A Task covering behaviour no criterion mentions is either scope creep or a missing criterion. Decide which.'
            },
            {
              n: 10, title: 'Run the Ready Gate',
              why: 'The gate is where the eight conditions are actually tested, rather than assumed because the fields are filled in.',
              inputs: ['Everything above'], who: 'The team', participants: ['Product lead', 'QA', 'Engineering lead'],
              what: 'A recorded gate result.',
              how: ['Run the eight conditions of the Ready Gate.', 'Record the result, including any condition that failed.', 'On failure, return to the named step, correct, and recheck only what changed.'],
              example: { label: 'Atlas — STORY-114', after: E.stories[0].readyResult },
              mistakes: ['Treating the gate as a formality to get past.'],
              output: 'Ready Gate result', evidence: 'Recorded result with failures and corrections', where: 'Story record',
              ifFailed: 'That is the subject of the next chapter.'
            }
          ]}
        ]
      },
      {
        id: 's2', title: 'The complete artifact', kicker: 'See',
        blocks: [
          { type: 'storycard', storyId: 'STORY-114' },
          { type: 'badgood', data: {
            bad: { label: 'The same Story, as first drafted', q: E.badStory.name, list: ['Intent: ' + E.badStory.intent].concat(E.badStory.ac.map(function (a) { return 'AC: ' + a; })) },
            good: { label: 'After the ten steps', q: E.stories[0].name, list: ['Intent: ' + E.stories[0].intent, '7 acceptance criteria covering happy path, exclusions, permission, accessibility and empty state', '5 requirements linked', '2 dependencies with owners', 'Impact resolved: contained, SD-42 + ADR-014', '4 Tasks including test automation'] },
            why: E.badStory.faults.join(' '),
            repair: 'Write the intent with an actor and a reason. Link the requirements. Write the failure cases before the happy path feels finished. Reference the DoD instead of copying it.'
          }}
        ]
      },
      {
        id: 's3', title: 'Build one yourself', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'build', id: 'ex-08-story',
            prompt: 'Write a Ready Story.',
            brief: 'Take STORY-117 from FEAT-21: <em>"A project manager can open a flagged deliverable in one action."</em> It satisfies REQ-05. Write its intent and three acceptance criteria — at least two of which must be failure or edge cases.',
            fields: [
              { id: 'intent', label: 'Story intent', hint: 'As a [role], I want [behaviour], so that [outcome].', rows: 3,
                checks: [
                  { type: 'minWords', value: 12, level: 'bad', msg: 'Too short for actor, behaviour and outcome.' },
                  { type: 'includesAny', value: ['so that', 'so they', 'in order to'], level: 'bad', msg: 'No outcome clause. Without "so that", the Story has no reason to exist that anyone could check.' },
                  { type: 'excludesAny', value: ['user ', 'users '], level: 'warn', msg: 'The problem statement named project managers. Using "user" loses the role that makes the outcome meaningful.' }
                ]
              },
              { id: 'ac1', label: 'Acceptance criterion 1 — the happy path', hint: 'Given / When / Then. Make it observable.', rows: 3,
                checks: [
                  { type: 'minWords', value: 10, level: 'bad', msg: 'Too short to be observable.' },
                  { type: 'includesAll', value: ['given', 'when', 'then'], level: 'warn', msg: 'Not in Given / When / Then form. The form is not sacred, but it forces you to state the precondition — which is the part people omit.' }
                ]
              },
              { id: 'ac2', label: 'Acceptance criterion 2 — a failure or edge case', hint: 'What happens when the deliverable was deleted, or the PM lost access, or the list is stale?', rows: 3,
                checks: [
                  { type: 'minWords', value: 10, level: 'bad', msg: 'Too short.' },
                  { type: 'excludesAny', value: ['code review', 'unit test', 'deployed', 'documentation'], level: 'bad', msg: 'That is a Definition of Done item, not acceptance for this Story. The DoD is referenced once, team-wide — never copied in.' }
                ]
              },
              { id: 'ac3', label: 'Acceptance criterion 3 — another failure or edge case', hint: 'A different one. Failure cases should outnumber the happy path.', rows: 3,
                checks: [
                  { type: 'minWords', value: 10, level: 'bad', msg: 'Too short.' },
                  { type: 'excludesAny', value: ['code review', 'unit test', 'deployed', 'documentation'], level: 'bad', msg: 'Definition of Done item again. Reference it, do not copy it.' }
                ]
              },
              { id: 'dep', label: 'What would you check before calling this Ready?', hint: 'Name one condition from the Ready Gate that this Story could plausibly fail.', rows: 3,
                checks: [{ type: 'minWords', value: 6, level: 'bad', msg: 'Name a specific gate condition and why it is at risk here.' }]
              }
            ],
            sampleLabel: 'How an expert wrote it',
            sample: [
              { k: 'Intent', v: 'As a project manager, I want to open a flagged deliverable directly from the at-risk list, so that I can act on it without hunting for it through its project.' },
              { k: 'AC-1', v: 'Given the at-risk list contains deliverable D-1, when I select it, then the deliverable detail for D-1 opens and I can edit its due date and status without a further navigation step.' },
              { k: 'AC-2', v: 'Given a deliverable was deleted after the list was rendered, when I select it, then I am shown a message saying the deliverable no longer exists and the list refreshes — I am not shown an error page or an empty detail view.' },
              { k: 'AC-3', v: 'Given I was removed from a project after the list was rendered, when I select one of its deliverables, then I am told I no longer have access and it is removed from my list. No content from that deliverable is shown, even briefly.' },
              { k: 'Ready check at risk', v: 'Testability. AC-2 and AC-3 both require simulating a state change between render and click. If the test environment cannot do that, it is a dependency with an owner — and without it, the two most important criteria are unverifiable.' },
              { k: 'Note', v: 'Two of three criteria are failure cases, and both describe stale-list scenarios. Those exist because STORY-115 established that the list can be up to 60 seconds old. The acceptance of one Story is shaped by the decisions of another — which is why they are refined together.' }
            ]
          }
        ]
      },
      {
        id: 's4', title: 'Checklist', kicker: 'Reference',
        blocks: [
          { type: 'checklist', id: 'cl-story', title: 'Create a Story — procedural checklist', items: [
            'Identify the valuable behaviour',
            'Identify the user or business outcome',
            'Link the relevant requirements',
            'Write the Story intent with actor, behaviour and outcome',
            'Define Acceptance Criteria: happy path, failures, edges',
            'Confirm no Definition of Done items are in the criteria',
            'Confirm every linked requirement is covered by a criterion',
            'Identify dependencies, each with an owner and a date',
            'Resolve architecture impact and link design or ADR where they exist',
            'Confirm design is available for empty, error and stale states',
            'Confirm testability and name what verification needs',
            'Check size against one iteration, including correction',
            'Create implementation Tasks, including test automation',
            'Run the Ready Gate and record the result'
          ]}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     09 — THE READY GATE
     --------------------------------------------------------- */

  const ch09 = {
    id: 'ch09', num: 9, title: 'The Ready Gate',
    kicker: 'Gate',
    question: 'Can we build this without discovering the work mid-flight?',
    stage: 'ready', scaffold: 'moderate',
    intro: 'This is a decision mechanism, not a checklist. It has eight conditions, and every one of them names where the work goes back to when it fails.',
    sections: [
      {
        id: 's1', title: 'What a gate is', kicker: 'Understand',
        blocks: [
          { type: 'gateshape' },
          { type: 'prose', p: [
            'A gate is worth running only if it can fail. If yours never has, the conditions are either trivially true or being answered to get past them. Both are worth fixing, and both are visible in the record — a gate with no recorded failures across fifty Stories is not evidence of quality.',
            'Failing the Ready Gate is cheap. The same defect found during implementation costs a stalled iteration; found during verification it costs rework; found in production it costs an incident. The gate exists to move discovery to the cheapest point.'
          ]},
          { type: 'callout', variant: 'principle', label: 'The rule', text: 'Every gate defines six things: pass, fail, correction, return point, recheck, and owner. A gate missing any of those is decorative.' }
        ]
      },
      {
        id: 's2', title: 'A gate failing, in full', kicker: 'See',
        lede: 'STORY-114 failed its first Ready Gate. Here is the whole loop, including what it cost.',
        blocks: [
          { type: 'gatestory', data: {
            attempt1: {
              failed: 'Testability',
              detail: 'AC-2 and AC-3 depend on working-day arithmetic relative to "today". QA asked how the criteria would be verified, and the answer was that the tests would run against the real clock. That makes AC-3 pass on a Tuesday and fail on a Friday, because the 3-working-day window crosses a weekend.',
              otherAtRisk: 'A second condition was nearly missed: the covering index dependency had no owner. It was recorded as "infrastructure will do it", which is not an owner.',
              returnTo: 'Refine — testability (step 7 of Create a Ready Story)',
              correction: 'Add a fixed-clock capability to the test environment and restate AC-2 and AC-3 against a stated reference date. Assign the index dependency to the Delivery module maintainers with a date.',
              owner: 'QA lead for the clock; engineering lead for the dependency',
              cost: 'Two days. Discovered during implementation it would have cost the iteration, because the tests would have been written, passed once, and then failed intermittently for a week before anyone identified the cause.'
            },
            attempt2: {
              result: 'Pass',
              detail: 'Only testability and dependencies were re-evaluated. The other six conditions had not changed, and re-running them would have been ceremony.',
              note: 'The gate result recorded on the Story says: failed on testability 18 March, corrected by fixing the clock and restating AC-2 and AC-3, passed 20 March. That record is evidence — it is what makes it possible, six months later, to see why the acceptance criteria are phrased against a reference date.'
            }
          }},
          { type: 'callout', variant: 'note', label: 'Recheck what changed', text: 'On a re-run, evaluate the failed conditions and anything the correction touched. Re-running all eight when one changed is ceremony, and ceremony is how gates become decorative.' }
        ]
      },
      {
        id: 's3', title: 'Run the gate', kicker: 'Gate',
        lede: 'Answer for STORY-117 — the Story you drafted in chapter 08. Answer honestly; a pass you did not earn teaches nothing.',
        blocks: [
          { type: 'gate', id: 'gate-ready', title: 'Ready Gate', sub: 'STORY-117 — A project manager can open a flagged deliverable in one action',
            checks: [
              { id: 'r1', q: 'Is the purpose understood?', cond: 'The intent names an actor, a behaviour and an outcome, and the team can restate why this Story exists.',
                fail: { what: 'The Story has no clear reason to exist, so scope decisions during implementation will have no referee.', returnTo: 'Create a Ready Story — step 1', correct: 'Rewrite the intent with actor, behaviour and outcome. Check the outcome is a reason, not a restatement.', recheck: 'Story intent', owner: 'Product lead' } },
              { id: 'r2', q: 'Are the requirements understood and linked?', cond: 'Every requirement this Story satisfies is linked, and each is at least partly satisfied by this Story alone.',
                fail: { what: 'Without links, nobody can say at release whether what shipped satisfies what was required.', returnTo: 'Create a Ready Story — step 2', correct: 'Link the requirements. If none apply, this is scope creep — delete the Story or find its requirement.', recheck: 'Requirement links', owner: 'Product lead' } },
              { id: 'r3', q: 'Are Acceptance Criteria defined?', cond: 'Observable conditions with definite outcomes, covering failure and edge cases, containing no Definition of Done items, and covering every linked requirement.',
                fail: { what: 'Acceptance becomes an opinion held after the fact, at the moment disagreement is most expensive.', returnTo: 'Create a Ready Story — step 3', correct: 'Write the failure cases: empty, unauthorised, unavailable, stale, deleted. Remove any DoD items. Check each linked requirement is covered.', recheck: 'Acceptance Criteria', owner: 'Product lead with QA' } },
              { id: 'r4', q: 'Are dependencies understood?', cond: 'Every dependency — to start and to finish — is written down with a named owner and a date.',
                fail: { what: 'Unwritten dependencies become mid-iteration stalls, and "probably fine" is not an owner.', returnTo: 'Create a Ready Story — step 4', correct: 'List what must exist to start and to finish. Assign an owner and a date to each. Anything without an owner is unresolved.', recheck: 'Dependency list', owner: 'Engineering lead' } },
              { id: 'r5', q: 'Is architecture impact resolved?', cond: 'The check was run, the outcome is recorded, and any ADR is accepted rather than draft.',
                fail: { what: 'The team will discover the architecture during implementation, which is the most expensive place to discover it.', returnTo: 'Architecture Impact Check', correct: 'Run the eight checks against the requirements this Story satisfies. Record the outcome. Get any ADR accepted.', recheck: 'Impact outcome', owner: 'Engineering lead' } },
              { id: 'r6', q: 'Is design available where needed?', cond: 'Empty, error and stale states are designed or explicitly covered by existing patterns.',
                fail: { what: 'The failure states will be designed in code, by one person, at build time.', returnTo: 'Create a Ready Story — step 6', correct: 'Walk the criteria and identify which need a designed treatment. Where patterns do not cover them, record design as a dependency with an owner.', recheck: 'Design position', owner: 'Design lead' } },
              { id: 'r7', q: 'Is testability understood?', cond: 'Each criterion has a stated verification approach, and everything verification needs is either available or recorded as a dependency.',
                fail: { what: 'The Story was never independently verifiable. Verification will be deferred, and time-dependent criteria will become flaky tests.', returnTo: 'Create a Ready Story — step 7', correct: 'For each criterion state how it will be verified and what that needs — data, environment, fixed clock, simulated failure. Record anything missing as a dependency.', recheck: 'Testability position', owner: 'QA lead' } },
              { id: 'r8', q: 'Is the Story small enough?', cond: 'The team agrees it completes comfortably within one iteration, including time for correction.',
                fail: { what: 'It will roll over, acceptance will be deferred, and the gates downstream will be waived under time pressure.', returnTo: 'Slice Stories — step 9', correct: 'Slice again by behaviour, never by layer. Take the part that did not fit and start from step 2 of slicing.', recheck: 'Size judgement', owner: 'The team' } }
            ],
            passText: 'The Story is Ready. Record the gate result on the Story, including which conditions were evaluated and when. Work moves to Deliver: Tasks are picked up, implemented, reviewed and built.',
            failText: 'The Story is not Ready. Each failed condition above names where the work returns to, what must be corrected, and who owns the correction. Correct them, then re-run only the failed conditions and anything the correction touched. Record both the failure and the correction — that record is the evidence that the gate is doing work.'
          }
        ]
      },
      {
        id: 's4', title: 'Where Ready sits', kicker: 'Continue',
        blocks: [
          { type: 'transform', data: {
            before: 'A sliced behaviour with acceptance criteria and tasks.',
            now: 'A Story that has passed a gate, with the result recorded.',
            connects: 'The Acceptance Criteria written here become the Test Cases in Verify. The gate record becomes evidence in the Release.',
            next: 'Chapter 10 — Deliver.'
          }}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     10 — DELIVER
     --------------------------------------------------------- */

  const ch10 = {
    id: 'ch10', num: 10, title: 'Deliver',
    kicker: 'Lifecycle · 05',
    question: 'How does a Ready Story become implemented software?',
    stage: 'deliver', scaffold: 'moderate',
    intro: 'This chapter is not a version-control tutorial. It is about where each engineering activity sits in the model, what evidence each one produces, and which of them are gates.',
    sections: [
      {
        id: 's1', title: 'The path', kicker: 'Understand',
        blocks: [
          { type: 'flow', dir: 'col', nodes: [
            { t: 'Ready Story', s: 'Passed the gate, with Tasks' },
            { t: 'Tasks', s: 'Implementation work — where the layers live' },
            { t: 'Subtasks', s: 'Optional, personal tracking only', muted: true },
            { t: 'Implementation', s: 'Code, tests, instrumentation' },
            { t: 'Pull request', s: 'The unit of review' },
            { t: 'Code review', s: 'A gate — human judgement', accent: true },
            { t: 'CI', s: 'A gate — automated judgement', accent: true },
            { t: 'Build', s: 'A versioned artifact that evidence can point at' }
          ]},
          { type: 'opmodel', data: {
            inputs: 'A Story that passed the Ready Gate, with Tasks, resolved impact, available design and a stated testability approach.',
            actions: 'Implement each Task, including its tests and instrumentation. Open a pull request. Obtain review. Pass CI. Produce a build.',
            output: 'Merged code and a versioned build artifact.',
            evidence: 'Merged PR with review approval, a green CI run identified by number, and a build identified by version.',
            owner: 'The engineer who takes the Task',
            participants: 'Reviewers, QA where tests are shared',
            decision: 'Reviewers approve; CI passes or fails without negotiation',
            sor: 'Version control and CI system, linked from the Story',
            next: 'Verify. On review or CI failure: correct and re-submit — the work does not leave Deliver.'
          }}
        ]
      },
      {
        id: 's2', title: 'Where each activity belongs', kicker: 'See',
        blocks: [
          { type: 'activitytable', rows: [
            { a: 'Writing implementation code', where: 'Task', evidence: 'Commits on the branch', note: 'The Task is where the front-end, back-end and data work legitimately lives. It never becomes a Story.' },
            { a: 'Writing automated tests for the acceptance criteria', where: 'Task, created at Ready', evidence: 'Tests in the PR, mapped to criteria', note: 'These exist because step 9 of Create a Ready Story made them a Task. If tests are not a Task, they are written when there is time.' },
            { a: 'Adding metrics, logs and alerts', where: 'Task, where the System Design calls for it', evidence: 'Instrumentation in the PR; alert definition', note: 'SD-42 required risk_classification_age_seconds. Observability that is not a Task is observability that does not happen.' },
            { a: 'Database migration', where: 'Task, usually with its own dependency', evidence: 'Migration in the PR; applied in each environment', note: 'The covering index was a Task with a recorded dependency, because the flag could not be enabled before it existed.' },
            { a: 'Opening a pull request', where: 'Against the Story', evidence: 'PR referencing the Story id', note: 'The PR is the unit of review, not the unit of value. One Story may take several PRs.' },
            { a: 'Code review', where: 'A gate inside Deliver', evidence: 'Approvals, and the change requests that were resolved', note: 'A review with no change requests across a whole Feature is worth a look — either the work is exceptional or the review is not happening.' },
            { a: 'Continuous integration', where: 'A gate inside Deliver', evidence: 'Pipeline run number and result', note: 'CI enforces the mechanical parts of the Definition of Done. What can be automated should not be a manual checklist item.' },
            { a: 'Producing a build', where: 'End of Deliver', evidence: 'A version string', note: 'Everything in Verify points at this version. Evidence without a build version is evidence about nothing.' },
            { a: 'Deploying to production', where: 'Release, not Deliver', evidence: 'Deployment record', note: 'Deliver ends at a build. Deploying is a decision made in Release, against criteria.' }
          ]},
          { type: 'artifactcard', data: {
            kind: 'Pull request', id: E.pr.id, name: E.pr.title,
            rows: [
              { k: 'Story', v: E.pr.story },
              { k: 'Tasks included', v: E.pr.contents.join(' · ') },
              { k: 'Review', v: E.pr.review },
              { k: 'CI', v: E.pr.ci },
              { k: 'Build produced', v: E.pr.build },
              { k: 'Definition of Done', v: E.pr.dod }
            ],
            foot: [{ k: 'Evidence', v: 'Approval record, pipeline #8841, build atlas-24.3.0-rc2' }, { k: 'Next', v: 'Verify' }]
          }},
          { type: 'callout', variant: 'note', label: 'Read the review line', text: 'The change request that was raised — a duplicated membership check in the Workspace module — is exactly the failure mode check 5 of the Architecture Impact Check warned about. Re-implementing an existing rule in a second location. Review caught what design anticipated.' }
        ]
      },
      {
        id: 's3', title: 'Definition of Done in Deliver', kicker: 'Understand',
        blocks: [
          { type: 'prose', p: [
            'The Definition of Done is a team-wide standard, referenced once, applied to every Story. Deliver is where most of it is enforced, and as much of it as possible should be enforced by the pipeline rather than by memory.',
            'What cannot be automated — "the observability is actually useful", "the documentation reflects what changed" — stays a review responsibility. What can be automated and is left to a checklist will eventually be skipped under time pressure.'
          ]},
          { type: 'compare', cols: ['Acceptance Criteria', 'Definition of Done'], rows: [
            { k: 'Scope', a: 'This Story only', b: 'Every Story' },
            { k: 'Question', a: 'Did this Story produce the required behaviour?', b: 'Does this work meet our completion standard?' },
            { k: 'Changes', a: 'Per Story', b: 'Rarely, and deliberately' },
            { k: 'Lives', a: 'Inside the Story record', b: 'In team working agreements — one copy' },
            { k: 'Enforced by', a: 'Test cases derived from it', b: 'The pipeline, plus review for what cannot be automated' }
          ]},
          { type: 'callout', variant: 'warning', label: 'The smell', text: 'If you find DoD items copied into Story acceptance criteria, two things are now true: the actual acceptance is buried, and the DoD will drift between Stories. Chapter 12 is the full treatment.' }
        ]
      },
      {
        id: 's4', title: 'Check', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'choice', id: 'ex-10-q1',
            prompt: 'A Story is implemented, reviewed, merged and built. CI is green. Is it done?',
            options: [
              { text: 'Yes — reviewed, merged, green CI is the Definition of Done.', correct: false, explain: 'The DoD is a completion standard for the work. It does not establish that the Story produced the required behaviour — that is what Acceptance Criteria are for, and they are verified in Verify. Passing the DoD and satisfying the acceptance are two different questions.' },
              { text: 'No — Deliver produces a build. Whether it satisfies the Acceptance Criteria is established in Verify, with evidence pointing at that build.', correct: true, explain: 'Correct. Deliver ends at a versioned build. Verify is where criteria are tested and evidence is captured. Conflating them is how "done" comes to mean "merged", which is how unverified work reaches a release.' },
              { text: 'No — it is not deployed to production yet.', correct: false, explain: 'Deployment is a Release activity, decided against release criteria. A Story can be fully verified and deliberately not shipped — STORY-119 was excluded from REL-24.3 for exactly that reason.' },
              { text: 'Yes, provided the PR description mentions the acceptance criteria.', correct: false, explain: 'Mentioning criteria is not verifying them. A claim in a PR description is a claim; test evidence against a build is evidence.' }
            ]
          },
          { type: 'exercise', kind: 'choice', id: 'ex-10-q2',
            prompt: 'An engineer discovers mid-implementation that a behaviour nobody mentioned is needed. What does the model say?',
            options: [
              { text: 'Add a Task and implement it — it is obviously needed.', correct: false, explain: 'This is how Stories acquire behaviour no criterion covers and no test verifies. At release nobody can say what was shipped. Step 9 of Create a Ready Story exists to catch exactly this: no Task may add behaviour no criterion covers.' },
              { text: 'Decide whether it is covered by an existing criterion. If not, it is either a missing criterion — which means re-refining — or it is a new Story.', correct: true, explain: 'Correct. The discovery is legitimate; the question is where it belongs. A missing criterion means the Story goes back to refinement, which may mean re-running part of the Ready Gate. A genuinely new behaviour is a new Story with its own acceptance. Either way it becomes visible.' },
              { text: 'Raise a bug after release.', correct: false, explain: 'It is not a defect — nothing specified it. Filing it as a bug misrepresents what happened and hides the refinement gap that caused it.' },
              { text: 'Add it to the Definition of Done.', correct: false, explain: 'The DoD is a team-wide standard applying to all work. A behaviour specific to one Story has no business in it.' }
            ]
          }
        ]
      },
      {
        id: 's5', title: 'Continue', kicker: 'Continue',
        blocks: [
          { type: 'transform', data: {
            before: 'A Ready Story with Tasks.',
            now: 'Merged code, an approved review, a green pipeline and build atlas-24.3.0-rc2.',
            connects: 'The build version is what all the evidence in Verify will point at.',
            next: 'Chapter 11 — Verify.'
          }}
        ]
      }
    ]
  };

  return [ch06, ch07, ch08, ch09, ch10];
})();
