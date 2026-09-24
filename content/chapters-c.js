/* ============================================================
   CHAPTERS 11 – 16
   ============================================================ */

window.CHAPTERS_C = (function () {
  const E = window.EXAMPLE;

  /* ---------------------------------------------------------
     11 — VERIFY
     --------------------------------------------------------- */

  const ch11 = {
    id: 'ch11', num: 11, title: 'Verify',
    kicker: 'Lifecycle · 06',
    question: 'How do we prove that what we built satisfies what was required?',
    stage: 'verify', scaffold: 'moderate',
    intro: 'Verification is a chain, not an activity. Each link derives from the one above it, and the chain is what makes a release decision possible.',
    sections: [
      {
        id: 's1', title: 'The verification chain', kicker: 'Understand',
        blocks: [
          { type: 'flow', dir: 'col', nodes: [
            { t: 'Requirement', s: 'What must be true' },
            { t: 'Story', s: 'The valuable behaviour that satisfies it' },
            { t: 'Acceptance Criterion', s: 'When this Story is correct' },
            { t: 'Test Case', s: 'How that criterion is verified', accent: true },
            { t: 'Test Execution', s: 'Running it, against a named build' },
            { t: 'Test Evidence', s: 'What actually happened' }
          ]},
          { type: 'prose', p: [
            'Each link derives from the one above. A test case that does not derive from a criterion is testing something nobody asked for. A criterion with no test case is a requirement nobody verified.',
            'Verification begins in Refine, not here. Testability is a Ready Gate condition, and test cases are written from the acceptance criteria before implementation starts. What happens in Verify is execution and evidence capture.'
          ]},
          { type: 'callout', variant: 'principle', label: 'When testing starts', text: 'Testing begins during refinement. If the first time anyone thinks about verification is after the code is written, the Story was never independently testable and the acceptance criteria were never checked for observability.' }
        ]
      },
      {
        id: 's2', title: 'Four things people call "the test plan"', kicker: 'Understand',
        blocks: [
          { type: 'fourup', items: [
            { k: 'Test Strategy', q: 'How do we approach quality for this product?', scope: 'Long-lived, product-wide', owns: 'Test levels, ownership, environments, data approach, automation targets, and the rule for when formal cases are required.', smell: 'Rewritten every release — that is a plan, not a strategy.' },
            { k: 'Release Test Plan', q: 'What is being tested for this release?', scope: 'One release', owns: 'Stories in scope, tests to run, regression scope, environments, exit criteria, sign-off.', smell: 'Written after testing finished, to satisfy an audit.' },
            { k: 'Test Case', q: 'How is this one behaviour verified?', scope: 'One acceptance criterion', owns: 'Preconditions, data, steps, expected result.', smell: '"Verify the feature works."' },
            { k: 'Test Evidence', q: 'What actually happened?', scope: 'One execution', owns: 'Who or what ran it, against which build, in which environment, when, with what result and artifacts.', smell: '"Tested — works."' }
          ]},
          { type: 'callout', variant: 'note', label: 'Necessity', text: 'Test Strategy is Always. Test Evidence is Always. Release Test Plan is release-level and scaled to risk. Formal Test Cases are When needed — decided by a rule, not by habit.' }
        ]
      },
      {
        id: 's3', title: 'Creating a Test Case', kicker: 'Follow',
        blocks: [
          { type: 'steplist', title: 'Create and execute a Test Case', items: [
            { n: 1, t: 'Select the Acceptance Criterion', d: 'One criterion per case. A case covering two criteria cannot tell you which one failed.' },
            { n: 2, t: 'Identify the scenario', d: 'Name the situation in one line. It should read as a fact about the world, not as an instruction.' },
            { n: 3, t: 'Define preconditions', d: 'Everything that must be true before step one: identity, membership, flags, clock. Vague preconditions are the main cause of tests that pass for the wrong reason.' },
            { n: 4, t: 'Define test data', d: 'Exact values. "A late deliverable" is not data; "D-1, due 2026-03-20, status In progress" is.' },
            { n: 5, t: 'Define the steps', d: 'What the tester or the automation does, in order, with no interpretation required.' },
            { n: 6, t: 'Define the expected result', d: 'Observable and complete. Say what must appear and what must not.' },
            { n: 7, t: 'Execute against a named build', d: 'Evidence that does not identify the build is evidence about nothing.' },
            { n: 8, t: 'Record the result', d: 'Pass, fail, or blocked. A blocked case is information, not an absence.' },
            { n: 9, t: 'Capture the evidence', d: 'Run id, logs, screenshots, session notes. Including the failures and their resolution.' }
          ]},
          { type: 'testcards', cases: E.testCases },
          { type: 'callout', variant: 'note', label: 'Why the second case matters', text: 'TC-114-05 verifies that something does not appear. Exclusion cases are the ones most often skipped, and they are the ones that catch a rule written slightly too wide. AC-5 exists because someone asked what happens to a deliverable that is past due but finished.' }
        ]
      },
      {
        id: 's4', title: 'Write one yourself', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'build', id: 'ex-11-tc',
            prompt: 'Write a Test Case.',
            brief: 'Take AC-3 from STORY-114: <em>"Given a deliverable due within 3 working days and not Complete, when I open the at-risk view, then it appears with the classification At risk."</em> Write the case that verifies it — including the boundary.',
            fields: [
              { id: 'pre', label: 'Preconditions', hint: 'Everything true before step one. Remember what the Ready Gate failure taught you about time.', rows: 4,
                checks: [
                  { type: 'minWords', value: 8, level: 'bad', msg: 'Not enough. List identity, membership, flags and anything time-related.' },
                  { type: 'includesAny', value: ['clock', 'date', 'time', 'fixed', 'reference'], level: 'warn', msg: 'No fixed reference time. This criterion counts working days from "today" — without a fixed clock the case passes on some days and fails on others. That is the exact defect the Ready Gate caught.' }
                ]
              },
              { id: 'data', label: 'Test data', hint: 'Exact values, not descriptions. Include a case at the boundary.', rows: 4,
                checks: [
                  { type: 'minWords', value: 8, level: 'bad', msg: 'Give exact values — identifiers, dates, statuses.' },
                  { type: 'includesDigit', level: 'bad', msg: 'No concrete values. "A deliverable due soon" cannot be executed the same way twice.' }
                ]
              },
              { id: 'steps', label: 'Steps', hint: 'What is done, in order, requiring no interpretation.', rows: 4,
                checks: [{ type: 'minWords', value: 8, level: 'bad', msg: 'Too short to be followed by someone else.' }]
              },
              { id: 'exp', label: 'Expected result', hint: 'What must appear — and what must not.', rows: 4,
                checks: [
                  { type: 'minWords', value: 10, level: 'bad', msg: 'Too short to be observable.' },
                  { type: 'includesAny', value: ['not ', 'does not', 'no ', 'must not', 'absent'], level: 'warn', msg: 'You have said what appears but not what must not. Stating the negative is what catches a rule written too wide.' }
                ]
              }
            ],
            sampleLabel: 'How an expert wrote it',
            sample: [
              { k: 'Preconditions', v: 'PM is a member of project P-1. Feature flag enabled for the account. System clock fixed at 2026-03-24 09:00 UTC, a Tuesday. Holiday calendar contains no holidays in the window under test.' },
              { k: 'Test data', v: 'D-3 in P-1, due 2026-03-26 (2 working days out), status In progress, owner = PM. D-4 in P-1, due 2026-03-27 (3 working days out), status In progress. D-5 in P-1, due 2026-03-30 (4 working days out — crosses the weekend), status In progress.' },
              { k: 'Steps', v: '1. Sign in as the PM. 2. Open the at-risk view. 3. Record which of D-3, D-4, D-5 appear and with what classification.' },
              { k: 'Expected result', v: 'D-3 and D-4 both appear with classification At risk. D-5 does not appear at all. No deliverable appears with classification Late.' },
              { k: 'Why D-4 and D-5', v: 'D-4 sits exactly on the boundary and D-5 sits one working day outside it, across a weekend. A case that only tests D-3 passes whether the rule counts working days or calendar days. The boundary values are what make this case verify the criterion rather than resemble it.' },
              { k: 'Why the negative', v: '"No deliverable appears with classification Late" catches a classifier that puts everything in the more severe bucket — which would otherwise pass a check that only looks for the presence of D-3.' }
            ]
          }
        ]
      },
      {
        id: 's5', title: 'Evidence', kicker: 'Evidence',
        blocks: [
          { type: 'artifactcard', data: {
            kind: 'Test evidence', id: E.testEvidence.id, name: 'Verification of the at-risk capability',
            rows: [
              { k: 'Build', v: E.testEvidence.build },
              { k: 'Environment', v: E.testEvidence.environment },
              { k: 'Executed by', v: E.testEvidence.executedBy },
              { k: 'Date', v: E.testEvidence.date },
              { k: 'Results', v: { pairs: E.testEvidence.results.map(function (r) { return { k: r.case + ' — ' + r.result, v: r.note }; }) } },
              { k: 'Artifacts', v: { list: E.testEvidence.artifacts } }
            ],
            foot: [{ k: 'System of record', v: 'QA/test system' }, { k: 'Feeds', v: 'The release decision for REL-24.3' }]
          }},
          { type: 'claimevidence', data: {
            claim: '"Risk classification works."',
            evidence: E.testEvidence.claimVsEvidence,
            note: 'Notice the third result: a failure, then a fix, then a re-run. Evidence that contains no failures across a whole release is usually evidence that was assembled rather than captured.'
          }},
          { type: 'trace' },
          { type: 'callout', variant: 'principle', label: 'On traceability', text: 'The point of the chain is not audit. It is that at release time, someone can ask "does this satisfy REQ-03?" and the answer is a path, not an opinion.' }
        ]
      },
      {
        id: 's6', title: 'When to be formal', kicker: 'Judgement',
        blocks: [
          { type: 'dtree', ruleId: 'dr-testcase' },
          { type: 'checklist', id: 'cl-verify', title: 'Verify — procedural checklist', items: [
            'Every Acceptance Criterion has a stated verification approach',
            'Formality decided by rule, not by habit',
            'One test case per criterion where formal cases are used',
            'Preconditions include identity, membership, flags and clock',
            'Test data given as exact values',
            'Boundary values included for any rule with a number in it',
            'Expected result states what must appear and what must not',
            'Executed against a named build version',
            'Results recorded including blocked cases',
            'Evidence captured including failures and their resolution',
            'Each criterion traceable to its requirement'
          ]}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     12 — ACCEPTANCE CRITERIA VS DEFINITION OF DONE
     --------------------------------------------------------- */

  const ch12 = {
    id: 'ch12', num: 12, title: 'Acceptance Criteria vs Definition of Done',
    kicker: 'Distinction',
    question: 'Which question is this condition answering?',
    stage: 'verify', scaffold: 'moderate',
    intro: 'Two different questions, routinely merged, with expensive consequences. This chapter is short, visual, and worth the time.',
    sections: [
      {
        id: 's1', title: 'Two questions', kicker: 'Understand',
        blocks: [
          { type: 'versus', data: {
            left: { k: 'Acceptance Criteria', q: 'Did this Story produce the required behaviour?', points: ['Story-specific', 'Behaviour-focused', 'Changes with every Story', 'Defines acceptance', 'Lives inside the Story', 'Verified by test cases derived from it'] },
            right: { k: 'Definition of Done', q: 'Does this work meet our completion standard?', points: ['Team-wide', 'Completion-focused', 'Relatively stable', 'Defines Done', 'Lives in team working agreements', 'Enforced by the pipeline and review'] }
          }},
          { type: 'prose', p: [
            'Both must be satisfied. Neither substitutes for the other. A Story can meet the entire Definition of Done and still not do what was required, and it can do exactly what was required while failing the completion standard.'
          ]},
          { type: 'compare', cols: ['Acceptance Criteria', 'Definition of Done'], rows: [
            { k: 'Scope', a: 'One Story', b: 'All Stories' },
            { k: 'Author', a: 'Product lead with QA, per Story', b: 'The team, once' },
            { k: 'Stability', a: 'New every time', b: 'Changed rarely and deliberately' },
            { k: 'Failure means', a: 'The behaviour is wrong', b: 'The work is incomplete' },
            { k: 'Where recorded', a: 'Inside the Story record', b: 'Team working agreements — one copy' },
            { k: 'How verified', a: 'Test cases derived from each criterion', b: 'Pipeline checks, plus review for what cannot be automated' },
            { k: 'Typical smell', a: '"Works as expected"', b: 'Routinely waived under time pressure' }
          ]}
        ]
      },
      {
        id: 's2', title: 'Why copying the DoD in is a smell', kicker: 'Understand',
        blocks: [
          { type: 'prose', p: [
            'It buries the actual acceptance. When four of six criteria are "code reviewed" and "tests written", the two that describe the behaviour are lost in the noise, and the reader skims all six.',
            'It guarantees drift. Copies do not update. Six months after the DoD changes, half the Stories reference the old standard and nobody can tell which half.',
            'It makes waiving invisible. A DoD waived once, in one Story, with no record, is how standards quietly stop applying.',
            'And it hides gaps. A Story whose acceptance is entirely DoD items has no acceptance at all — but the field is full, so nothing looks wrong.'
          ]},
          { type: 'badgood', data: {
            bad: { label: 'DoD copied into the Story', q: 'STORY-114 acceptance, as first drafted', list: ['Dashboard works', 'Looks good on mobile', 'Code reviewed and unit tested', 'Deployed to staging'] },
            good: { label: 'Referenced, not copied', q: 'STORY-114 acceptance', list: ['7 criteria covering happy path, three exclusions, permission, accessibility and empty state', 'Definition of Done: referenced, enforced by pipeline #8841'] },
            why: 'In the first version, two of four items are team standards and two are unobservable opinions. Nothing there defines when this Story is correct, yet every field is filled in — which is why it survived review. The second version separates the two questions and lets each be verified by the mechanism suited to it.',
            repair: 'Move every team-wide condition to the one published DoD and reference it. Then ask, for the behaviour that remains: how would someone outside the team know this was correct?'
          }}
        ]
      },
      {
        id: 's3', title: 'Classify them', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'classify', id: 'ex-12-acdod',
            prompt: 'For each condition, decide where it belongs.',
            buckets: [
              { id: 'ac', label: 'Acceptance Criteria' },
              { id: 'dod', label: 'Definition of Done' },
              { id: 'neither', label: 'Neither' }
            ],
            items: [
              { text: 'Given a deliverable past due and not Complete, it appears with classification Late.', answer: 'ac', explain: 'Acceptance Criteria — specific to this Story\'s behaviour, observable, and directly testable.' },
              { text: 'All new code is covered by automated tests.', answer: 'dod', explain: 'Definition of Done — a team-wide standard applying to every Story. Enforce it in the pipeline; reference it once.' },
              { text: 'Given a PM is a member of no projects, an empty state is shown rather than an error.', answer: 'ac', explain: 'Acceptance Criteria — a failure case specific to this behaviour. Empty states are among the most commonly omitted criteria and among the most commonly reported defects.' },
              { text: 'The change has been reviewed and approved by at least one other engineer.', answer: 'dod', explain: 'Definition of Done — team-wide, unchanging, enforced by the review process.' },
              { text: 'The at-risk view renders within 1.5 seconds at p95 for 2,000 deliverables.', answer: 'ac', explain: 'Acceptance Criteria for STORY-115 — it is that Story\'s behaviour. This one is arguable: some teams put a general performance budget in the DoD. The test is whether it is specific to this Story (AC) or applies unchanged to every Story (DoD). A budget of 1.5s at 2,000 deliverables describes this view, so it is AC.' },
              { text: 'No new critical or high security findings.', answer: 'dod', explain: 'Definition of Done — applies to all work, enforced by the scanner in CI.' },
              { text: 'The team should communicate better during refinement.', answer: 'neither', explain: 'Neither. It is not an observable condition of a Story, and it is not a completion standard that could pass or fail. It is a retrospective item — a real one, but it belongs in a different conversation entirely.' },
              { text: 'Late and At risk are distinguishable without relying on colour alone.', answer: 'ac', explain: 'Acceptance Criteria — it comes directly from REQ-04. Note it could have been a DoD item if the team had a general accessibility standard; here it is AC because it is the specific accessibility condition this behaviour must meet, and it is what TC-114-06 verifies.' },
              { text: 'Documentation is updated where behaviour changed.', answer: 'dod', explain: 'Definition of Done — a team-wide completion standard. It is also the kind of item that cannot be fully automated, so it stays a review responsibility.' },
              { text: 'The Story is in the current sprint.', answer: 'neither', explain: 'Neither. Sprint membership is a planning fact, not a condition of correctness or completion. A Story does not become more done by being in an iteration.' }
            ]
          }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     13 — RELEASE
     --------------------------------------------------------- */

  const ch13 = {
    id: 'ch13', num: 13, title: 'Release',
    kicker: 'Lifecycle · 07',
    question: 'How do we safely ship completed work?',
    stage: 'release', scaffold: 'low',
    intro: 'A Release is a shipping boundary with a recorded decision. It is not a hierarchy level, not a sprint, and not a synonym for a deployment.',
    sections: [
      {
        id: 's1', title: 'What a Release is not', kicker: 'Understand',
        blocks: [
          { type: 'notrelease', rows: [
            { k: 'Not an Initiative', d: 'An Initiative holds intent and stays open until its objective is met. A Release holds a set of changes and closes in days.' },
            { k: 'Not an Epic or Feature', d: 'Those are capability containers with parents and children. A Release references work from anywhere in the hierarchy, including unrelated Initiatives.' },
            { k: 'Not a Story', d: 'A Story is one valuable behaviour with its own acceptance. A Release has criteria, not acceptance.' },
            { k: 'Not a Sprint', d: 'A Sprint is a time box for planning. A Release is a decision to ship. Work completed in a sprint may sit unreleased for weeks — deliberately.' },
            { k: 'Not a deployment', d: 'Deployment is one step inside the Release procedure, after the decision. The decision is the part that matters.' }
          ]},
          { type: 'callout', variant: 'principle', label: 'The rule', text: 'A Release is a shipping boundary, not a hierarchy level. It references Stories; it parents none. Model it as a reference set and the confusion disappears.' }
        ]
      },
      {
        id: 's2', title: 'The fourteen steps', kicker: 'Follow',
        blocks: [
          { type: 'opmodel', data: {
            inputs: 'Verified Stories with evidence. A Test Strategy. Known dependencies. Release criteria agreed in advance.',
            actions: 'The fourteen steps below.',
            output: 'A deployed, production-verified release and a closed release record.',
            evidence: 'Criteria evaluated against evidence, a dated go/no-go decision with a named owner, a deployment record, and production verification results.',
            owner: 'Release manager or delivery lead',
            participants: 'QA lead, engineering lead, product lead, operations',
            decision: 'The named release decision maker — agreed before the release, not during it',
            sor: 'Release record',
            next: 'Operate. On a no-go: the failing criterion names what must change and the release re-scopes or waits.'
          }},
          { type: 'steplist', title: 'Run a release', items: [
            { n: 1, t: 'Define the release objective', d: 'What this release is for, in one sentence. It is what scope arguments are judged against.' },
            { n: 2, t: 'Select eligible Stories', d: 'Eligible means verified with evidence against a build. Not "nearly done".' },
            { n: 3, t: 'Confirm scope', d: 'Walk the selected Stories with the people who built them. Surprises surface here, cheaply.' },
            { n: 4, t: 'Confirm dependencies', d: 'Migrations, flags, third parties, other teams. Each with an owner and a state, not an assumption.' },
            { n: 5, t: 'Define what is out of scope', d: 'Explicitly, with reasons. This is what stops a release growing during its final days.' },
            { n: 6, t: 'Create the Release Test Plan', d: 'What will be tested, what regression scope, in what environment, with what exit criteria — written before testing starts.' },
            { n: 7, t: 'Implement', d: 'Any remaining work, including the release-specific pieces like flags and migrations.' },
            { n: 8, t: 'Verify', d: 'Execute the plan. Record blocked cases as well as passes and failures.' },
            { n: 9, t: 'Collect evidence', d: 'Against the release build version. Evidence pointing at a different build is not evidence for this release.' },
            { n: 10, t: 'Evaluate release criteria', d: 'Each criterion, against the evidence, answered yes or no. Not "broadly yes".' },
            { n: 11, t: 'Make the release decision', d: 'A named person, a date, a go or no-go, recorded. This is the step that makes it a Release rather than a deployment.' },
            { n: 12, t: 'Deploy', d: 'Following the rollout plan, including flags and staged enablement.' },
            { n: 13, t: 'Verify production', d: 'Against the things you said would be true. Smoke, performance, the metrics the design added.' },
            { n: 14, t: 'Close the release', d: 'After the soak period, with the outcome recorded — including anything that went wrong.' }
          ]},
          { type: 'releasecard' }
        ]
      },
      {
        id: 's3', title: 'The excluded Story', kicker: 'See',
        blocks: [
          { type: 'prose', p: [
            'STORY-119 — acknowledge a flagged deliverable — was in the Feature, was requested by users during refinement, and did not ship.',
            'Its Ready Gate failed on undefined acceptance: nobody could say what "acknowledged" meant when the deliverable\'s status later changed, or whether an acknowledgement expired. Those are not implementation details; they are the behaviour. The correction needed a product decision that was not available before the release window closed.',
            'It was excluded explicitly, with the reason recorded, rather than rushed. Three chapters later it comes back — because Operate produced the same request again, this time with evidence of why it matters.'
          ]},
          { type: 'callout', variant: 'note', label: 'What this demonstrates', text: 'A gate that holds under release pressure is the only kind that is real. The recorded exclusion is also what made the later conversation easy: the reason was written down, so nobody had to reconstruct it.' }
        ]
      },
      {
        id: 's4', title: 'The release decision', kicker: 'Gate',
        lede: 'You are the release decision maker for REL-24.3. Evidence is in front of you.',
        blocks: [
          { type: 'gate', id: 'gate-release', title: 'Release Gate', sub: 'REL-24.3 — go or no-go?',
            checks: [
              { id: 'rl1', q: 'Are all in-scope Stories verified with evidence against the release build?', cond: 'Evidence exists, identifies build atlas-24.3.0-rc2, and covers every in-scope Story.',
                fail: { what: 'Something is being shipped on the strength of a claim rather than evidence.', returnTo: 'Release step 9 — collect evidence', correct: 'Identify which Story lacks evidence. Either execute and capture it, or remove the Story from scope.', recheck: 'Evidence coverage against the build', owner: 'QA lead' } },
              { id: 'rl2', q: 'Are there open severity 1 or 2 defects against in-scope Stories?', cond: 'No open severity 1 or 2 defects. Answer "yes, conditions met" only if there are none.',
                fail: { what: 'A known serious defect is being shipped, and the decision to ship it is being made implicitly.', returnTo: 'Verify', correct: 'Fix and re-verify, or remove the affected Story from scope, or explicitly accept the defect with a named owner and a date — recorded on the release.', recheck: 'Defect list', owner: 'Engineering lead' } },
              { id: 'rl3', q: 'Have the non-functional criteria been demonstrated?', cond: 'p95 render within 1.5s at 2,000 deliverables, demonstrated and recorded.',
                fail: { what: 'An NFR is being taken on trust. NFRs untested before release are found by customers after it.', returnTo: 'Release step 8 — verify', correct: 'Run the load scenario and record the result. If it fails, this is a no-go, not a note.', recheck: 'Performance evidence', owner: 'QA lead' } },
              { id: 'rl4', q: 'Has the rollback path been exercised?', cond: 'Rollback demonstrated in staging, including the index and the flag.',
                fail: { what: 'The recovery plan is theoretical. Untested rollbacks fail exactly when they are needed.', returnTo: 'Release step 6 — test plan', correct: 'Exercise rollback in staging and record it. Include any migration that cannot be reversed — if one exists, say so explicitly.', recheck: 'Rollback evidence', owner: 'Engineering lead' } },
              { id: 'rl5', q: 'Are the Initiative success metrics emitting before enablement?', cond: 'risk_classification_age_seconds and the flag-before-miss measurement are live before the flag is enabled anywhere.',
                fail: { what: 'You will not be able to tell whether the Initiative succeeded, because no baseline was captured.', returnTo: 'Release step 4 — confirm dependencies', correct: 'Deploy the measurement before enabling the capability. This is why REQ-09 existed.', recheck: 'Metrics emitting', owner: 'Engineering lead' } },
              { id: 'rl6', q: 'Is the out-of-scope list explicit and agreed?', cond: 'Everything excluded is listed with a reason, and the people who requested it know.',
                fail: { what: 'Someone will discover after release that their work was silently dropped.', returnTo: 'Release step 5', correct: 'Write the exclusions with reasons and tell the requesters before the deployment, not after.', recheck: 'Scope record', owner: 'Release manager' } }
            ],
            passText: 'Go. Record the decision with your name and the date. Deploy per the rollout plan — flag to 5% of accounts for 48 hours, index verified present before enablement. Then verify production against the things you said would be true, and close the release only after the soak period.',
            failText: 'No-go, or a conditional go with the failing condition explicitly accepted, recorded, and owned. A no-go is not a failure of the release — it is the gate doing exactly what it exists for. Correct the failed conditions at the steps named, then re-evaluate those conditions.'
          }
        ]
      },
      {
        id: 's5', title: 'Production verification', kicker: 'Evidence',
        blocks: [
          { type: 'prodverify' },
          { type: 'claimevidence', data: {
            claim: '"The release went fine."',
            evidence: 'Deployed 27 March 14:10 UTC, build atlas-24.3.0. Index verified present before enablement. Smoke passed on three internal accounts. p95 render 1.08s over the first hour. Classification age p95 at 4s. Primary database CPU up 2.1%, within the estimate in ADR-014. Closed 30 March after 72 hours at full rollout with no severity 1 or 2 defects.',
            note: 'The CPU line is worth noticing: ADR-014 accepted a consequence of "under 3%". Production verification checked the number the decision record predicted. That is what closes the loop between a decision and its consequences.'
          }}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     14 — OPERATE
     --------------------------------------------------------- */

  const ch14 = {
    id: 'ch14', num: 14, title: 'Operate',
    kicker: 'Lifecycle · 08',
    question: 'Is it healthy, and what are we learning?',
    stage: 'operate', scaffold: 'low',
    intro: 'Delivery does not end at deployment. Operate is where the success criteria written in Discover are finally tested against reality — and where the next requirements come from.',
    sections: [
      {
        id: 's1', title: 'The loop closes', kicker: 'Understand',
        blocks: [
          { type: 'cycle' },
          { type: 'prose', p: [
            'Every signal in Operate is a candidate requirement. None of them is a new process: a bug, a piece of feedback and an incident all re-enter at Refine and are subject to the same gates as anything else.',
            'The Initiative stays open. INIT-42 is not complete because REL-24.3 shipped — it is complete when its success criteria are met, or when someone decides explicitly to stop pursuing them. That decision is itself recorded.'
          ]},
          { type: 'opmodel', data: {
            inputs: 'A deployed release. The success criteria from the Initiative. Monitoring, feedback channels and support.',
            actions: 'Monitor against the criteria. Observe behaviour. Collect feedback. Triage bugs and incidents. Raise new requirements.',
            output: 'Operational signals, and requirements that re-enter Refine.',
            evidence: 'Measurements against the Discover success criteria; routed feedback with decisions recorded.',
            owner: 'Product lead for outcome signals; engineering lead for operational health',
            participants: 'Support, operations, customer success',
            decision: 'Product lead decides which signals become requirements',
            sor: 'Monitoring, feedback channels, and the work management system for anything that becomes work',
            next: 'Refine. The cycle continues until the Initiative objective is met or abandoned.'
          }}
        ]
      },
      {
        id: 's2', title: 'What Atlas learned', kicker: 'See',
        blocks: [
          { type: 'signals' },
          { type: 'prose', p: [E.operate.loop] },
          { type: 'callout', variant: 'principle', label: 'The distinction that matters here', text: 'A metric below target is a signal, not a defect. The flag-before-miss rate of 34% means the capability works and the outcome has not yet arrived — which is a product question, handled in Refine. The public-holiday bug is a defect against a specific criterion, handled as a Story. Treating the first as a bug would send the team to fix code that is behaving as specified.' }
        ]
      },
      {
        id: 's3', title: 'Route the signals', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'classify', id: 'ex-14-route',
            prompt: 'Each of these arrived in the week after REL-24.3. Where does it go?',
            buckets: [
              { id: 'defect', label: 'Defect against a criterion' },
              { id: 'requirement', label: 'New requirement → Refine' },
              { id: 'signal', label: 'Signal — monitor, no work yet' },
              { id: 'incident', label: 'Incident response' }
            ],
            items: [
              { text: 'Deliverables due on a public holiday are flagged a day late.', answer: 'defect', explain: 'A defect against AC-3 — the criterion says 3 working days and the implementation counted a holiday as a working day. Note it is still refined as a Story with its own acceptance, not patched silently. A defect is not an exemption from the model.' },
              { text: 'PMs report the list gets noisy after the first look — the same items keep appearing after they have been acted on.', answer: 'requirement', explain: 'A new requirement. Nothing specified acknowledgement, so nothing is broken. This became REQ-11 → STORY-119, the Story deliberately excluded from REL-24.3 — now arriving with evidence of why it matters.' },
              { text: 'Flag-before-miss rate is 34% against a 50% target in week three.', answer: 'signal', explain: 'A signal. The capability works as specified; the outcome has not yet arrived. Three weeks is early for a behaviour-change metric. Monitor, and if it plateaus, that is a product question for Refine — not a code fix.' },
              { text: 'The Delivery module was unavailable for 9 minutes; the risk-unavailable state was shown as designed.', answer: 'incident', explain: 'Incident response handles the outage. But notice the second half: a failure mode named in SD-42 was exercised in production and held. That is recorded as evidence the design was right — which is the rarest and most useful kind of operational finding.' },
              { text: 'Median identification time measured at 14 seconds against a 30-second target.', answer: 'signal', explain: 'A signal, and a success criterion met. It still gets monitored rather than closed — one good week is not an outcome. This is the measurement that REQ-09 existed to make possible.' },
              { text: 'An account with 4,100 deliverables reports the view taking 4 seconds.', answer: 'signal', explain: 'Arguable, and worth the argument. The NFR specified 2,000 deliverables, so this is outside the stated envelope — not a defect. It is a signal that the supported range may be wrong, which is a product and architecture question for Refine. Filing it as a bug would send engineers to optimise against a requirement nobody agreed to.' }
            ]
          }
        ]
      },
      {
        id: 's4', title: 'Continue', kicker: 'Continue',
        blocks: [
          { type: 'transform', data: {
            before: 'A shipped, production-verified release.',
            now: 'Measurements against the Discover criteria, and five signals routed.',
            connects: 'Two of the five re-enter Refine as requirements against the still-open INIT-42.',
            next: 'Chapter 15 — you run the model, on new work, with no worked example to follow.'
          }}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     15 — RUN THE MODEL
     --------------------------------------------------------- */

  const ch15 = {
    id: 'ch15', num: 15, title: 'Run the Model',
    kicker: 'Independent practice',
    question: 'Can you do this on work you have never seen?',
    stage: null, scaffold: 'none',
    intro: 'No worked example this time. No expert answer before you commit. You are the delivery team.',
    sections: [
      {
        id: 's1', title: 'The request', kicker: 'Start here',
        blocks: [
          { type: 'brief' },
          { type: 'callout', variant: 'principle', label: 'How this chapter works', text: 'Each stage asks you to produce something, then checks it. Expert answers exist, but they only unlock after you have committed yours. The checks are stricter than earlier chapters and the prompts are thinner. That is deliberate.' }
        ]
      },
      {
        id: 's2', title: 'Discover', kicker: 'Stage 01',
        blocks: [
          { type: 'exercise', kind: 'build', id: 'sim-discover',
            prompt: 'Produce the Discover output.',
            brief: 'Start from the raw request. Remember: strike the solution words first.',
            fields: [
              { id: 'problem', label: 'Problem statement', hint: 'Who has it, what is bad today, and how you would know.', rows: 4,
                checks: [
                  { type: 'minWords', value: 20, level: 'bad', msg: 'A problem statement needs who, what is bad, and evidence. This is too thin to refine from.' },
                  { type: 'excludesAny', value: ['dashboard', 'easier way', 'new interface'], level: 'bad', msg: 'The solution from the request is still in your problem statement.' }
                ]
              },
              { id: 'objective', label: 'Objective', hint: 'A change in the world. Apply the two-solutions test before you commit.', rows: 3,
                checks: [
                  { type: 'minWords', value: 8, level: 'bad', msg: 'Too short to describe a change.' },
                  { type: 'excludesAny', value: ['build ', 'ship ', 'create a', 'add a'], level: 'bad', msg: 'This names something you would build. An objective describes the change, not the deliverable.' }
                ]
              },
              { id: 'success', label: 'Success criteria', hint: 'Two or three. Each needs a direction and a measurement source.', rows: 4,
                checks: [
                  { type: 'minWords', value: 15, level: 'bad', msg: 'Not enough for two criteria with measurement sources.' },
                  { type: 'includesDigit', level: 'warn', msg: 'No numbers. A criterion without a direction and a magnitude cannot be met or missed.' }
                ]
              },
              { id: 'outofscope', label: 'Explicitly out of scope', hint: 'At least two, each with a reason. This is the field most people leave empty.', rows: 3,
                checks: [
                  { type: 'minWords', value: 10, level: 'bad', msg: 'Name at least two things that are out, with reasons.' },
                  { type: 'includesAny', value: ['because', 'since', '—', '-', 'reason'], level: 'warn', msg: 'No reasons given. An out-of-scope list without reasons gets reopened the first time someone asks.' }
                ]
              }
            ],
            sampleLabel: 'One defensible answer',
            sample: [
              { k: 'Note first', v: 'There is no single right answer. What follows is one defensible reading. Compare structure and rigour, not wording.' },
              { k: 'Problem', v: 'Project managers at agencies maintain project structure by hand — creating projects from scratch each time, renaming them as client engagements shift, and leaving finished projects in their active list because there is no way to put them away. The active list grows until it stops being a working view, and PMs start keeping a parallel list elsewhere. Evidence to gather: count of projects per account against count touched in the last 30 days; support conversations mentioning "old projects"; observed time to set up a new project.' },
              { k: 'Objective', v: 'Make it possible for a project manager to keep their working set of projects accurate without maintaining a parallel list.' },
              { k: 'Success criteria', v: '1. Median ratio of active projects to projects touched in the last 30 days falls below 1.5, from a baseline to be measured. 2. Time to set up a new project from an existing shape drops below 2 minutes, from an observed baseline of 8–12. 3. Support conversations about finding or cleaning up old projects fall by half quarter over quarter.' },
              { k: 'Explicitly out', v: 'Deleting projects — because it raises data retention and audit questions that belong in their own Initiative. Project templates shared across accounts — because it is a distinct capability with its own permission model, and bundling it would triple the scope. Bulk operations across many projects at once — deferred until we see whether single-project actions are enough.' },
              { k: 'What to notice', v: 'The request said "easier way to manage their projects". The problem found underneath it is about the working set going stale, which is a different thing and suggests archiving matters more than creation. A PM who could only have one of the two would probably choose archiving — and you would not know that without doing Discover.' }
            ]
          }
        ]
      },
      {
        id: 's3', title: 'Discover Gate', kicker: 'Gate 01',
        blocks: [
          { type: 'gate', id: 'gate-sim-discover', title: 'Discover Gate', sub: 'Judge your own Discover output honestly',
            checks: [
              { id: 'sd1', q: 'Does your problem statement name a role and a countable signal?', cond: 'Not "users". Not "they want it".',
                fail: { what: 'You have a preference, not a problem.', returnTo: 'Discover step 1', correct: 'Name the role. Name something you could count, and where you would count it.', recheck: 'Problem statement', owner: 'You' } },
              { id: 'sd2', q: 'Does your objective pass the two-solutions test?', cond: 'Name two genuinely different solutions that would satisfy it. If you cannot, it is a solution.',
                fail: { what: 'The solution was decided before the problem was understood.', returnTo: 'Discover step 2', correct: 'Delete every noun you could build. Rewrite as a change in the world.', recheck: 'Objective', owner: 'You' } },
              { id: 'sd3', q: 'Does each success criterion have a measurement source?', cond: 'You can say where the number comes from, or you captured building the measurement as work.',
                fail: { what: 'You will not be able to tell whether this succeeded.', returnTo: 'Discover step 4', correct: 'Name the source per criterion. Where none exists, make it a requirement or delete the criterion.', recheck: 'Success criteria', owner: 'You' } },
              { id: 'sd4', q: 'Is anything explicitly out of scope, with reasons?', cond: 'At least two items, each with a reason.',
                fail: { what: 'Every adjacent idea remains arguable for the whole Initiative.', returnTo: 'Discover step 5', correct: 'Ask what the most enthusiastic stakeholder would add. Rule on each, in writing.', recheck: 'Scope boundary', owner: 'You' } }
            ],
            passText: 'Discover holds. Move to Refine: read your objective and discover what must be true for it.',
            failText: 'Correct the failed conditions before refining. Requirements discovered from a defective objective inherit the defect — and you will not find out until the Ready Gate, or later.'
          }
        ]
      },
      {
        id: 's4', title: 'Refine and decide', kicker: 'Stage 02',
        blocks: [
          { type: 'exercise', kind: 'build', id: 'sim-refine',
            prompt: 'Discover requirements and make the architecture call.',
            brief: 'Atlas context you already have: a modular monolith; the Delivery module owns projects, milestones and deliverables; the Workspace module renders the project list; ADR-006 forbids cross-module direct table reads; the reporting replica lags up to 90 seconds.',
            fields: [
              { id: 'reqs', label: 'Four requirements, each classified', hint: 'Format: text — FUNCTIONAL / BUSINESS / UX / NFR. Include at least one NFR with a number, and at least one that came from asking what must never happen.', rows: 7,
                checks: [
                  { type: 'minWords', value: 30, level: 'bad', msg: 'Four requirements need more than this. Each should be a single testable statement.' },
                  { type: 'includesAny', value: ['nfr', 'non-functional', 'NFR'], level: 'warn', msg: 'No NFR visible. Archiving raises questions about what happens to large project sets, and about who may archive — both are non-functional.' },
                  { type: 'includesDigit', level: 'warn', msg: 'No numbers anywhere. An NFR without a number cannot pass or fail.' }
                ]
              },
              { id: 'impact', label: 'Architecture impact outcome, and which check triggered it', hint: 'No impact / Contained / Structural — and name the check number and what it found.', rows: 4,
                checks: [
                  { type: 'minWords', value: 12, level: 'bad', msg: 'State the outcome and name the check that produced it.' },
                  { type: 'includesAny', value: ['no impact', 'contained', 'structural'], level: 'bad', msg: 'State one of the three outcomes explicitly.' }
                ]
              },
              { id: 'design', label: 'Do you need a System Design and an ADR? Justify both.', hint: 'Apply the decision rules. "Probably" is not an answer.', rows: 4,
                checks: [
                  { type: 'minWords', value: 15, level: 'bad', msg: 'Justify each separately against its rule.' }
                ]
              }
            ],
            sampleLabel: 'One defensible answer',
            sample: [
              { k: 'Requirements', v: 'R1: A project manager can archive a project they own, removing it from active views without deleting its data. — FUNCTIONAL. R2: An archived project remains readable and can be restored to active by any member who could archive it. — FUNCTIONAL. R3: Archiving a project never changes the data inside it — milestones, deliverables, comments and history are unaffected. — NFR (data integrity), and it came from asking what must never happen. R4: A project list containing up to 2,000 projects, of which most are archived, still renders within the existing 200ms page budget at p95. — NFR.' },
              { k: 'Impact outcome', v: 'Contained. Check 2 is clean — the Delivery module already owns projects and can hold an archived state. Check 3 triggers: the Workspace module renders the project list and must now filter by archived state, which is Delivery-owned data it does not have. Check 8 confirms ADR-006 rules out reading the table directly, so the existing published project interface must carry the state. Check 6 is worth a look — a partial index on active projects keeps the common query cheap — but it does not change the structure.' },
              { k: 'System Design', v: 'Yes, scoped narrowly: the interface change, the state field and its migration, the default filtering behaviour, and what happens to existing views and saved filters. Apply the rule: the requirement does not need a new component, but it does change a published contract and a data question crosses a boundary — that is contained impact, and contained impact produces a design.' },
              { k: 'ADR', v: 'Probably not — and the reasoning matters more than the answer. There is one real decision: soft state on the project versus a separate archive store. If the team picks soft state because it is the obvious fit and nothing forces the alternative, that is following an existing pattern, not choosing between alternatives. If a retention obligation made an archive store genuinely viable, alternatives would exist, reversal would be expensive, and an ADR would be required. Decide on the ground, not by default.' },
              { k: 'What to notice', v: 'R3 is the requirement most people miss, and it comes only from asking the negative question. Without it, "archive" and "hide" become indistinguishable during implementation — and someone will eventually implement it as a delete with a flag.' }
            ]
          }
        ]
      },
      {
        id: 's5', title: 'Decompose and slice', kicker: 'Stage 03',
        blocks: [
          { type: 'exercise', kind: 'build', id: 'sim-slice',
            prompt: 'Slice it, and write acceptance for one Story.',
            fields: [
              { id: 'stories', label: 'Three Stories', hint: 'One per line. Behaviour, not layers. Each must be valuable if the other two never shipped.', rows: 5,
                checks: [
                  { type: 'minWords', value: 18, level: 'bad', msg: 'Three Stories need more than this.' },
                  { type: 'excludesAny', value: ['backend', 'frontend', 'database', 'api ', 'schema', 'migration story'], level: 'bad', msg: 'Layer slicing. None of those can be accepted or released alone. Ask what the PM can do that they could not do before.' }
                ]
              },
              { id: 'ac', label: 'Acceptance Criteria for your first Story', hint: 'At least four. Failure and edge cases must outnumber the happy path.', rows: 8,
                checks: [
                  { type: 'minWords', value: 40, level: 'bad', msg: 'Four criteria covering failures and edges need more than this.' },
                  { type: 'excludesAny', value: ['code review', 'unit test', 'deployed to', 'documentation updated'], level: 'bad', msg: 'Definition of Done items in your acceptance criteria. Reference the DoD; never copy it.' },
                  { type: 'includesAny', value: ['given', 'Given'], level: 'warn', msg: 'No preconditions stated. The precondition is the part people omit, and it is where permission and state cases hide.' }
                ]
              },
              { id: 'test', label: 'One Test Case for one of those criteria', hint: 'Preconditions, exact data, steps, expected result — including what must not appear.', rows: 6,
                checks: [
                  { type: 'minWords', value: 25, level: 'bad', msg: 'A test case someone else could execute needs more than this.' },
                  { type: 'includesDigit', level: 'warn', msg: 'No concrete values. Exact data is what makes a case reproducible.' }
                ]
              }
            ],
            sampleLabel: 'One defensible answer',
            sample: [
              { k: 'Stories', v: 'S1: As a PM, I want to archive a project I own, so that my active list only contains work I am actually running. S2: As a PM, I want to find and reopen an archived project, so that archiving is safe to do without hesitating. S3: As a PM, I want the project list to default to active projects only, so that the list is useful without filtering it every time.' },
              { k: 'Why these three', v: 'S1 is valuable alone — but only just: archiving with no way back is frightening, which is why many teams would insist S1 and S2 ship together. That is a legitimate position, recorded as a dependency rather than by merging them into one large Story. S3 is valuable even if the others are delayed, because the filter is useful the moment any project has been archived.' },
              { k: 'Acceptance for S1', v: 'AC-1 Given I own an active project with milestones and deliverables, when I archive it, then it no longer appears in my active project list and its data is unchanged. AC-2 Given a project I am a member of but do not own, when I view it, then no archive action is available to me. AC-3 Given a project is already archived, when another member archives it again, then nothing changes and no error is shown. AC-4 Given a project has an in-progress deliverable due this week, when I archive it, then I am warned what will be hidden and must confirm. AC-5 Given I archive a project, when I look at any saved filter or report that included it, then it is excluded consistently and not partially present.' },
              { k: 'Test case for AC-2', v: 'Preconditions: member M is a participant on project P-9 but not its owner; feature flag enabled. Data: P-9 owned by member O, 3 milestones, 11 deliverables. Steps: sign in as M; open P-9; inspect available actions; attempt the archive action directly via its interface. Expected: no archive control is shown; the direct attempt is refused with a permission response; P-9 remains active for all members. No partial state change occurs.' },
              { k: 'What to notice', v: 'AC-4 and AC-5 are the criteria that separate a considered Story from a plausible one. AC-4 exists because archiving hides live work — a consequence nobody asks about until it happens. AC-5 exists because partial application across views is how "archive" turns into a data inconsistency. Both came from asking what goes wrong, not from asking what the feature does.' }
            ]
          }
        ]
      },
      {
        id: 's6', title: 'Ready Gate', kicker: 'Gate 02',
        blocks: [
          { type: 'gate', id: 'gate-sim-ready', title: 'Ready Gate', sub: 'Judge your own Story',
            checks: [
              { id: 'sr1', q: 'Does your Story intent carry actor, behaviour and outcome?', cond: 'And the outcome is a reason, not a restatement.',
                fail: { what: 'Scope decisions during implementation will have no referee.', returnTo: 'Create a Ready Story — step 1', correct: 'Rewrite with all three parts. Check the "so that" is a reason.', recheck: 'Intent', owner: 'You' } },
              { id: 'sr2', q: 'Do your failure and edge criteria outnumber the happy path?', cond: 'Count them.',
                fail: { what: 'The states you did not specify will be invented during implementation, by one person, alone.', returnTo: 'Create a Ready Story — step 3', correct: 'Write the cases: empty, unauthorised, already-in-that-state, partially applied, unavailable.', recheck: 'Acceptance Criteria', owner: 'You' } },
              { id: 'sr3', q: 'Is every criterion observable by someone outside the team?', cond: 'No criterion where two people could disagree about whether it passed.',
                fail: { what: 'Acceptance becomes an opinion held after the fact.', returnTo: 'Create a Ready Story — step 3', correct: 'Rewrite each vague criterion as a condition with a definite outcome.', recheck: 'Acceptance Criteria', owner: 'You' } },
              { id: 'sr4', q: 'Have you named a dependency with an owner?', cond: 'Something must exist first. Name it and who owns it.',
                fail: { what: 'Unwritten dependencies become mid-iteration stalls.', returnTo: 'Create a Ready Story — step 4', correct: 'List what must exist to start and to finish. Give each an owner and a date.', recheck: 'Dependencies', owner: 'You' } },
              { id: 'sr5', q: 'Can you state how each criterion will be verified, and what that needs?', cond: 'Data, environment, permissions, a fixed clock, a way to simulate failure.',
                fail: { what: 'The Story was never independently verifiable, and verification will be deferred.', returnTo: 'Create a Ready Story — step 7', correct: 'For each criterion, state the verification approach and what it requires. Record anything missing as a dependency.', recheck: 'Testability', owner: 'You' } },
              { id: 'sr6', q: 'Is architecture impact resolved for this Story?', cond: 'The check was run and the outcome is recorded — not assumed.',
                fail: { what: 'The architecture will be discovered during implementation.', returnTo: 'Architecture Impact Check', correct: 'Run the eight checks against this Story\'s requirements. Record the outcome and the triggering check.', recheck: 'Impact outcome', owner: 'You' } }
            ],
            passText: 'Ready. In a real team this result would be recorded on the Story, including which conditions were evaluated and when. Continue to the final assessment.',
            failText: 'Not Ready — and finding that here is the cheapest place you will ever find it. Correct what failed, then re-run only the failed conditions and anything the correction touched.'
          }
        ]
      },
      {
        id: 's7', title: 'Capability feedback', kicker: 'Assessment',
        lede: 'No score, no ranking. Capability per area, based on what you actually did in this book.',
        blocks: [
          { type: 'assessment' },
          { type: 'callout', variant: 'note', label: 'How to read this', text: 'UNDERSTOOD means you can proceed without guidance. PRACTICED means you can perform it with a reference open. READY FOR INDEPENDENT PRACTICE means you can do it with limited prompts. NEEDS REVIEW names a specific thing worth another attempt — it is a pointer, not a verdict.' }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     16 — QUICK REFERENCE
     --------------------------------------------------------- */

  const ch16 = {
    id: 'ch16', num: 16, title: 'Quick Reference',
    kicker: 'Operational reference',
    question: 'What do I do, right now, at this stage?',
    stage: null, scaffold: 'none',
    intro: 'The compact operational reference. Also reachable from Reference mode and the lookup at any time.',
    sections: [
      { id: 's1', title: 'The lifecycle at a glance', kicker: 'Reference', blocks: [{ type: 'quickref' }] },
      { id: 's2', title: 'Decision rules', kicker: 'Reference', blocks: [
        { type: 'prose', p: ['Five rules that decide whether a procedure or an artifact applies. Work them rather than memorising the answers.'] },
        { type: 'dtree', ruleId: 'dr-design' }, { type: 'dtree', ruleId: 'dr-adr' },
        { type: 'dtree', ruleId: 'dr-wp' }, { type: 'dtree', ruleId: 'dr-testcase' }, { type: 'dtree', ruleId: 'dr-doc' }
      ]},
      { id: 's3', title: 'Artifact standards', kicker: 'Reference', blocks: [{ type: 'artifactstandards' }] },
      { id: 's4', title: 'Systems of record', kicker: 'Reference', blocks: [
        { type: 'sortable' },
        { type: 'callout', variant: 'principle', label: 'The rule', text: 'Every meaningful artifact has a system of record. The labels here are generic on purpose — substitute your own tools. What must not change is that each artifact has exactly one place where its truth lives.' }
      ]},
      { id: 's5', title: 'Anti-patterns', kicker: 'Reference', blocks: [{ type: 'antipatterns' }] },
      { id: 's6', title: 'All checklists', kicker: 'Reference', blocks: [{ type: 'allchecklists' }] }
    ]
  };

  return [ch11, ch12, ch13, ch14, ch15, ch16];
})();
