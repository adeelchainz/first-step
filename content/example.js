/* ============================================================
   THE CONTINUOUS EXAMPLE
   One fictional product, one initiative, followed from raw
   signal to production and back again. Never switch examples.
   ============================================================ */

window.EXAMPLE = (function () {

  const product = {
    name: 'Atlas',
    blurb: 'A project delivery platform used by mid-sized agencies to run client work. Roughly 4,000 accounts. Projects contain milestones; milestones contain deliverables with due dates and owners.',
    context: [
      'Existing architecture: a modular monolith with a separate notifications service and a read-replica reporting database.',
      'Projects, milestones and deliverables are owned by the Delivery module.',
      'The project list is served from the primary database; reporting views read from the replica, which lags by up to 90 seconds.',
      'ADR-006 (accepted) states that no module may read another module\'s tables directly; cross-module reads go through published interfaces.'
    ]
  };

  /* ---- The chain of artifacts, in the order they come into existence ---- */

  const raw = {
    id: 'SIGNAL',
    type: 'Raw signal',
    name: 'Inbound request from the Head of Customer Success',
    body: '"Our agency customers keep asking for a dashboard. Three of our largest accounts mentioned it this quarter. Can we get a project dashboard on the roadmap?"',
    supporting: [
      '41 support conversations in the last quarter mention missing a deadline they "should have seen coming".',
      'Two churn interviews name late discovery of slipped deliverables as a contributing reason.',
      'Account managers report PMs opening projects one at a time each morning to check status.'
    ]
  };

  const problem = {
    id: 'PROB',
    type: 'Problem statement',
    name: 'Slipping deliverables are discovered too late to act on',
    statement: 'Project managers running several client projects at once have no way to see which deliverables are late or about to be late without opening each project individually. As a result slips are typically discovered after the client has noticed, when the only available response is an apology rather than a correction.',
    who: 'Project managers at agencies running 5–20 concurrent client projects',
    evidenceOfProblem: [
      '41 support conversations in one quarter describe a deadline missed that the PM believes was visible in the data',
      '2 of 7 churn interviews last quarter name late discovery of slips',
      'Observed behaviour: PMs open projects one by one each morning — measured at 12–20 minutes for a 10-project portfolio'
    ]
  };

  const objective = {
    id: 'OBJ',
    type: 'Objective',
    statement: 'Make at-risk and late deliverables visible to a project manager without them having to open each project.',
    outcome: 'A project manager starting their day can tell within seconds which of their projects need attention, and act before the client notices.',
    notObjective: 'Ship a dashboard. A dashboard is one possible shape of the answer, not the outcome.'
  };

  const initiative = {
    id: 'INIT-42',
    type: 'Initiative',
    name: 'Early visibility of slipping delivery work',
    problem: problem.statement,
    objective: objective.statement,
    outcome: objective.outcome,
    success: [
      'Median time for a PM to identify every at-risk project in their portfolio drops from 12–20 minutes to under 30 seconds.',
      'Share of missed deliverables where the PM had flagged the risk beforehand rises from a baseline of 18% to above 50% within one quarter of release.',
      'Support conversations mentioning "should have seen it coming" fall by half quarter over quarter.'
    ],
    scopeIn: [
      'Deliverables with due dates inside projects the PM owns or follows',
      'Risk signals derived from data Atlas already holds (due date, status, owner, last update)',
      'Surfacing risk in the product to the PM'
    ],
    scopeOut: [
      'Predictive or ML-based risk scoring',
      'Client-facing status pages',
      'Changing how deliverables are scheduled or re-planned',
      'Mobile application work',
      'Email or push notification digests (candidate for a later Initiative)'
    ],
    constraints: [
      'The reporting replica lags up to 90 seconds; anything presented as "live" must not read from it.',
      'ADR-006 forbids cross-module direct table reads.',
      'No increase to project-list page load budget beyond 200ms at p95.',
      'Must work for accounts with up to 2,000 active deliverables without a separate paid tier.'
    ],
    owner: 'Product lead (R. Okafor)',
    participants: ['Engineering lead (S. Lindqvist)', 'Design lead (M. Duarte)', 'QA lead (A. Petrov)', 'Head of Customer Success'],
    decision: 'Product lead, accepted by the product council on 12 March',
    sor: 'Work management system — Initiative INIT-42'
  };

  const requirements = [
    { id: 'REQ-01', cls: 'functional', text: 'A project manager can see, in one place, every deliverable they are responsible for that is late or at risk of becoming late.', outcome: 'Identify at-risk work without opening each project', stories: ['STORY-114', 'STORY-115'] },
    { id: 'REQ-02', cls: 'functional', text: 'A deliverable is classified as At risk when its due date is within 3 working days and its status is not Complete.', outcome: 'Risk is derived from data Atlas already holds', stories: ['STORY-114'] },
    { id: 'REQ-03', cls: 'functional', text: 'A deliverable is classified as Late when its due date has passed and its status is not Complete.', outcome: 'Risk is derived from data Atlas already holds', stories: ['STORY-114'] },
    { id: 'REQ-04', cls: 'ux', text: 'A project manager can distinguish Late from At risk from Healthy without reading text, and the distinction does not rely on colour alone.', outcome: 'Identification takes seconds, and works for colour-blind users', stories: ['STORY-114', 'STORY-116'] },
    { id: 'REQ-05', cls: 'ux', text: 'From the at-risk view, a project manager can reach the deliverable itself in one action.', outcome: 'Act before the client notices', stories: ['STORY-117'] },
    { id: 'REQ-06', cls: 'nfr', text: 'The at-risk view renders within 1.5 seconds at p95 for an account holding 2,000 active deliverables.', outcome: 'Usable at the top of the portfolio size range we support', stories: ['STORY-115'] },
    { id: 'REQ-07', cls: 'nfr', text: 'Risk classification reflects data no more than 60 seconds old, and is never served from the reporting replica.', outcome: 'PMs can trust what they are looking at', stories: ['STORY-115'] },
    { id: 'REQ-08', cls: 'business', text: 'The capability is available on all paid plans with no separate charge.', outcome: 'Reduce churn driven by late discovery, across the base', stories: [] },
    { id: 'REQ-09', cls: 'business', text: 'Atlas can report, per account, how often a flagged risk preceded a missed deliverable.', outcome: 'Measure the Initiative success criteria after release', stories: ['STORY-118'] },
    { id: 'REQ-10', cls: 'nfr', text: 'A project manager only sees deliverables from projects they are a member of or follow.', outcome: 'No data exposure across client boundaries', stories: ['STORY-114'] },
    { id: 'REQ-11', cls: 'functional', text: 'A project manager can mark a flagged deliverable as acknowledged so it stops competing for attention without changing its status.', outcome: 'The view stays useful after the first look', stories: ['STORY-119'] }
  ];

  const archImpact = {
    id: 'AIC-42',
    type: 'Architecture Impact Check',
    scope: 'REQ-01 … REQ-11',
    checks: [
      { k: 'Existing architecture', f: 'The Delivery module already owns deliverables, due dates and status. Risk classification is a derived read over data it owns.', v: 'no' },
      { k: 'Data boundaries', f: 'The project list is rendered by the Workspace module, which does not own deliverables. It would need deliverable risk data.', v: 'yes' },
      { k: 'APIs and integrations', f: 'No published interface currently exposes deliverable risk. A new interface on the Delivery module is required.', v: 'yes' },
      { k: 'Security and trust boundaries', f: 'Membership rules already exist and are enforced in the Delivery module. The new interface must apply them rather than re-implement them.', v: 'contained' },
      { k: 'Performance and scale', f: 'A naive per-project query would issue one query per project. At 2,000 deliverables this breaks the 1.5s budget.', v: 'yes' },
      { k: 'Deployment and operations', f: 'No new deployable unit. New metric needed for classification latency.', v: 'no' },
      { k: 'Existing ADRs', f: 'ADR-006 forbids the Workspace module reading Delivery tables directly, which rules out the obvious shortcut.', v: 'yes' },
      { k: 'Cost', f: 'No new infrastructure. Additional primary-database read load, estimated under 3%.', v: 'no' }
    ],
    outcome: 'Contained impact',
    reason: 'No new components and no structural change, but a new published interface, a new query shape and an explicit ADR constraint are involved. That is more than "fits as-is".',
    decision: 'System Design required, scoped to the risk interface and its query. ADR required for the read strategy, because the alternatives have different long-term consequences.',
    owner: 'Engineering lead'
  };

  const systemDesign = {
    id: 'SD-42',
    type: 'System Design',
    name: 'Deliverable risk read interface',
    change: 'Add a published read interface on the Delivery module, DeliverableRisk.forMember(memberId), returning the member\'s Late and At risk deliverables with the fields the Workspace module needs to render them.',
    components: ['Delivery module — owns classification and the interface', 'Workspace module — consumes the interface to render the project list and the at-risk view', 'Metrics pipeline — records classification latency and flag-before-miss counts'],
    data: 'No schema change to deliverables. One covering index added on (owner_id, status, due_date) to make the portfolio query a single indexed scan instead of a per-project query.',
    contracts: 'New interface, versioned. Returns deliverable id, project id, title, due date, status, classification, and the timestamp the classification was computed.',
    failureModes: [
      'Delivery module unavailable → Workspace renders the project list without risk indicators and shows a "risk unavailable" state rather than an empty or misleading one.',
      'Classification timestamp older than 60 seconds → the view marks the data stale rather than presenting it as current.',
      'Member has no projects → empty state, not an error.'
    ],
    rollout: 'Behind a flag, enabled per account. Index created online before the flag is enabled anywhere.',
    ops: 'New metric: risk_classification_age_seconds. Alert if p95 exceeds 60s for 10 minutes.',
    owner: 'Engineering lead'
  };

  const adr = {
    id: 'ADR-014',
    type: 'Architecture Decision Record',
    name: 'Compute deliverable risk on read from the primary database',
    status: 'Accepted — 19 March',
    context: 'The at-risk view must reflect data no older than 60 seconds (REQ-07) and render within 1.5s at p95 for 2,000 deliverables (REQ-06). The reporting replica lags up to 90 seconds, so it cannot serve this. ADR-006 forbids the Workspace module reading Delivery tables directly.',
    decision: 'Compute risk classification on read, inside the Delivery module, against the primary database, served through a published interface and supported by a covering index on (owner_id, status, due_date).',
    alternatives: [
      { opt: 'Read from the reporting replica', why: 'Rejected. Up to 90 seconds of lag directly violates REQ-07, and a PM acting on stale risk data is worse than no risk data.' },
      { opt: 'Materialise a risk table updated by a background job', why: 'Rejected for now. It adds a second source of truth, a job to operate, and a staleness window we would still have to bound. Reconsider if read load becomes a problem.' },
      { opt: 'Let the Workspace module query Delivery tables directly', why: 'Rejected. Violates ADR-006 and couples the modules at the storage layer, which is exactly what ADR-006 exists to prevent.' }
    ],
    consequences: [
      'Accepted: additional read load on the primary database, estimated under 3%.',
      'Accepted: classification logic runs on every read rather than being cached, so it must stay cheap — this constrains future risk rules.',
      'Accepted: if we later add predictive scoring, this decision will likely need superseding.',
      'Gained: one source of truth, no staleness window, no new job to operate.'
    ],
    owner: 'Engineering lead, with the Delivery module maintainers'
  };

  const epics = [
    { id: 'EPIC-07', name: 'Risk visibility for delivery work', serves: 'The portion of INIT-42 concerned with seeing risk', features: ['FEAT-21', 'FEAT-22'] },
    { id: 'EPIC-08', name: 'Measurement of early-warning effectiveness', serves: 'The portion of INIT-42 concerned with knowing whether the change worked', features: ['FEAT-23'] }
  ];

  const features = [
    { id: 'FEAT-21', name: 'At-risk work across a portfolio', epic: 'EPIC-07', capability: 'A project manager can see every late or at-risk deliverable across all their projects in one place.', stories: ['STORY-114', 'STORY-115', 'STORY-117', 'STORY-119'] },
    { id: 'FEAT-22', name: 'Risk indication in the project list', epic: 'EPIC-07', capability: 'A project manager scanning the existing project list can tell which projects contain risk without leaving the list.', stories: ['STORY-116'] },
    { id: 'FEAT-23', name: 'Early-warning effectiveness reporting', epic: 'EPIC-08', capability: 'Atlas can report how often a flagged risk preceded a missed deliverable.', stories: ['STORY-118'] }
  ];

  const stories = [
    {
      id: 'STORY-114', feature: 'FEAT-21',
      name: 'A project manager can see their late and at-risk deliverables in one list',
      intent: 'As a project manager running several client projects, I want one list of every deliverable of mine that is late or about to be late, so that I can act before the client notices.',
      requirements: ['REQ-01', 'REQ-02', 'REQ-03', 'REQ-04', 'REQ-10'],
      ac: [
        { id: 'AC-1', text: 'Given I am a member of three projects containing deliverables, when I open the at-risk view, then I see only deliverables from those three projects.' },
        { id: 'AC-2', text: 'Given a deliverable whose due date has passed and whose status is not Complete, when I open the at-risk view, then it appears with the classification Late.' },
        { id: 'AC-3', text: 'Given a deliverable due within 3 working days and not Complete, when I open the at-risk view, then it appears with the classification At risk.' },
        { id: 'AC-4', text: 'Given a deliverable due in 10 working days, when I open the at-risk view, then it does not appear.' },
        { id: 'AC-5', text: 'Given a deliverable that is past due but marked Complete, when I open the at-risk view, then it does not appear.' },
        { id: 'AC-6', text: 'Given the list contains both classifications, when I view it, then Late and At risk are distinguishable by shape and label as well as colour.' },
        { id: 'AC-7', text: 'Given I am a member of no projects, when I open the at-risk view, then I see an empty state explaining that nothing is at risk, not an error.' }
      ],
      dependencies: ['SD-42 interface available behind the feature flag', 'Covering index created in production'],
      archImpact: 'Contained — resolved by SD-42 and ADR-014',
      design: 'Empty state and classification indicators specified by design; no further design needed',
      testability: 'Every criterion is observable through the interface with seeded data. Working-day arithmetic needs a fixed clock in tests.',
      size: 'Fits one iteration; 4 Tasks',
      tasks: ['TASK-501', 'TASK-502', 'TASK-503', 'TASK-504'],
      owner: 'Product lead (intent) / team (refinement)',
      readyResult: 'Passed on the second attempt — see the Ready Gate walkthrough'
    },
    {
      id: 'STORY-115', feature: 'FEAT-21',
      name: 'The at-risk list stays fast and current at portfolio scale',
      intent: 'As a project manager with a large portfolio, I want the at-risk list to load quickly and reflect current data, so that I can trust it enough to act on it.',
      requirements: ['REQ-06', 'REQ-07'],
      ac: [
        { id: 'AC-1', text: 'Given an account with 2,000 active deliverables, when a PM opens the at-risk view, then it renders within 1.5 seconds at p95.' },
        { id: 'AC-2', text: 'Given a deliverable status changed 30 seconds ago, when the PM refreshes the at-risk view, then the change is reflected.' },
        { id: 'AC-3', text: 'Given classification data older than 60 seconds, when the view renders, then it is labelled stale rather than presented as current.' },
        { id: 'AC-4', text: 'Given the Delivery module is unavailable, when the PM opens the view, then a risk-unavailable state is shown and no empty list is implied.' }
      ],
      dependencies: ['ADR-014 accepted', 'Load test environment seeded to 2,000 deliverables'],
      archImpact: 'Contained — this Story is where the ADR-014 decision is realised',
      design: 'Stale and unavailable states specified',
      testability: 'Requires a seeded performance environment; p95 measured over 200 runs',
      size: 'Fits one iteration; 3 Tasks',
      tasks: ['TASK-505', 'TASK-506', 'TASK-507'],
      owner: 'Engineering lead',
      readyResult: 'Passed'
    },
    { id: 'STORY-116', feature: 'FEAT-22', name: 'The project list shows which projects contain risk', requirements: ['REQ-04'], short: true },
    { id: 'STORY-117', feature: 'FEAT-21', name: 'A project manager can open a flagged deliverable in one action', requirements: ['REQ-05'], short: true },
    { id: 'STORY-118', feature: 'FEAT-23', name: 'Atlas records whether a flagged risk preceded a missed deliverable', requirements: ['REQ-09'], short: true },
    { id: 'STORY-119', feature: 'FEAT-21', name: 'A project manager can acknowledge a flagged deliverable', requirements: ['REQ-11'], short: true }
  ];

  const badStory = {
    id: 'STORY-114-draft1',
    name: 'Dashboard',
    intent: 'Build the risk dashboard.',
    ac: ['Dashboard works', 'Looks good on mobile', 'Code reviewed and unit tested', 'Deployed to staging'],
    faults: [
      'The title names a deliverable, not a behaviour — nobody can tell what "done" means.',
      'The intent has no actor, no outcome and no reason.',
      '"Dashboard works" is not observable. Two people will disagree about it at the worst moment.',
      'Two of the four criteria are Definition of Done items copied into the Story.',
      'Nothing here is traceable to a requirement, so nobody can tell what it satisfies.',
      'No failure cases at all — the empty state, the permission boundary and the stale-data case are invisible.'
    ]
  };

  const tasks = [
    { id: 'TASK-501', story: 'STORY-114', name: 'Add classification logic and unit tests to the Delivery module', note: 'Working-day arithmetic against a fixed clock' },
    { id: 'TASK-502', story: 'STORY-114', name: 'Expose DeliverableRisk.forMember through the published interface', note: 'Applies existing membership rules; does not re-implement them' },
    { id: 'TASK-503', story: 'STORY-114', name: 'Render the at-risk list in the Workspace module, including empty state', note: 'Shape plus label plus colour for classification' },
    { id: 'TASK-504', story: 'STORY-114', name: 'Automate the seven acceptance scenarios', note: 'One automated test per Acceptance Criterion' },
    { id: 'TASK-505', story: 'STORY-115', name: 'Create the covering index online in all environments', note: 'Index before flag' },
    { id: 'TASK-506', story: 'STORY-115', name: 'Add risk_classification_age_seconds metric and alert', note: 'p95 > 60s for 10 minutes' },
    { id: 'TASK-507', story: 'STORY-115', name: 'Build the seeded load scenario and record p95', note: '2,000 deliverables, 200 runs' }
  ];

  const pr = {
    id: 'PR-2281',
    title: 'STORY-114: deliverable risk classification and at-risk list',
    story: 'STORY-114',
    contents: ['TASK-501', 'TASK-502', 'TASK-503', 'TASK-504'],
    review: 'Approved by 2 reviewers; one change requested and resolved — membership check was duplicated in the Workspace module and was removed in favour of the interface\'s own enforcement.',
    ci: 'Pipeline #8841 — green. 7 acceptance tests, 34 unit tests, lint, type check, security scan.',
    build: 'atlas-24.3.0-rc2',
    dod: 'Reviewed, tests added, CI green, observability added, docs updated, no new security findings — the team DoD, referenced not copied.'
  };

  const testCases = [
    {
      id: 'TC-114-02', ac: 'AC-2', story: 'STORY-114',
      scenario: 'A past-due, incomplete deliverable is classified Late',
      preconditions: ['PM is a member of project P-1', 'Feature flag enabled for the account', 'System clock fixed at 2026-03-24 09:00 UTC'],
      data: 'Deliverable D-1 in P-1, due 2026-03-20, status In progress, owner = PM',
      steps: ['Sign in as the PM', 'Open the at-risk view', 'Locate deliverable D-1'],
      expected: 'D-1 is listed with classification Late, showing the late indicator shape and the label "Late". No other deliverable from P-1 appears.',
      owner: 'QA'
    },
    {
      id: 'TC-114-05', ac: 'AC-5', story: 'STORY-114',
      scenario: 'A past-due but Complete deliverable is excluded',
      preconditions: ['PM is a member of project P-1', 'System clock fixed at 2026-03-24 09:00 UTC'],
      data: 'Deliverable D-2 in P-1, due 2026-03-18, status Complete',
      steps: ['Sign in as the PM', 'Open the at-risk view', 'Search the list for D-2'],
      expected: 'D-2 does not appear in the list.',
      owner: 'QA'
    }
  ];

  const testEvidence = {
    id: 'EV-24.3-114',
    build: 'atlas-24.3.0-rc2',
    environment: 'Staging, seeded fixture set F-12, clock fixed',
    executedBy: 'CI pipeline #8841 (automated) and A. Petrov (exploratory)',
    date: '2026-03-26',
    results: [
      { case: 'TC-114-01 … TC-114-07', result: 'Pass', note: 'All seven acceptance scenarios automated and green' },
      { case: 'TC-115-01 (p95 render)', result: 'Pass', note: 'p95 1.21s over 200 runs at 2,000 deliverables' },
      { case: 'TC-115-03 (stale label)', result: 'Fail → Pass', note: 'First run showed current data as fresh at 78s. Fixed in PR-2294, re-run green.' }
    ],
    artifacts: ['Pipeline #8841 run log', 'Load test report LT-77', 'Screenshots of stale and unavailable states', 'Exploratory session notes ES-19'],
    claimVsEvidence: 'The claim would be "risk classification works". The evidence is: these cases, against this build, in this environment, on this date, with this one failure and its fix.'
  };

  const release = {
    id: 'REL-24.3',
    objective: 'Put early risk visibility in front of project managers on all paid plans, behind a per-account flag, with a measurable baseline in place.',
    stories: ['STORY-114', 'STORY-115', 'STORY-116', 'STORY-117', 'STORY-118'],
    excluded: [{ item: 'STORY-119 (acknowledge a flagged deliverable)', why: 'Not required for the outcome; its Ready Gate failed on undefined acceptance and it was not corrected in time. Deferred to 24.4 rather than rushed.' }],
    dependencies: ['Covering index created in production before the flag is enabled', 'Notification service unchanged — no dependency'],
    criteria: [
      'All in-scope Stories verified with evidence attached against the release build',
      'No open defects of severity 1 or 2 against in-scope Stories',
      'p95 render within 1.5s demonstrated at 2,000 deliverables',
      'Rollback path exercised in staging',
      'Metrics for the Initiative success criteria emitting before the flag is enabled'
    ],
    decision: 'Go, recorded by the delivery lead on 27 March, with the flag enabled for 5% of accounts for 48 hours before wider rollout.',
    deployment: 'atlas-24.3.0 deployed 27 March 14:10 UTC. Index verified present before enablement.',
    prodVerification: [
      'Smoke: at-risk view renders for three seeded internal accounts',
      'p95 render in production 1.08s over the first hour',
      'risk_classification_age_seconds p95 at 4s',
      'No increase in primary database CPU beyond 2.1%'
    ],
    closed: '30 March, after 72 hours at full rollout with no severity 1 or 2 defects.'
  };

  const operate = {
    signals: [
      { kind: 'Metric', text: 'Median time to identify at-risk projects measured at 14 seconds in week one, against a 30-second target.', action: 'Success criterion met; keep monitoring for two more quarters.' },
      { kind: 'Metric', text: 'Flag-before-miss rate at 34% in week three, against a 50% target.', action: 'Below target. Raised as a signal, not a bug.' },
      { kind: 'Feedback', text: 'PMs report the list becomes noisy after the first look — the same items keep appearing even after they have acted on them.', action: 'Becomes a new requirement: acknowledge a flagged deliverable (REQ-11 → STORY-119, deferred from 24.3).' },
      { kind: 'Bug', text: 'Deliverables due on a public holiday are treated as due on a working day, so some are flagged a day late.', action: 'Defect against AC-3. Refined as a Story with its own acceptance, not patched silently.' },
      { kind: 'Incident', text: 'A 9-minute Delivery module outage. The risk-unavailable state behaved as designed; no misleading empty lists were shown.', action: 'The failure mode named in SD-42 was exercised in production and held. Recorded as evidence.' }
    ],
    loop: 'The 34% flag-before-miss rate and the noise feedback both re-enter Refine as requirements against INIT-42, which remains open until its success criteria are met or abandoned. The holiday defect enters as a new Story under FEAT-21. Nothing here is a new process — it is the same lifecycle, entered from Operate.'
  };

  const traceChain = [
    { k: 'Problem', v: 'Slips discovered after the client has noticed', id: 'PROB' },
    { k: 'Objective', v: 'Make at-risk work visible without opening each project', id: 'OBJ' },
    { k: 'Initiative', v: 'Early visibility of slipping delivery work', id: 'INIT-42' },
    { k: 'Requirement', v: 'A deliverable is Late when its due date has passed and status is not Complete', id: 'REQ-03' },
    { k: 'Epic', v: 'Risk visibility for delivery work', id: 'EPIC-07' },
    { k: 'Feature', v: 'At-risk work across a portfolio', id: 'FEAT-21' },
    { k: 'Story', v: 'A PM can see their late and at-risk deliverables in one list', id: 'STORY-114' },
    { k: 'Acceptance criterion', v: 'Past due and not Complete → appears as Late', id: 'AC-2' },
    { k: 'Test case', v: 'A past-due, incomplete deliverable is classified Late', id: 'TC-114-02' },
    { k: 'Test evidence', v: 'Pass, pipeline #8841, build atlas-24.3.0-rc2, 26 March', id: 'EV-24.3-114' },
    { k: 'Release', v: 'Shipped 27 March, production verified', id: 'REL-24.3' },
    { k: 'Operational signal', v: 'Flag-before-miss rate 34% — below target, re-enters Refine', id: 'OPS-1' }
  ];

  return {
    product, raw, problem, objective, initiative, requirements,
    archImpact, systemDesign, adr, epics, features, stories, badStory,
    tasks, pr, testCases, testEvidence, release, operate, traceChain
  };
})();
