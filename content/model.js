/* ============================================================
   MODEL — the operating model itself, as data.
   Edit this file to change the model without touching the app.
   ============================================================ */

window.MODEL = (function () {

  /* ---------- Dimension 1: the work hierarchy (WHAT) ---------- */

  const hierarchy = [
    {
      id: 'initiative', name: 'Initiative', level: 1,
      question: 'What outcome are we pursuing, and why now?',
      purpose: 'Holds a problem worth solving and the outcome we intend to create. It is the unit of intent.',
      belongs: [
        'The problem statement and who has it',
        'The objective — the change in the world we want',
        'Success criteria expressed as observable signals',
        'Initial scope boundary and explicit non-goals',
        'Major constraints (regulatory, budget, time, platform)'
      ],
      notBelongs: [
        'Solution design or screen layouts',
        'Technology choices',
        'Task-level work breakdown',
        'Acceptance criteria (those live on Stories)'
      ],
      inputs: ['Raw request, complaint, market signal, incident pattern, or strategic goal'],
      owner: 'Product lead',
      participants: ['Engineering lead', 'Design lead', 'Domain expert', 'Whoever raised the signal'],
      sor: 'Work management system — Initiative record',
      quality: [
        'Names a problem, not a feature',
        'Objective is a change in behaviour or outcome, not a deliverable',
        'Success is described in signals that could actually be measured',
        'Non-goals are written down, not assumed'
      ],
      mistakes: [
        'Writing the solution into the Initiative title ("Build a dashboard")',
        'Objective that restates the solution ("Ship the new project page")',
        'No non-goals, so scope silently expands during refinement'
      ],
      relationships: 'Parent of Epics. Source of the requirements discovered in Refine.'
    },
    {
      id: 'epic', name: 'Epic', level: 2,
      question: 'What large coherent area of capability serves this outcome?',
      purpose: 'Groups related capability under one Initiative so large work can be reasoned about and sequenced.',
      belongs: [
        'A coherent capability area with its own centre of gravity',
        'The slice of the Initiative outcome it is responsible for',
        'Its own rough sequencing relative to other Epics'
      ],
      notBelongs: [
        'A team name ("Backend Epic")',
        'A phase name ("Testing Epic", "Discovery Epic")',
        'A sprint or quarter'
      ],
      inputs: ['Initiative objective', 'Requirements discovered in Refine'],
      owner: 'Product lead',
      participants: ['Engineering lead', 'Design lead'],
      sor: 'Work management system — Epic record',
      quality: [
        'Could be described to a stakeholder as an area of capability',
        'Survives a re-plan — it is not tied to a calendar',
        'Has a clear relationship to at least one requirement'
      ],
      mistakes: [
        'Using Epics as buckets for teams or layers',
        'Creating Epics for lifecycle activities ("Refinement Epic")',
        'One giant Epic that is really the Initiative repeated'
      ],
      relationships: 'Child of an Initiative. Parent of Features.'
    },
    {
      id: 'feature', name: 'Feature', level: 3,
      question: 'What capability will users or the business be able to rely on?',
      purpose: 'Names a capability that can be described, demonstrated, and reasoned about as a whole.',
      belongs: [
        'One nameable capability',
        'The set of behaviours that make the capability whole',
        'Its dependencies on other Features'
      ],
      notBelongs: [
        'Technical components ("Projects API")',
        'Individual behaviours (those are Stories)',
        'Test phases'
      ],
      inputs: ['Epic', 'Requirements'],
      owner: 'Product lead',
      participants: ['Engineering lead', 'Design', 'QA'],
      sor: 'Work management system — Feature record',
      quality: [
        'A user could say "the product now lets me…" about it',
        'Decomposes into several independently valuable Stories',
        'Not so small that it has exactly one Story'
      ],
      mistakes: [
        'Features named after services or repositories',
        'Features that are really one Story in disguise',
        'Features that bundle unrelated behaviour to look tidy'
      ],
      relationships: 'Child of an Epic. Parent of Stories.'
    },
    {
      id: 'story', name: 'Story', level: 4,
      question: 'What single valuable behaviour can we deliver and verify?',
      purpose: 'The unit of valuable, independently testable change. The unit that passes the Ready Gate and gets released.',
      belongs: [
        'One valuable behaviour from a user or business point of view',
        'Acceptance Criteria that define when the behaviour is correct',
        'Links to the requirements it satisfies',
        'Known dependencies',
        'A resolved architecture impact position'
      ],
      notBelongs: [
        'A technical layer ("Backend for project creation")',
        'A whole capability that cannot be demonstrated in one go',
        'A copy of the Definition of Done'
      ],
      inputs: ['Feature', 'Requirements', 'Architecture impact outcome', 'Design where needed'],
      owner: 'Product lead writes intent; the team refines it',
      participants: ['Engineers', 'QA', 'Design'],
      sor: 'Work management system — Story record',
      quality: [
        'Valuable on its own — shipping only this Story changes something for someone',
        'Demonstrable — you can show it working',
        'Independently testable — it has its own acceptance',
        'Small enough to complete well inside one iteration'
      ],
      mistakes: [
        'Slicing by technical layer',
        'Acceptance Criteria that restate the title',
        'Hidden dependencies discovered mid-implementation'
      ],
      relationships: 'Child of a Feature. Parent of Tasks. Carries Acceptance Criteria. Source of Test Cases.'
    },
    {
      id: 'task', name: 'Task', level: 5,
      question: 'What piece of implementation work is needed to make the Story true?',
      purpose: 'The engineering work required to realise a Story. Tasks are how, not what.',
      belongs: [
        'Implementation, migration, instrumentation, test automation work',
        'A clear owner and a clear completion condition'
      ],
      notBelongs: [
        'User value statements (those belong to the Story)',
        'Separate acceptance criteria that compete with the Story\'s'
      ],
      inputs: ['Ready Story', 'Design where needed'],
      owner: 'The engineer who takes it',
      participants: ['Reviewers'],
      sor: 'Work management system — Task record',
      quality: ['Completion is unambiguous', 'Fits comfortably within a day or two', 'Traceable to its Story'],
      mistakes: ['Tasks used to smuggle in unplanned scope', 'Tasks with no parent Story'],
      relationships: 'Child of a Story. Parent of Subtasks where useful.'
    },
    {
      id: 'subtask', name: 'Subtask', level: 6,
      question: 'What smaller unit helps one person track a Task?',
      purpose: 'Optional personal decomposition. It exists for tracking convenience, not for governance.',
      belongs: ['Checklist-level breakdown of a single Task'],
      notBelongs: ['Anything anyone outside the team needs to read'],
      inputs: ['Task'],
      owner: 'The engineer on the Task',
      participants: [],
      sor: 'Work management system — Subtask record',
      quality: ['Useful to the person doing the work; invisible to everyone else'],
      mistakes: ['Mandating Subtasks as policy — this is pure bureaucracy'],
      relationships: 'Child of a Task.'
    }
  ];

  /* ---------- Dimension 2: the delivery lifecycle (WHEN / HOW) ---------- */

  const lifecycle = [
    {
      id: 'discover', name: 'Discover', short: 'Discover',
      question: 'Why are we doing this?',
      produces: ['Initiative'],
      evidence: 'An Initiative record that a decision maker has accepted, with problem, objective, success criteria, scope boundary and constraints filled in.',
      gate: 'discover-gate',
      chapter: 'ch03'
    },
    {
      id: 'refine', name: 'Refine', short: 'Refine',
      question: 'What exactly needs to be true?',
      produces: ['Requirements', 'Epics', 'Features', 'Stories', 'Acceptance Criteria'],
      evidence: 'A requirement set with classifications, traced to Stories; architecture impact recorded for each requirement that could touch the system.',
      gate: 'ready-gate',
      chapter: 'ch04'
    },
    {
      id: 'design', name: 'Design if needed', short: 'Design',
      question: 'How will the system support this?',
      produces: ['System Design (when needed)', 'ADR (when a significant decision exists)'],
      evidence: 'Architecture Impact Check outcome; System Design where impact exists; ADR where a significant decision with trade-offs was made.',
      gate: null,
      chapter: 'ch05'
    },
    {
      id: 'ready', name: 'Ready', short: 'Ready',
      question: 'Can we build this without discovering the work mid-flight?',
      produces: ['Ready Story', 'Tasks'],
      evidence: 'A recorded Ready Gate result with the condition that failed, if any, and what was corrected.',
      gate: 'ready-gate',
      chapter: 'ch09'
    },
    {
      id: 'deliver', name: 'Deliver', short: 'Deliver',
      question: 'How does a Ready Story become working software?',
      produces: ['Code', 'Pull Request', 'CI run', 'Build artifact'],
      evidence: 'Merged PR with review approval, green CI run, and a build artifact identified by a version.',
      gate: null,
      chapter: 'ch10'
    },
    {
      id: 'verify', name: 'Verify', short: 'Verify',
      question: 'How do we prove it satisfies what was required?',
      produces: ['Test Cases', 'Test Executions', 'Test Evidence'],
      evidence: 'Executed tests mapped to Acceptance Criteria, with results and captured artifacts (logs, screenshots, run ids).',
      gate: null,
      chapter: 'ch11'
    },
    {
      id: 'release', name: 'Release', short: 'Release',
      question: 'Can we safely ship this?',
      produces: ['Release record', 'Release Test Plan', 'Release decision'],
      evidence: 'Release criteria evaluated against collected evidence, a recorded go/no-go decision with its owner, and post-deploy verification results.',
      gate: 'release-gate',
      chapter: 'ch13'
    },
    {
      id: 'operate', name: 'Operate', short: 'Operate',
      question: 'Is it healthy, and what are we learning?',
      produces: ['Operational signals', 'Feedback', 'Bugs', 'Incidents', 'New requirements'],
      evidence: 'Monitoring against the success criteria named in Discover; feedback and incidents routed back into Refine.',
      gate: null,
      chapter: 'ch14'
    }
  ];

  /* ---------- Things people mistake for hierarchy levels ---------- */

  const notLevels = [
    { term: 'Architecture', is: 'A property of the system and a concern addressed during Refine and Design.', why: 'Architecture describes how the system is structured. It is not a container for work. Putting an "Architecture" level in the hierarchy creates work items nobody can accept or release.' },
    { term: 'System Design', is: 'An artifact produced when architecture impact exists.', why: 'It is an output of a decision rule, not a rung on a ladder. Most Stories never need one.' },
    { term: 'Requirement', is: 'A statement of what must be true, discovered during Refine.', why: 'Requirements are traced to Stories, not stacked above or below them. A requirement can be satisfied by several Stories, and a Story can satisfy several requirements.' },
    { term: 'Acceptance Criteria', is: 'A property of a Story.', why: 'AC lives inside the Story record. It is how you know the Story is correct — it is not a separate work item.' },
    { term: 'Testing', is: 'A lifecycle activity that begins during Refine.', why: 'A "Testing" Epic or Story pushes verification to the end and destroys independent testability. Testability is a Ready Gate condition, not a later phase.' },
    { term: 'Sprint', is: 'A time box for planning and feedback.', why: 'A Sprint is a calendar container. Work does not become smaller or more valuable by being placed in one.' },
    { term: 'Release', is: 'A shipping boundary.', why: 'A Release selects completed work to deploy together. It cuts across the hierarchy — one Release can include Stories from unrelated Initiatives.' },
    { term: 'Definition of Done', is: 'A team-wide completion standard.', why: 'DoD applies to all work of a given type. It never varies per Story, so it cannot be a level or an item.' },
    { term: 'Bug', is: 'A signal, usually handled as a Story or Task depending on size.', why: 'Bugs enter the model through Operate and are refined like any other requirement source.' },
    { term: 'Work Package', is: 'An optional coordination wrapper.', why: 'Only create one when several teams must sequence work together. It coordinates; it does not own value.' }
  ];

  /* ---------- The six connected models (Ch 02) ---------- */

  const models = [
    { id: 'product', name: 'Product Model', q: 'What are we building?', owns: 'Initiative → Epic → Feature → Story', gives: 'Intent and value structure', takesFrom: 'Operate (feedback, incidents, new signals)' },
    { id: 'delivery', name: 'Delivery Model', q: 'How does work move toward production?', owns: 'Discover → Refine → Design → Ready → Deliver → Verify → Release → Operate', gives: 'Sequence, gates and evidence expectations', takesFrom: 'Product Model (what to move)' },
    { id: 'engineering', name: 'Engineering Model', q: 'How is it technically implemented?', owns: 'Architecture, System Design, ADRs, Tasks, code, PRs, CI, builds', gives: 'Feasibility, impact answers, implementation', takesFrom: 'Delivery Model (Ready Stories)' },
    { id: 'quality', name: 'Quality Model', q: 'How do we prove it works?', owns: 'Test Strategy, Test Cases, executions, evidence, Definition of Done', gives: 'Proof that behaviour matches requirement', takesFrom: 'Product Model (Acceptance Criteria)' },
    { id: 'release', name: 'Release Model', q: 'How do we safely ship it?', owns: 'Release record, Release Test Plan, release criteria, deployment, production verification', gives: 'A safe shipping boundary and a recorded decision', takesFrom: 'Quality Model (evidence)' },
    { id: 'operating', name: 'Operating Model', q: 'How do we know it stays healthy?', owns: 'Monitoring, observability, feedback channels, incidents', gives: 'Signals that become new requirements', takesFrom: 'Release Model (what is live)' }
  ];

  /* ---------- Artifact operating standards ---------- */

  const artifacts = [
    {
      id: 'initiative', name: 'Initiative', necessity: 'always',
      purpose: 'Records the problem we are solving and the outcome we intend, so every downstream decision can be traced to an intent.',
      inputs: ['Raw signal: complaint, support volume, incident pattern, market or strategy input'],
      creation: 'Identify the problem, define the objective, describe the desired outcome, define success criteria, set an initial scope boundary with non-goals, list major constraints, then record it.',
      quality: ['Problem is stated without a solution in it', 'Objective describes a change, not a deliverable', 'Success criteria are observable', 'Non-goals are explicit'],
      antipattern: '"Build a project dashboard." Solution-first, no problem, no measurable outcome, no boundary.',
      evidence: 'Accepted Initiative record with a named decision maker and a date.',
      owner: 'Product lead',
      sor: 'Work management system',
      relationships: 'Parent of Epics; source of the requirements found in Refine; its success criteria are what Operate monitors.',
      lifecycle: 'Created in Discover. Updated when scope or constraints change materially. Retired when its objective is met or abandoned — with the reason recorded.'
    },
    {
      id: 'requirement', name: 'Requirement', necessity: 'always',
      purpose: 'States one thing that must be true for the Initiative objective to be achieved.',
      inputs: ['Initiative objective and desired outcomes', 'Constraints', 'Existing system behaviour'],
      creation: 'For each desired outcome ask what must be true for it to exist. Record each answer as one requirement. Classify it Functional, Business, UX, or Non-functional. Remove duplicates. Trace it to the Stories that will satisfy it.',
      quality: ['Testable — you can describe how you would know', 'Single — one requirement per statement', 'Outcome-anchored — traceable to a desired outcome', 'Solution-free where possible'],
      antipattern: '"The system should be user-friendly." Not testable, not single, no outcome.',
      evidence: 'A requirement set with classifications and Story traces.',
      owner: 'Product lead, with the team',
      sor: 'Work management system, attached to the Initiative',
      relationships: 'Satisfied by one or more Stories; each is subject to an Architecture Impact Check.',
      lifecycle: 'Discovered in Refine. Amended when understanding changes. Closed when the satisfying Stories are released and verified.'
    },
    {
      id: 'arch-impact', name: 'Architecture Impact Check', necessity: 'always',
      purpose: 'Answers whether the existing system can support a requirement as it stands.',
      inputs: ['Requirement', 'Current architecture view', 'Existing ADRs', 'Known constraints'],
      creation: 'Walk the eight checks: architecture, data boundaries, APIs and integrations, security and trust boundaries, performance and scale, deployment and operations, existing ADRs, and cost. Record the outcome as No impact, Contained impact, or Structural impact.',
      quality: ['Names which check triggered the impact', 'States what would have to change', 'Reaches a recorded decision, not a discussion'],
      antipattern: 'A blanket "no architecture impact" applied to every requirement without checking anything.',
      evidence: 'Recorded impact outcome on the requirement or Story, with the triggering check named.',
      owner: 'Engineering lead',
      sor: 'Work management system, on the requirement or Story',
      relationships: 'Decides whether a System Design is needed; the System Design decides whether an ADR is needed.',
      lifecycle: 'Performed in Refine for every requirement that could touch the system. Revisited if the requirement changes.'
    },
    {
      id: 'system-design', name: 'System Design', necessity: 'when',
      purpose: 'Describes how the system will change to support a requirement whose impact is not contained within existing structure.',
      inputs: ['Architecture Impact Check outcome of Contained or Structural', 'Requirements', 'Constraints'],
      creation: 'State the change, the components affected, the data and contract changes, the failure modes, the migration path, and the operational impact.',
      quality: ['Someone who did not attend the discussion could implement from it', 'Names failure modes and how they are handled', 'Includes the migration or rollout path'],
      antipattern: 'A design document created for every Initiative regardless of impact — bureaucracy that nobody reads.',
      evidence: 'Design document linked from the Stories it unblocks.',
      owner: 'Engineering lead or the assigned designer of the change',
      sor: 'Engineering documentation space, linked from the work item',
      relationships: 'Produced when impact exists; produces an ADR when a significant decision with trade-offs is made.',
      lifecycle: 'Created in Design. Updated while the change is being built. Superseded rather than deleted.'
    },
    {
      id: 'adr', name: 'Architecture Decision Record', necessity: 'when',
      purpose: 'Records a significant architectural decision, its alternatives, and its consequences, so the reasoning survives the people.',
      inputs: ['A decision with real trade-offs', 'Options considered', 'Constraints that shaped the choice'],
      creation: 'State the context, the decision, the alternatives considered and why they were rejected, the consequences accepted, and the status.',
      quality: ['A reader can tell why the rejected options were rejected', 'Consequences include the bad ones', 'Has a status and a date'],
      antipattern: 'An ADR for a choice with no alternatives — "we will use the framework we already use" is not a decision.',
      evidence: 'ADR record with status, date, and decision maker.',
      owner: 'Engineering lead',
      sor: 'ADR log in the engineering documentation space',
      relationships: 'Referenced by future Architecture Impact Checks; may supersede an earlier ADR.',
      lifecycle: 'Created when the decision is made. Never edited after acceptance — superseded by a new ADR.'
    },
    {
      id: 'story', name: 'Story', necessity: 'always',
      purpose: 'Carries one valuable behaviour from intent to production with its own acceptance.',
      inputs: ['Feature', 'Requirements', 'Architecture impact outcome', 'Design where needed'],
      creation: 'Write the intent, link requirements, define Acceptance Criteria, identify dependencies, resolve architecture impact, confirm testability and size, create Tasks, run the Ready Gate.',
      quality: ['Valuable, demonstrable, independently testable, small enough', 'Acceptance Criteria say how it fails, not just how it passes'],
      antipattern: 'Stories named "Frontend", "Backend", "Database" — none can be released or accepted alone.',
      evidence: 'Ready Gate result recorded on the Story.',
      owner: 'Product lead writes intent; the team completes it',
      sor: 'Work management system',
      relationships: 'Child of a Feature; parent of Tasks; satisfies requirements; source of Test Cases.',
      lifecycle: 'Created in Refine, made Ready at the Ready Gate, implemented in Deliver, verified in Verify, shipped in a Release.'
    },
    {
      id: 'ac', name: 'Acceptance Criteria', necessity: 'always',
      purpose: 'Defines the conditions under which this specific Story is correct.',
      inputs: ['Story intent', 'Requirements it satisfies', 'Known edge cases and failure modes'],
      creation: 'For the behaviour, write the happy path, then each failure and edge condition, each as an observable condition with a definite outcome.',
      quality: ['Observable — an outsider could judge it', 'Covers failure, not only success', 'Independent of implementation detail', 'Specific to this Story'],
      antipattern: 'Copying the Definition of Done into the Story as its Acceptance Criteria.',
      evidence: 'AC present on the Story and mapped to Test Cases.',
      owner: 'Product lead with QA and engineering',
      sor: 'Inside the Story record',
      relationships: 'Derived from requirements; each criterion maps to at least one Test Case.',
      lifecycle: 'Defined in Refine. Changed only with a deliberate re-refinement. Frozen once the Story is in Deliver.'
    },
    {
      id: 'dod', name: 'Definition of Done', necessity: 'always',
      purpose: 'States the team-wide standard every piece of work must meet before it can be called done.',
      inputs: ['Team agreement', 'Organisational and regulatory obligations'],
      creation: 'Agree the conditions that apply to all work — review, tests, CI, documentation, observability, security checks — and publish one copy.',
      quality: ['Applies to every Story without editing', 'Short enough to be honoured', 'Enforced in the pipeline where possible'],
      antipattern: 'A DoD that is aspirational and routinely waived. If it is waived, it is not the DoD.',
      evidence: 'A single published DoD, referenced not copied.',
      owner: 'The team',
      sor: 'Team working agreements',
      relationships: 'Applies to every Story alongside its own Acceptance Criteria.',
      lifecycle: 'Reviewed periodically. Changed deliberately, not per Story.'
    },
    {
      id: 'task', name: 'Task', necessity: 'always',
      purpose: 'A unit of implementation work under a Story.',
      inputs: ['Ready Story', 'Design where needed'],
      creation: 'Break the Story into the implementation work needed to make its Acceptance Criteria true, including test automation and instrumentation.',
      quality: ['Unambiguous completion', 'Small', 'Traceable to the Story'],
      antipattern: 'Tasks that add behaviour not covered by any Acceptance Criterion.',
      evidence: 'Task closed with its linked PR.',
      owner: 'The engineer',
      sor: 'Work management system',
      relationships: 'Child of a Story.',
      lifecycle: 'Created at Ready, closed in Deliver.'
    },
    {
      id: 'test-strategy', name: 'Test Strategy', necessity: 'always',
      purpose: 'The long-lived approach to quality for the product: what kinds of testing exist, at what level, and who does them.',
      inputs: ['System architecture', 'Risk profile', 'Regulatory obligations'],
      creation: 'Define test levels, ownership, environments, data approach, automation targets, and what requires formal verification.',
      quality: ['Stable across releases', 'Explains when formal Test Cases are required'],
      antipattern: 'Rewriting the strategy each release — that is a Release Test Plan, not a strategy.',
      evidence: 'A published strategy referenced by Release Test Plans.',
      owner: 'QA lead',
      sor: 'Engineering documentation space',
      relationships: 'Sets the rules that Release Test Plans and Test Cases follow.',
      lifecycle: 'Long-lived. Reviewed when architecture or risk changes.'
    },
    {
      id: 'release-test-plan', name: 'Release Test Plan', necessity: 'when',
      purpose: 'States what will be tested for this specific release and what evidence the release decision needs.',
      inputs: ['Release scope', 'Test Strategy', 'Risk in this release'],
      creation: 'List the Stories in scope, the tests that will run, regression scope, environments, data, exit criteria, and who signs off.',
      quality: ['Scoped to this release', 'Names exit criteria before testing starts'],
      antipattern: 'A plan written after testing is finished to satisfy an audit.',
      evidence: 'Plan with results attached.',
      owner: 'QA lead',
      sor: 'QA/test system, linked to the Release record',
      relationships: 'Sits between the Test Strategy and the release decision.',
      lifecycle: 'Created when a release is scoped. Closed when the release is closed.'
    },
    {
      id: 'test-case', name: 'Test Case', necessity: 'when',
      purpose: 'Describes how one behaviour is verified, precisely enough that a different person gets the same result.',
      inputs: ['One Acceptance Criterion', 'Known preconditions and data'],
      creation: 'Select the criterion, identify the scenario, define preconditions, define test data, write the steps, state the expected result.',
      quality: ['Deterministic', 'One criterion per case', 'Someone else can execute it unchanged'],
      antipattern: 'A test case that says "verify the feature works".',
      evidence: 'Case linked to the criterion it verifies.',
      owner: 'QA, with engineering',
      sor: 'QA/test system or a linked QA artifact',
      relationships: 'Derived from an Acceptance Criterion; produces Test Evidence when executed.',
      lifecycle: 'Written during Refine or Ready, executed in Verify, maintained as regression where valuable.'
    },
    {
      id: 'test-evidence', name: 'Test Evidence', necessity: 'always',
      purpose: 'Records what actually happened when the verification ran.',
      inputs: ['Executed Test Case', 'Build version', 'Environment'],
      creation: 'Record the execution: who or what ran it, against which build, in which environment, on which date, with the result and supporting artifacts.',
      quality: ['Identifies the exact build', 'Reproducible', 'Includes failures and their resolution, not only passes'],
      antipattern: '"Tested — works." A claim, not evidence.',
      evidence: 'It is the evidence.',
      owner: 'Whoever executed the verification',
      sor: 'QA/test system',
      relationships: 'Rolls up into the release decision.',
      lifecycle: 'Created at execution. Retained for the life of the release record.'
    },
    {
      id: 'release', name: 'Release', necessity: 'always',
      purpose: 'A shipping boundary: the set of completed work deployed together, with a recorded decision to ship it.',
      inputs: ['Verified Stories', 'Test evidence', 'Release criteria'],
      creation: 'Define the objective, select eligible Stories, confirm scope and dependencies, state what is out, plan the testing, verify, collect evidence, evaluate criteria, decide, deploy, verify production, close.',
      quality: ['Scope is explicit including what was excluded', 'Decision has a named owner and a date', 'Production verification is recorded, not assumed'],
      antipattern: 'Treating the Release as a hierarchy level and parenting Stories under it.',
      evidence: 'Release record with criteria results, decision, deployment record and production verification.',
      owner: 'Release manager or delivery lead',
      sor: 'Release record',
      relationships: 'Cuts across the hierarchy; references Stories, evidence and the plan.',
      lifecycle: 'Opened at scoping, closed after production verification.'
    },
    {
      id: 'work-package', name: 'Work Package', necessity: 'optional',
      purpose: 'A coordination wrapper for work that several teams must sequence together.',
      inputs: ['Cross-team dependency that ordinary Story links cannot express'],
      creation: 'Only when coordination complexity is real: name the teams, the sequence, the handoffs and the shared dates.',
      quality: ['Exists to coordinate, never to own value', 'Dissolved as soon as coordination is no longer needed'],
      antipattern: 'Creating Work Packages as a default layer — pure overhead.',
      evidence: 'Coordination record with the teams and sequence.',
      owner: 'Delivery lead',
      sor: 'Work management system',
      relationships: 'References Stories across Features and teams; owns none of them.',
      lifecycle: 'Created only when needed, closed as soon as the coordination ends.'
    }
  ];

  /* ---------- Decision rules ---------- */

  const decisionRules = [
    {
      id: 'dr-design',
      name: 'Do I need a System Design?',
      summary: 'Driven entirely by the Architecture Impact Check. No impact, no design.',
      tree: {
        q: 'Does the requirement need behaviour the current architecture does not already support?',
        help: 'Judge against what exists today, not what you wish existed.',
        options: [
          {
            label: 'No — it fits existing structure, contracts and boundaries',
            next: {
              q: 'Does it change data ownership, a published contract, a trust boundary, or the scale envelope?',
              help: 'These are the four things that most often hide behind "it is just a small change".',
              options: [
                { label: 'No to all four', result: { verdict: 'No System Design needed', detail: 'Record the Architecture Impact Check outcome as No impact and continue to Ready.', doLabel: 'Do this', do: ['Record the impact outcome on the requirement', 'Note which checks you ran', 'Continue to decomposition'] } },
                { label: 'Yes to at least one', result: { verdict: 'System Design needed — contained', detail: 'The impact is real but local. Produce a System Design that covers the changed contract or boundary and its migration path.', doLabel: 'Do this', do: ['Write a System Design scoped to the affected components', 'Name the failure modes and the migration path', 'Check whether a significant decision with trade-offs was made — if so, write an ADR'] } }
              ]
            }
          },
          {
            label: 'Yes — it needs a new component, a new integration, or a different structure',
            result: { verdict: 'System Design needed — structural', detail: 'Structural impact. Design before the Stories are made Ready, or you will discover the architecture during implementation.', doLabel: 'Do this', do: ['Write a System Design covering components, data, contracts, failure modes and rollout', 'Write an ADR for each significant decision with alternatives', 'Only then run the Ready Gate on the affected Stories'] } }
        ]
      }
    },
    {
      id: 'dr-adr',
      name: 'Do I need an ADR?',
      summary: 'An ADR records a decision with real alternatives and lasting consequences.',
      tree: {
        q: 'Was a choice actually made between meaningful alternatives?',
        help: 'Following an existing standard is not a decision. Departing from one is.',
        options: [
          { label: 'No — there was only one reasonable option', result: { verdict: 'No ADR', detail: 'Record the choice in the System Design if it needs recording at all.', doLabel: 'Do this', do: ['Note the choice inline', 'Move on — do not manufacture a decision record'] } },
          {
            label: 'Yes — we chose between options',
            next: {
              q: 'Would reversing this choice later be expensive, or does it constrain future work?',
              help: 'Cost of reversal is the clearest test of significance.',
              options: [
                { label: 'No — easily reversed, constrains nothing', result: { verdict: 'No ADR', detail: 'A reversible, unconstraining choice does not need a durable record.', doLabel: 'Do this', do: ['Note it in the PR or design', 'Revisit only if it becomes load-bearing'] } },
                { label: 'Yes — expensive to reverse or constrains future work', result: { verdict: 'Write an ADR', detail: 'This decision will outlive the people who made it. Record the context, the alternatives, why they lost, and the consequences you are accepting.', doLabel: 'Do this', do: ['Write the ADR with status and date', 'Include the consequences you do not like', 'Link it from the System Design and the affected Stories'] } }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'dr-wp',
      name: 'Do I need a Work Package?',
      summary: 'Only when coordination between teams cannot be expressed by ordinary dependencies.',
      tree: {
        q: 'Does this work require more than one team to sequence their delivery together?',
        help: 'One team with several Stories is not coordination complexity.',
        options: [
          { label: 'No — one team can deliver it', result: { verdict: 'No Work Package', detail: 'Ordinary Story dependencies are enough.', doLabel: 'Do this', do: ['Record dependencies on the Stories', 'Skip the wrapper'] } },
          {
            label: 'Yes — multiple teams must hand off between each other',
            next: {
              q: 'Can the handoffs be expressed as dependencies between Stories?',
              help: 'Try the cheap option before the expensive one.',
              options: [
                { label: 'Yes — links are sufficient', result: { verdict: 'No Work Package', detail: 'Use Story dependencies and a shared sequence view.', doLabel: 'Do this', do: ['Link the Stories', 'Agree a sequence in planning', 'Revisit if the links stop being legible'] } },
                { label: 'No — there are shared dates, shared environments or a joint cutover', result: { verdict: 'Create a Work Package', detail: 'Coordination is genuinely complex. Create the wrapper to hold the sequence, and dissolve it once the cutover is done.', doLabel: 'Do this', do: ['Name the teams, sequence and handoffs', 'Name a single coordination owner', 'Close it as soon as coordination ends'] } }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'dr-testcase',
      name: 'Do I need formal Test Cases?',
      summary: 'Formality follows risk and the need for reproducible proof.',
      tree: {
        q: 'Does the behaviour carry regulatory, financial, safety or data-integrity risk?',
        help: 'Ask what happens to someone outside the team if this is wrong.',
        options: [
          { label: 'Yes', result: { verdict: 'Formal Test Cases required', detail: 'Reproducible, reviewable cases with recorded evidence, per the Test Strategy.', doLabel: 'Do this', do: ['Write one case per Acceptance Criterion', 'Record execution evidence with build and environment', 'Attach to the Release Test Plan'] } },
          {
            label: 'No',
            next: {
              q: 'Can the criterion be covered by automated tests that a reviewer can read as the specification?',
              help: 'Automated tests are evidence too — if they are readable and mapped to the criterion.',
              options: [
                { label: 'Yes — automated coverage maps cleanly to the criteria', result: { verdict: 'Automated coverage is sufficient', detail: 'Map the automated tests to the Acceptance Criteria. CI results become the evidence.', doLabel: 'Do this', do: ['Name the covering tests on the Story', 'Keep the CI run id as evidence', 'Skip the separate formal case'] } },
                { label: 'No — the behaviour needs manual or exploratory judgement', result: { verdict: 'Write a Test Case for the parts that need judgement', detail: 'Formalise only the scenarios automation cannot judge, and record what you observed.', doLabel: 'Do this', do: ['Write cases for the judgement-heavy scenarios', 'Capture evidence at execution', 'Leave the rest to automation'] } }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'dr-doc',
      name: 'Do I need additional documentation?',
      summary: 'A document must serve a decision, an operation, or an obligation. Otherwise it is waste.',
      tree: {
        q: 'Will someone make a decision or perform an operation using this document?',
        help: 'Name the person and the moment. If you cannot, there is no reader.',
        options: [
          {
            label: 'No',
            next: {
              q: 'Is it required by a regulation, contract or audit obligation?',
              help: 'Obligation is the only valid reason to write a document nobody would otherwise read.',
              options: [
                { label: 'No', result: { verdict: 'Do not write it', detail: 'No reader, no decision, no obligation. Creating it adds maintenance cost and a second source of truth.', doLabel: 'Do this', do: ['Record what is needed on the existing work item', 'Move on'] } },
                { label: 'Yes', result: { verdict: 'Write the minimum the obligation requires', detail: 'Satisfy the obligation precisely. Do not expand it into a general document.', doLabel: 'Do this', do: ['Write exactly what is required', 'Reference existing artifacts instead of restating them', 'Record where it lives'] } }
              ]
            }
          },
          { label: 'Yes — I can name the reader and the moment', result: { verdict: 'Write it, scoped to that decision', detail: 'Write for that reader and that moment, and nothing more.', doLabel: 'Do this', do: ['Write only what that decision needs', 'Link it from the work item', 'Set a review or retirement trigger'] } }
        ]
      }
    }
  ];

  /* ---------- Anti-patterns ---------- */

  const antipatterns = [
    { id: 'ap-solution-first', name: 'Solution-first Initiative', bad: 'Build a project dashboard.', why: 'It names a deliverable, not a problem. Nobody can tell what would count as success, so scope arguments have no referee and the Initiative can never be judged.', good: 'Project managers cannot tell which projects are slipping without manually checking each one, so slips are found late. Objective: make slipping projects visible without manual checking.', repair: 'Ask "what is bad today?" and "what is different if we succeed?" Write those two answers first. The dashboard may still be the answer — but now it is a candidate solution, not the premise.' },
    { id: 'ap-layer-slicing', name: 'Slicing Stories by technical layer', bad: 'Frontend Story · Backend Story · Database Story', why: 'None of the three can be released, demonstrated or accepted alone. Value only appears when all three land, so acceptance is deferred and dependencies are hidden inside the slice.', good: 'A user can create a project. · A user can rename a project. · A user can archive a project.', repair: 'Slice by behaviour, then let each Story carry its own front-end, back-end and data Tasks underneath it.' },
    { id: 'ap-dod-copy', name: 'Copying the Definition of Done into every Story', bad: 'AC: code reviewed, unit tests written, deployed to staging, documentation updated.', why: 'These are team-wide completion standards, not this Story\'s behaviour. Copying them buries the actual acceptance and guarantees the DoD drifts between Stories.', good: 'AC: Given a project with no name, when the user saves, then the project is not created and the name field shows "Name is required".', repair: 'Publish the DoD once and reference it. Reserve Acceptance Criteria for what makes this Story correct.' },
    { id: 'ap-arch-doc-always', name: 'An architecture document for every Initiative', bad: 'Every Initiative gets a System Design before refinement starts.', why: 'Most work fits the existing architecture. Producing designs regardless of impact creates documents nobody reads and delays the work that actually needed design.', good: 'Every requirement gets an Architecture Impact Check. Only impact produces design.', repair: 'Replace the standing document requirement with the impact check, and let the check decide.' },
    { id: 'ap-req-no-outcome', name: 'Requirements with no outcome behind them', bad: 'The system should be user-friendly and performant.', why: 'Not single, not testable, not traceable to a desired outcome. It cannot be accepted or refused, so it survives every review without changing anything.', good: 'A project manager can identify every slipping project in under 10 seconds from the project list. (UX + NFR)', repair: 'Trace each requirement back to a desired outcome, then restate it as an observable condition.' },
    { id: 'ap-untestable-story', name: 'Stories too large to test independently', bad: 'As a PM, I want full project management.', why: 'It cannot be demonstrated, cannot be finished in an iteration, and its acceptance can only be written vaguely. Size failures always show up as acceptance failures.', good: 'As a PM I want to see which projects are past their due date so I can act before the client notices.', repair: 'Find the smallest behaviour a user would notice, ship that, then slice the next.' },
    { id: 'ap-hidden-deps', name: 'Hidden dependencies', bad: 'The Story is Ready; the third-party contract it needs is "probably fine".', why: 'Unrecorded dependencies become mid-sprint stalls. The Ready Gate exists precisely to surface them while correction is still cheap.', good: 'Dependency recorded: needs the notification service v2 contract, expected in release 24.3. Story remains Not Ready until confirmed.', repair: 'Make dependency identification an explicit Ready Gate condition with a named owner and a date.' },
    { id: 'ap-undefined-acceptance', name: 'Undefined acceptance', bad: 'AC: works as expected.', why: 'Acceptance becomes an opinion held after the fact. Two people will disagree at exactly the moment disagreement is most expensive.', good: 'Each criterion written as an observable condition with a definite outcome, including the failure paths.', repair: 'Write the failure cases first — they force the criteria to be concrete.' },
    { id: 'ap-arch-no-evidence', name: 'Architecture decisions without evidence', bad: 'We decided in a meeting to split the service.', why: 'The reasoning leaves with the people. Six months later nobody can tell whether the constraint that forced the split still exists.', good: 'ADR-014: context, alternatives, why each was rejected, consequences accepted, status, date.', repair: 'Write the ADR at the moment of decision, including the consequences you dislike.' },
    { id: 'ap-late-testing', name: 'Testing postponed to the end', bad: 'A "Testing" Story at the end of the Feature.', why: 'Testability is a property of the Story. Discovering it late means the Story was never independently verifiable, and defects are found when they are most expensive to fix.', good: 'Testability confirmed at the Ready Gate; Test Cases derived from Acceptance Criteria before implementation begins.', repair: 'Move testability into Refine and make it a Ready Gate condition.' },
    { id: 'ap-release-no-evidence', name: 'Releasing without evidence', bad: 'Everything is done, so we shipped.', why: '"Done" is a claim. Without evidence tied to a build, nobody can say what was actually verified, and post-incident analysis has nothing to work with.', good: 'Release criteria evaluated against test evidence identified by build version, with a recorded go decision and its owner.', repair: 'Define release criteria before testing starts, and require evidence to be attached before the decision is made.' },
    { id: 'ap-sprint-hierarchy', name: 'Treating a Sprint as a hierarchy level', bad: 'Sprint 24 as the parent of the Stories in it.', why: 'A Sprint is a time box. Parenting work to it destroys traceability to intent the moment the work rolls over.', good: 'Stories stay under their Feature; the Sprint is a planning view across them.', repair: 'Use the iteration as a field, never as a parent.' },
    { id: 'ap-release-hierarchy', name: 'Treating a Release as a hierarchy level', bad: 'Release 24.3 as the parent of its Stories.', why: 'A Release is a shipping boundary that cuts across the hierarchy. One release routinely contains work from unrelated Initiatives.', good: 'The Release references the Stories it ships; the Stories keep their Feature parents.', repair: 'Model the Release as a reference set, not a container.' },
    { id: 'ap-doc-no-purpose', name: 'Documents with no decision or operation behind them', bad: 'Every concept in the process gets a template and a required document.', why: 'Documents that serve no decision still cost creation, review and maintenance, and they become a second source of truth that quietly goes stale.', good: 'Each artifact is classified Always, When needed, or Optional — and the "when" is a stated rule.', repair: 'Run the documentation decision rule: name the reader and the moment, or do not write it.' }
  ];

  /* ---------- Responsibility model ---------- */

  const responsibility = [
    { k: 'Owner', q: 'Who is responsible for moving this forward?', note: 'Exactly one person. Ownership is about momentum, not authority.' },
    { k: 'Participants', q: 'Who contributes?', note: 'The people whose knowledge the work needs. They do not decide.' },
    { k: 'Decision maker', q: 'Who resolves the decision?', note: 'Named before the decision is needed, not after it stalls.' },
    { k: 'Evidence', q: 'Where is the result recorded?', note: 'If the outcome is not recorded somewhere findable, the decision did not happen.' }
  ];

  /* ---------- Systems of record ---------- */

  const systemsOfRecord = [
    { item: 'Initiative', sor: 'Work management system', note: 'Top-level intent record' },
    { item: 'Epic', sor: 'Work management system', note: 'Child of Initiative' },
    { item: 'Feature', sor: 'Work management system', note: 'Child of Epic' },
    { item: 'Story', sor: 'Work management system', note: 'Child of Feature' },
    { item: 'Task / Subtask', sor: 'Work management system', note: 'Child of Story' },
    { item: 'Requirement', sor: 'Work management system', note: 'Attached to the Initiative, traced to Stories' },
    { item: 'Acceptance Criteria', sor: 'Inside the Story', note: 'Never a separate item' },
    { item: 'Architecture Impact Check', sor: 'On the requirement or Story', note: 'A recorded outcome, not a conversation' },
    { item: 'System Design', sor: 'Engineering documentation space', note: 'Linked from the Stories it unblocks' },
    { item: 'ADR', sor: 'ADR log', note: 'Immutable once accepted; superseded, not edited' },
    { item: 'Test Strategy', sor: 'Engineering documentation space', note: 'Long-lived' },
    { item: 'Release Test Plan', sor: 'QA/test system', note: 'Linked to the Release record' },
    { item: 'Test Case', sor: 'QA/test system or linked QA artifact', note: 'One per criterion where formality is required' },
    { item: 'Test Evidence', sor: 'QA/test system', note: 'Identifies build and environment' },
    { item: 'Release', sor: 'Release record', note: 'References Stories; parents none' },
    { item: 'Definition of Done', sor: 'Team working agreements', note: 'One copy, referenced everywhere' }
  ];

  /* ---------- Quick reference (Ch 16 / Reference mode) ---------- */

  const quickReference = [
    { stage: 'Discover', q: 'Why?', steps: ['Problem', 'Objective', 'Desired outcome', 'Success criteria', 'Initial scope + non-goals', 'Constraints', 'Initiative'], gate: 'Discover Gate', evidence: 'Accepted Initiative record' },
    { stage: 'Refine', q: 'What must be true?', steps: ['Frame the problem', 'Discover requirements', 'Classify FR / BR / UX / NFR', 'Constraints and dependencies', 'Architecture impact per requirement', 'Testability', 'Decompose', 'Slice Stories', 'Acceptance Criteria'], gate: 'Ready Gate (per Story)', evidence: 'Requirement set with traces and impact outcomes' },
    { stage: 'Design', q: 'How will the system support it?', steps: ['Architecture Impact Check outcome', 'System Design where impact exists', 'ADR where a significant decision exists'], gate: 'None — governed by decision rules', evidence: 'Impact outcome, design, ADR' },
    { stage: 'Ready', q: 'Can we build it without discovering it mid-flight?', steps: ['Purpose', 'Requirements linked', 'Acceptance Criteria', 'Dependencies', 'Architecture impact resolved', 'Design available where needed', 'Testability', 'Size', 'Tasks'], gate: 'Ready Gate', evidence: 'Recorded gate result' },
    { stage: 'Deliver', q: 'Build it.', steps: ['Tasks', 'Implementation', 'Pull request', 'Code review', 'CI', 'Build'], gate: 'Review + CI', evidence: 'Merged PR, green CI run, build version' },
    { stage: 'Verify', q: 'Does it do what was required?', steps: ['Test Cases from Acceptance Criteria', 'Execution', 'Evidence capture', 'Acceptance', 'Definition of Done'], gate: 'Acceptance', evidence: 'Executed tests mapped to criteria, with artifacts' },
    { stage: 'Release', q: 'Can we ship it?', steps: ['Release objective', 'Select eligible Stories', 'Confirm scope and dependencies', 'Out of scope', 'Release Test Plan', 'Verify', 'Collect evidence', 'Evaluate release criteria', 'Decision', 'Deploy', 'Verify production', 'Close'], gate: 'Release Gate', evidence: 'Criteria results, decision, deployment record, production verification' },
    { stage: 'Operate', q: 'Is it healthy?', steps: ['Monitor against success criteria', 'Observe', 'Collect feedback', 'Triage bugs and incidents', 'Raise new requirements', 'Return to Refine'], gate: 'None — continuous', evidence: 'Monitoring against Discover success criteria; routed feedback' }
  ];

  return { hierarchy, lifecycle, notLevels, models, artifacts, decisionRules, antipatterns, responsibility, systemsOfRecord, quickReference };
})();
