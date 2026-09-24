/* ============================================================
   CHAPTERS 01 – 05
   ============================================================ */

window.CHAPTERS_A = (function () {
  const E = window.EXAMPLE;
  const M = window.MODEL;

  /* ---------------------------------------------------------
     01 — THE MODEL
     --------------------------------------------------------- */

  const ch01 = {
    id: 'ch01', num: 1, title: 'The Model',
    kicker: 'Two dimensions, not one ladder',
    question: 'What is the model, and what is it made of?',
    stage: null, scaffold: 'high',
    intro: 'Most delivery confusion comes from collapsing two different things into one list. This chapter separates them, then makes you sort the pieces yourself.',
    sections: [
      {
        id: 's1', title: 'Two dimensions', kicker: 'Understand',
        lede: 'The model has exactly two dimensions. Everything else in this book hangs off them.',
        blocks: [
          { type: 'prose', p: [
            'The first dimension answers <strong>what are we building</strong>. It is a containment hierarchy: each level holds the level below it, and every item has exactly one parent.',
            'The second answers <strong>when and how does work move toward production</strong>. It is a lifecycle: a sequence of activities that work passes through, repeatedly, and that loops back on itself.',
            'They are not two views of the same thing. A Story is a place in the hierarchy. Refine is a thing you do to it. You can be in Refine for an Initiative, an Epic and a Story at the same time, on different days, for the same piece of work.'
          ]},
          { type: 'twoflows' },
          { type: 'callout', variant: 'principle', label: 'The distinction', text: 'The hierarchy tells you where something lives. The lifecycle tells you what is happening to it. Confusing the two is the single most common structural mistake in delivery.' }
        ]
      },
      {
        id: 's2', title: 'The work hierarchy', kicker: 'See',
        lede: 'Six levels. Each one answers a different question. Open any level to see what belongs in it — and what does not.',
        blocks: [
          { type: 'hierarchy' },
          { type: 'callout', variant: 'note', label: 'On depth', text: 'You will not use all six levels on every piece of work. Small work goes Initiative → Story → Task and skips Epic and Feature entirely. Levels are available, not mandatory. Creating an Epic to hold one Story is bureaucracy.' }
        ]
      },
      {
        id: 's3', title: 'The delivery lifecycle', kicker: 'See',
        lede: 'Eight activities. The last one returns to the second — which is why this is a lifecycle and not a pipeline.',
        blocks: [
          { type: 'lifecycle' },
          { type: 'callout', variant: 'principle', label: 'Continuous', text: 'Operate does not end the lifecycle. It feeds Refine. An Initiative stays open until its objective is met or deliberately abandoned — not until its last Story ships.' }
        ]
      },
      {
        id: 's4', title: 'What is not a hierarchy level', kicker: 'Understand',
        lede: 'Ten things people routinely promote into the hierarchy, and what each one actually is. Open each to see why it does not belong.',
        blocks: [
          { type: 'notlevels' },
          { type: 'callout', variant: 'warning', label: 'The test', text: 'Ask: can this item be accepted, and can it be released? A Story can. "Architecture" cannot. If the answer is no to both, it is not a hierarchy level.' }
        ]
      },
      {
        id: 's5', title: 'Sort them yourself', kicker: 'Practice',
        lede: 'Every answer is explained — including the ones you get right.',
        blocks: [
          { type: 'exercise', kind: 'classify', id: 'ex-01-sort',
            prompt: 'For each item, decide what it is in this model.',
            buckets: [
              { id: 'level', label: 'Hierarchy level' },
              { id: 'stage', label: 'Lifecycle activity' },
              { id: 'artifact', label: 'Artifact or property' }
            ],
            items: [
              { text: 'Feature', answer: 'level', explain: 'A hierarchy level. It sits between Epic and Story and names a capability that can be described and demonstrated as a whole.' },
              { text: 'Verify', answer: 'stage', explain: 'A lifecycle activity. It is what you do to prove a built thing satisfies what was required. No work item lives "inside" Verify.' },
              { text: 'Acceptance Criteria', answer: 'artifact', explain: 'A property of a Story. It lives inside the Story record and defines when that Story is correct. It is never a separate work item.' },
              { text: 'Sprint', answer: 'artifact', explain: 'Neither a level nor a lifecycle activity — it is a time box, a planning container. Work does not become smaller or more valuable by being placed in one. Use it as a field, never as a parent.' },
              { text: 'Story', answer: 'level', explain: 'A hierarchy level, and the most important one. It is the unit of valuable, independently testable change — the thing that passes the Ready Gate and gets released.' },
              { text: 'Architecture', answer: 'artifact', explain: 'A property of the system, addressed during Refine and Design. Making it a level creates work items nobody can accept or release.' },
              { text: 'Refine', answer: 'stage', explain: 'A lifecycle activity. It is where requirements are discovered, impact is checked, and work is decomposed and sliced.' },
              { text: 'Release', answer: 'artifact', explain: 'A shipping boundary and a record, not a level. One Release routinely contains Stories from unrelated Initiatives — which is impossible for a parent.' },
              { text: 'Task', answer: 'level', explain: 'A hierarchy level, below Story. It holds implementation work. It is how, not what.' },
              { text: 'Definition of Done', answer: 'artifact', explain: 'A team-wide completion standard. It applies unchanged to every Story, so it cannot be a level or an item. Reference it; never copy it.' },
              { text: 'Discover', answer: 'stage', explain: 'A lifecycle activity — the one that answers why. Its output is an Initiative, which is a level.' },
              { text: 'System Design', answer: 'artifact', explain: 'An artifact produced when the Architecture Impact Check finds impact. It is an output of a decision rule, not a rung on the ladder. Most Stories never need one.' }
            ]
          }
        ]
      },
      {
        id: 's6', title: 'Where we are going', kicker: 'Continue',
        lede: 'One example runs through this entire book. Here it is, before anything has been done to it.',
        blocks: [
          { type: 'prose', p: [
            '<strong>' + E.product.name + '</strong> — ' + E.product.blurb
          ]},
          { type: 'artifactcard', data: {
            kind: 'Raw signal', id: E.raw.id, name: E.raw.name,
            rows: [
              { k: 'The request', v: E.raw.body },
              { k: 'Supporting signals', v: { list: E.raw.supporting } }
            ],
            foot: [{ k: 'Stage', v: 'Nothing yet — this has not entered Discover' }, { k: 'System of record', v: 'None. It is an email.' }]
          }},
          { type: 'callout', variant: 'warning', label: 'Notice', text: 'The request names a solution — a dashboard. It does not name a problem, an outcome, or anything that could count as success. Chapter 03 is about what to do with a request in this shape.' }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     02 — HOW THE MODEL WORKS
     --------------------------------------------------------- */

  const ch02 = {
    id: 'ch02', num: 2, title: 'How the Model Works',
    kicker: 'Six connected systems',
    question: 'How do the parts fit together without competing?',
    stage: null, scaffold: 'high',
    intro: 'The two dimensions are operated by six connected models. They are not rival hierarchies. Each one owns a question, hands something to the next, and takes something back.',
    sections: [
      {
        id: 's1', title: 'The three layers', kicker: 'Understand',
        lede: 'Everything in this book sits in one of three layers. A lesson that touches only one of them is incomplete.',
        blocks: [
          { type: 'layers', layers: [
            { name: 'Learning layer', chain: ['Explain', 'Demonstrate', 'Practice', 'Assess'], note: 'Teaches the person. This is the shape of every chapter: understand it, watch it done, do it, get checked.' },
            { name: 'Process layer', chain: ['Discover', 'Refine', 'Design', 'Ready', 'Deliver', 'Verify', 'Release', 'Operate'], note: 'Teaches the lifecycle. What happens, in what order, and what has to be true before you move.' },
            { name: 'Operating layer', chain: ['Inputs', 'Actions', 'Outputs', 'Evidence', 'Owner', 'System of record', 'Next'], note: 'Teaches how the process is actually executed by a real organisation. Without this layer a process is a diagram, not a way of working.' }
          ]},
          { type: 'callout', variant: 'principle', label: 'Rule', text: 'Every significant procedure in this book answers all seven operating-layer questions explicitly. If you cannot say who owns something and where the result is recorded, you have described an idea, not a procedure.' }
        ]
      },
      {
        id: 's2', title: 'Six models, one system', kicker: 'See',
        lede: 'Each model owns a question. Follow what each one gives and takes.',
        blocks: [
          { type: 'models' },
          { type: 'callout', variant: 'note', label: 'Why this matters', text: 'Most process arguments are really boundary disputes between these six. "Should QA write the acceptance criteria?" is a question about where the Product Model ends and the Quality Model begins. Naming the boundary usually dissolves the argument.' }
        ]
      },
      {
        id: 's3', title: 'The operating model for every procedure', kicker: 'Understand',
        lede: 'This nine-part structure is mandatory. You will see it on every procedure from here on.',
        blocks: [
          { type: 'opmodel', data: {
            inputs: 'What must exist before I start? If an input is missing, the procedure cannot be run — that is a gate condition, not an inconvenience.',
            actions: 'What exactly do I do? Executable steps, not "consider the requirements".',
            output: 'What should exist afterward? A named artifact in a named place.',
            evidence: 'How do I prove it was done correctly? Something a sceptical outsider could inspect.',
            owner: 'Who is responsible for moving this forward? Exactly one person.',
            participants: 'Who contributes? People whose knowledge is needed. They do not decide.',
            decision: 'Who resolves the decision? Named before it is needed.',
            sor: 'Where is the result recorded? If nowhere, it did not happen.',
            next: 'Where does the work go afterward? Including where it goes when it fails.'
          }},
          { type: 'responsibility' }
        ]
      },
      {
        id: 's4', title: 'Failure paths are first class', kicker: 'Understand',
        lede: 'Real work does not run step → step → step → done. Every gate has two exits.',
        blocks: [
          { type: 'gateshape' },
          { type: 'prose', p: [
            'A gate that only has a pass exit is a checkbox. A real gate defines six things: what happens on pass, what happens on fail, what must be corrected, where the work returns to, what gets re-evaluated, and who resolves it.',
            'You will fail gates in this book. That is the point. A gate you cannot fail teaches nothing.'
          ]},
          { type: 'callout', variant: 'warning', label: 'Decorative gates', text: 'If a gate has never failed, it is not measuring anything. Either the condition is trivially true, or people are answering it to get past it. Both are worth fixing.' }
        ]
      },
      {
        id: 's5', title: 'Always, when needed, optional', kicker: 'Understand',
        lede: 'The fastest way to make a delivery model useless is to require everything it names.',
        blocks: [
          { type: 'necessity' },
          { type: 'callout', variant: 'principle', label: 'The anti-bureaucracy rule', text: 'Do not create a document because a concept has a name. Create it because a named person will make a decision or perform an operation with it — or because an obligation requires it.' }
        ]
      },
      {
        id: 's6', title: 'Check your grip', kicker: 'Practice',
        blocks: [
          { type: 'exercise', kind: 'choice', id: 'ex-02-q1',
            prompt: 'A team proposes an "Architecture" Epic to hold all the design work for an Initiative. What is wrong with it?',
            options: [
              { text: 'Nothing — grouping design work keeps it visible.', correct: false, explain: 'Visibility is a real need, but an Epic is the wrong instrument. Epics group capability, and capability is something you can accept and release. Nobody can accept "Architecture".' },
              { text: 'Architecture is not a hierarchy level; the Epic would hold work that can never be accepted or released, and it detaches design from the requirement that caused it.', correct: true, explain: 'Correct. Design work exists because a specific requirement has architecture impact. Parenting it separately breaks that link, so the design outlives the reason for it — and nobody can tell when it is done.' },
              { text: 'It should be a Feature instead.', correct: false, explain: 'Same problem one level down. The issue is not the level chosen, it is that architecture is a property addressed during Refine and Design, not a container of work.' },
              { text: 'It should be an Initiative because architecture is strategic.', correct: false, explain: 'An Initiative holds a problem and an intended outcome. "We should have good architecture" is neither, and it has no success criteria you could test.' }
            ]
          },
          { type: 'exercise', kind: 'choice', id: 'ex-02-q2',
            prompt: 'A delivery lead wants every Initiative to produce a System Design document before refinement begins. What does the model say?',
            options: [
              { text: 'Agree — designing up front prevents rework.', correct: false, explain: 'It prevents some rework and creates a lot of waste. Most requirements fit existing architecture. Designing before you know what the requirements are means designing against guesses.' },
              { text: 'Run an Architecture Impact Check per requirement; produce a System Design only where impact exists.', correct: true, explain: 'Correct. The check is Always; the design is When needed. This is the decision rule doing its job — it converts a standing document requirement into a judgement made against actual requirements.' },
              { text: 'Never produce System Designs; they go stale.', correct: false, explain: 'Over-correction. Structural impact without design means discovering the architecture during implementation, which is the most expensive place to discover it.' },
              { text: 'Produce a System Design only when an ADR exists.', correct: false, explain: 'Backwards. The impact check decides whether design is needed; the design work is where you discover whether a significant decision with trade-offs exists, and that is what produces an ADR.' }
            ]
          }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     03 — DISCOVER
     --------------------------------------------------------- */

  const ch03 = {
    id: 'ch03', num: 3, title: 'Discover',
    kicker: 'Lifecycle · 01',
    question: 'Why are we doing this?',
    stage: 'discover', scaffold: 'high',
    intro: 'Discover converts a raw signal into an intent that can be argued with. Its output is an Initiative: a problem, an objective, an outcome, success criteria, a scope boundary and the constraints you are working inside.',
    sections: [
      {
        id: 's1', title: 'What Discover is for', kicker: 'Understand',
        blocks: [
          { type: 'transform', data: {
            before: 'An email asking for a dashboard, plus some support volume nobody has counted.',
            now: 'A problem, an objective, success criteria, a scope boundary and named constraints — recorded as an Initiative.',
            connects: 'The raw signal becomes evidence of a problem; the solution in the request becomes a candidate, not the premise.',
            next: 'Refine reads the Initiative objective and discovers what must be true for it.'
          }},
          { type: 'opmodel', data: {
            inputs: 'A raw signal: a request, complaint, support pattern, incident trend, market input or strategic goal. Access to whoever has the problem.',
            actions: 'The seven steps below.',
            output: 'An Initiative record.',
            evidence: 'An accepted Initiative with a named decision maker and a date. Acceptance means someone with authority agreed this is worth solving — not that the solution is known.',
            owner: 'Product lead',
            participants: 'Engineering lead, design lead, domain expert, whoever raised the signal',
            decision: 'Product lead, or a product council where one exists',
            sor: 'Work management system — Initiative record',
            next: 'Refine. On failure: back to the specific Discover step that was insufficient.'
          }},
          { type: 'callout', variant: 'principle', label: 'The discipline', text: 'Discover is where you refuse to accept a solution as a premise. If you skip it, every later argument about scope has no referee, because nobody wrote down what would count as success.' }
        ]
      },
      {
        id: 's2', title: 'The seven steps', kicker: 'Follow',
        lede: 'Each step is executable. Open one and you get why it exists, who owns it, exactly what to do, a worked example from Atlas, the mistake people actually make, and where to go if it fails.',
        blocks: [
          { type: 'procedure', steps: [
            {
              n: 1, title: 'Identify the problem',
              why: 'Everything downstream is justified by the problem. A wrong problem cannot be rescued by good execution — it just produces something correct that nobody needed.',
              inputs: ['The raw signal', 'Access to the people who have the problem', 'Any existing data about it'],
              who: 'Product lead',
              participants: ['Whoever raised the signal', 'Support or customer-facing staff', 'A user who has the problem'],
              what: 'A problem statement naming who has the problem, what is bad today, and the evidence that it is real.',
              how: [
                'Write down the request exactly as received.',
                'Strike out every solution word in it. Whatever remains is your starting material.',
                'Ask: who has this problem? Name a role, not "users".',
                'Ask: what do they do today, and what is bad about it? Describe behaviour, not feelings.',
                'Ask: how do we know? Find at least one countable signal — ticket volume, observed time, churn reason, incident frequency.',
                'Write the problem statement in one paragraph: who, what is bad, what it causes.',
                'Read it back to someone who has the problem and ask what you got wrong.'
              ],
              example: {
                label: 'Atlas — from request to problem',
                before: 'Request: "Can we get a project dashboard on the roadmap?"',
                after: E.problem.statement,
                note: 'Striking out "dashboard" left "customers keep asking" and "three of our largest accounts". That is not a problem — it is a popularity signal. The problem was found by asking what PMs do today: they open projects one at a time, each morning, for 12–20 minutes.'
              },
              mistakes: [
                'Keeping the solution in the problem statement: "PMs have no dashboard." That is not a problem, it is a missing thing.',
                'Naming "users" instead of a role. Different roles have different problems and the differences matter.',
                'No countable signal, so nobody can tell later whether the problem shrank.'
              ],
              output: 'Problem statement',
              evidence: 'At least one countable signal, with its source and the period it covers.',
              where: 'Draft Initiative record, problem field',
              ifFailed: 'If you cannot name who has the problem or cannot find a single countable signal, you do not have a problem yet — you have a preference. Go back to the signal and talk to someone who has it. Do not proceed to step 2.'
            },
            {
              n: 2, title: 'Define the objective',
              why: 'The objective is the change you intend to cause. It is what you will be judged against, and what tells you whether a proposed solution is on-topic.',
              inputs: ['Problem statement'],
              who: 'Product lead',
              participants: ['Engineering lead', 'Design lead'],
              what: 'One sentence describing the change in the world, containing no solution.',
              how: [
                'Take the problem statement.',
                'Write: "Make it so that …" and complete it with the state you want to be true.',
                'Check the sentence for nouns that are things you would build. Remove them.',
                'Check it describes a change, not an activity. "Improve visibility" is an activity; "at-risk work is visible without opening each project" is a change.',
                'Test it: could two different solutions both satisfy this objective? If not, it is a solution in disguise.'
              ],
              example: {
                label: 'Atlas — objective',
                before: 'Draft: "Build a risk dashboard for project managers."',
                after: E.objective.statement,
                note: 'The rewritten objective can be satisfied by a dashboard, by indicators in the existing list, by a digest email, or by something nobody has thought of. That is the test passing.'
              },
              mistakes: [
                'An objective that names the artifact you already decided to build.',
                'An objective that is really a metric target with no behaviour behind it.',
                'Several objectives bundled into one sentence with "and".'
              ],
              output: 'Objective statement',
              evidence: 'The two-solutions test: you can name at least two different shapes of solution that would satisfy it.',
              where: 'Draft Initiative record, objective field',
              ifFailed: 'If only one solution could possibly satisfy the objective, you have written a solution. Return to step 1 and re-read the problem — the objective must come from the problem, not from the request.'
            },
            {
              n: 3, title: 'Define the desired outcome',
              why: 'The objective is abstract. The outcome describes what a specific person experiences differently, which is what makes it possible to recognise success when you see it.',
              inputs: ['Objective', 'Problem statement'],
              who: 'Product lead',
              participants: ['A user with the problem', 'Design lead'],
              what: 'A short description of the changed experience, from the point of view of the person who had the problem.',
              how: [
                'Pick the role named in the problem statement.',
                'Describe a concrete moment in their day, after the change.',
                'Say what they do, and what they no longer do.',
                'Keep it free of interface detail — no screens, no buttons.'
              ],
              example: {
                label: 'Atlas — desired outcome',
                before: 'Objective: make at-risk and late deliverables visible without opening each project.',
                after: E.objective.outcome,
                note: 'Notice "starting their day" and "before the client notices". Both are testable later. The outcome does not say how the visibility appears.'
              },
              mistakes: [
                'Describing the interface instead of the experience.',
                'Writing an outcome for the business when the problem belonged to a user, or the reverse.'
              ],
              output: 'Desired outcome statement',
              evidence: 'A user with the problem recognises it as the thing they want.',
              where: 'Draft Initiative record, outcome field',
              ifFailed: 'If the outcome is only describable in terms of a screen, the objective is probably still a solution. Return to step 2.'
            },
            {
              n: 4, title: 'Define success criteria',
              why: 'Success criteria are the difference between an Initiative you can close and one that drifts forever. They are also what Operate monitors after release.',
              inputs: ['Objective', 'Desired outcome', 'Any baseline data you have'],
              who: 'Product lead',
              participants: ['Data or analytics, where available', 'Engineering lead for feasibility of measurement'],
              what: 'Two to four criteria, each an observable signal with a direction and, where possible, a baseline.',
              how: [
                'For each desired outcome, ask: if this were true, what would be different in the data?',
                'Write each as a signal: what is measured, in what direction, from what baseline, by when.',
                'If no baseline exists, say so explicitly and make establishing it part of the work.',
                'Check each criterion can be measured with data the system either has or will have — and if it will not, that is a requirement.',
                'Stop at four. More than four means you have not decided what matters.'
              ],
              example: {
                label: 'Atlas — success criteria',
                list: E.initiative.success,
                note: 'The second criterion required a measurement that did not exist. That became REQ-09 and eventually STORY-118. Criteria you cannot measure are not criteria — they are hopes, unless you make the measurement part of the work.'
              },
              mistakes: [
                'Criteria measuring output ("dashboard shipped") instead of outcome.',
                'Criteria with no baseline, so any result can be declared a success.',
                'Criteria that need data nobody collects, with no plan to collect it.'
              ],
              output: 'Success criteria',
              evidence: 'Each criterion names its measurement source, and any missing measurement is captured as work.',
              where: 'Draft Initiative record, success criteria field',
              ifFailed: 'If a criterion cannot be measured and you are not willing to build the measurement, delete it. An unmeasurable criterion weakens the ones that remain.'
            },
            {
              n: 5, title: 'Define initial scope',
              why: 'Scope in Discover is a boundary, not a plan. Its purpose is to make later scope arguments cheap by having already had them once, in writing.',
              inputs: ['Objective', 'Desired outcome', 'Success criteria'],
              who: 'Product lead',
              participants: ['Engineering lead', 'Design lead'],
              what: 'A short in-scope list and — more importantly — an explicit out-of-scope list.',
              how: [
                'List what must be true for the objective to be achieved at all. That is in scope.',
                'List every adjacent thing someone has already mentioned. For each, decide: in, out, or later.',
                'Write the out list down with a one-line reason for each.',
                'For anything marked "later", say what would make it come back.',
                'Do not decompose. This is a boundary, not a breakdown.'
              ],
              example: {
                label: 'Atlas — scope boundary',
                twoLists: { inLabel: 'In scope', inList: E.initiative.scopeIn, outLabel: 'Explicitly out', outList: E.initiative.scopeOut },
                note: 'Notification digests were the second most requested thing. Putting them explicitly out, with a reason, ended the argument for the whole Initiative — and made it easy to open a separate Initiative later without reopening this one.'
              },
              mistakes: [
                'An in-scope list with no out-of-scope list. Everything unlisted then becomes arguable.',
                'Decomposing into Epics here. That is Refine.',
                'Marking things "later" with no condition for return, which means "never" said politely.'
              ],
              output: 'Scope boundary with non-goals',
              evidence: 'A written out-of-scope list with reasons.',
              where: 'Draft Initiative record, scope fields',
              ifFailed: 'If you cannot name anything that is out of scope, you have not drawn a boundary. Ask what the most enthusiastic stakeholder would add, and rule on it.'
            },
            {
              n: 6, title: 'Identify major constraints',
              why: 'Constraints shape what solutions are even available. Discovered late, they invalidate design work; discovered here, they direct it.',
              inputs: ['Objective', 'Scope boundary', 'Existing architecture and ADRs', 'Commercial and regulatory context'],
              who: 'Engineering lead, with the product lead',
              participants: ['Architecture owners', 'Security', 'Legal or compliance where relevant'],
              what: 'A list of constraints that any solution must respect, each with its source.',
              how: [
                'Walk four sources: technical (architecture, ADRs, platform), operational (budgets, SLOs, support), commercial (pricing, plans, contracts), regulatory (data, retention, accessibility).',
                'For each, ask whether it limits the space of acceptable solutions for this objective.',
                'Write each constraint as a limit, with the source that imposes it.',
                'Distinguish a real constraint from a preference. A preference is a decision you are allowed to revisit.'
              ],
              example: {
                label: 'Atlas — constraints',
                list: E.initiative.constraints,
                note: 'The 90-second replica lag looks like a technical detail. It later became the single fact that decided ADR-014 and ruled out the cheapest implementation. Constraints found in Discover pay for themselves in Design.'
              },
              mistakes: [
                'Listing preferences as constraints, which quietly removes options nobody had to justify removing.',
                'Omitting constraints because "everyone knows" — the person who will design this in six weeks does not.',
                'Naming a constraint without its source, so nobody can tell whether it still holds.'
              ],
              output: 'Constraint list',
              evidence: 'Each constraint names its source — an ADR, a contract, a regulation, a budget.',
              where: 'Draft Initiative record, constraints field',
              ifFailed: 'If engineering has not looked at existing ADRs, this step is not done. An unreviewed ADR is how teams discover in week six that the thing they designed is forbidden.'
            },
            {
              n: 7, title: 'Create the Initiative',
              why: 'Until it is recorded in the system of record with an owner and a decision, Discover has produced a conversation, not an artifact.',
              inputs: ['All six previous outputs'],
              who: 'Product lead',
              participants: ['Everyone who contributed'],
              what: 'The Initiative record.',
              how: [
                'Create the Initiative in the work management system.',
                'Fill every field: problem, objective, outcome, success criteria, in scope, out of scope, constraints.',
                'Name the owner and the participants.',
                'Take it to the decision maker and get an explicit acceptance, with a date.',
                'Record the acceptance on the Initiative.',
                'Run the Discover Gate.'
              ],
              example: { label: 'Atlas — the Initiative', artifactRef: 'initiative' },
              mistakes: [
                'Leaving fields blank "for now" — blanks become assumptions.',
                'No named decision maker, so nobody can say later whether this was agreed.',
                'Treating creation as the end. It is the point at which the gate can be run.'
              ],
              output: 'Initiative record',
              evidence: 'Accepted Initiative with a named decision maker and a date.',
              where: 'Work management system',
              ifFailed: 'If the decision maker will not accept it, find out which of the six fields they disagree with and return to that step. "They said no" is not a finding; "they disputed the success criteria" is.'
            }
          ]},
          { type: 'artifactcard', data: {
            kind: 'Initiative', id: E.initiative.id, name: E.initiative.name,
            rows: [
              { k: 'Problem', v: E.initiative.problem },
              { k: 'Objective', v: E.initiative.objective },
              { k: 'Desired outcome', v: E.initiative.outcome },
              { k: 'Success criteria', v: { list: E.initiative.success } },
              { k: 'In scope', v: { list: E.initiative.scopeIn } },
              { k: 'Explicitly out', v: { list: E.initiative.scopeOut } },
              { k: 'Constraints', v: { list: E.initiative.constraints } }
            ],
            foot: [
              { k: 'Owner', v: E.initiative.owner },
              { k: 'Decision', v: E.initiative.decision },
              { k: 'System of record', v: E.initiative.sor }
            ]
          }},
          { type: 'checklist', id: 'cl-discover', title: 'Discover — procedural checklist', items: [
            'Problem statement names a role, what is bad today, and a countable signal',
            'Objective describes a change, with no solution in it',
            'At least two different solutions could satisfy the objective',
            'Desired outcome is written from the point of view of the person with the problem',
            'Two to four success criteria, each with a measurement source',
            'Any missing measurement captured as work, not assumed',
            'In-scope list written',
            'Out-of-scope list written, with a reason for each item',
            'Constraints listed, each with its source',
            'Existing ADRs reviewed for constraints',
            'Initiative created in the work management system with every field filled',
            'Owner named, decision maker named, acceptance dated',
            'Discover Gate run and result recorded'
          ]}
        ]
      },
      {
        id: 's3', title: 'What bad looks like', kicker: 'See',
        blocks: [
          { type: 'badgood', data: {
            bad: { label: 'The Initiative as first drafted', q: 'Build a project dashboard', list: [
              'Objective: ship the dashboard in Q2',
              'Success: dashboard launched',
              'Scope: dashboard',
              'Constraints: none listed'
            ]},
            good: { label: 'After Discover', q: E.initiative.name, list: [
              'Objective: ' + E.objective.statement,
              'Success: median identification time under 30 seconds; flag-before-miss above 50%',
              'Explicitly out: predictive scoring, client-facing pages, notification digests',
              'Constraints: 90s replica lag; ADR-006; 200ms page budget'
            ]},
            why: 'The first version cannot be refused. Every field is either the solution restated or empty, so no proposal could ever be judged off-topic and no result could ever be judged a failure. The second version can be argued with — which is what makes it useful.',
            repair: 'Strike the solution words out of the request. Ask who has the problem, what they do today, and how you know. Then ask what would be different in the data if you succeeded.'
          }},
          { type: 'exercise', kind: 'build', id: 'ex-03-problem',
            prompt: 'Your turn: turn a raw request into a problem statement.',
            brief: 'A raw request has arrived: <em>"Sales says we need bulk export. Two deals this quarter asked for it. Can we add a CSV export button to the reports page?"</em> Write the problem statement. Do not write the solution.',
            fields: [
              { id: 'who', label: 'Who has the problem?', hint: 'A role, not "users". One line.', rows: 2,
                checks: [
                  { type: 'minWords', value: 2, level: 'bad', msg: 'Too short to name a role and its situation.' },
                  { type: 'excludesAny', value: ['user', 'users', 'everyone', 'people'], level: 'warn', msg: 'You have named a generic group. Which role, doing what job? Different roles have different problems.' }
                ]
              },
              { id: 'bad', label: 'What is bad today?', hint: 'Describe behaviour, not feelings. What do they do now, and what does it cost them?', rows: 4,
                checks: [
                  { type: 'minWords', value: 12, level: 'bad', msg: 'Not enough to describe current behaviour and its cost.' },
                  { type: 'excludesAny', value: ['export', 'csv', 'button', 'download'], level: 'bad', msg: 'The solution is still in your problem statement. Describe what they do today without the thing you would build.' }
                ]
              },
              { id: 'signal', label: 'How do we know? Name a countable signal.', hint: 'Something with a number and a source — even if you have to say what you would go and count.', rows: 3,
                checks: [
                  { type: 'minWords', value: 6, level: 'bad', msg: 'Name something countable and where you would get the count.' },
                  { type: 'includesDigit', level: 'warn', msg: 'No number here. "Two deals asked" is a start, but two sales anecdotes is a weak signal — what else would you count, and where?' }
                ]
              }
            ],
            sampleLabel: 'How an expert answered this',
            sample: [
              { k: 'Who', v: 'Account managers preparing quarterly business reviews for enterprise clients.' },
              { k: 'What is bad', v: 'To build a QBR deck they read the reports page on screen and retype the figures into slides, one client at a time. It takes 2–3 hours per client and the retyped numbers go stale as soon as the underlying data moves, so a QBR prepared on Monday is wrong by Thursday.' },
              { k: 'Signal', v: '2 enterprise deals this quarter named it during negotiation — weak on its own. Stronger: 11 of 14 account managers report retyping figures; the QBR template has 40+ figures; 3 support tickets this quarter report "numbers in my deck do not match the product".' },
              { k: 'Note', v: 'The request said CSV export from the reports page. The problem may equally be solved by a QBR view, a scheduled snapshot, or a slide integration. The problem statement keeps all of those available.' }
            ]
          }
        ]
      },
      {
        id: 's4', title: 'The Discover Gate', kicker: 'Gate',
        lede: 'Six conditions. Answer honestly — a failed condition tells you exactly which step to return to.',
        blocks: [
          { type: 'gate', id: 'gate-discover', title: 'Discover Gate', sub: 'Can this Initiative enter Refine?',
            checks: [
              { id: 'g1', q: 'Is the problem understood?', cond: 'A role is named, current behaviour is described, and at least one countable signal exists.',
                fail: { what: 'The problem is a preference or a missing feature, not an observed difficulty.', returnTo: 'Discover step 1 — Identify the problem', correct: 'Talk to someone who has the problem. Find one countable signal. Rewrite the statement with no solution words in it.', recheck: 'Problem statement and signal', owner: 'Product lead' } },
              { id: 'g2', q: 'Is the objective clear and solution-free?', cond: 'At least two different solutions could satisfy it.',
                fail: { what: 'The objective names the thing you intend to build, so the solution has been decided before the problem was understood.', returnTo: 'Discover step 2 — Define the objective', correct: 'Rewrite as "make it so that…" and delete every noun you could build. Apply the two-solutions test.', recheck: 'Objective statement', owner: 'Product lead' } },
              { id: 'g3', q: 'Is the desired outcome clear?', cond: 'It describes what a named role experiences differently, without interface detail.',
                fail: { what: 'The outcome is described in screens, or written for the wrong person.', returnTo: 'Discover step 3 — Define the desired outcome', correct: 'Describe a moment in the day of the role named in the problem. Say what they do and what they stop doing.', recheck: 'Outcome statement', owner: 'Product lead' } },
              { id: 'g4', q: 'Can success be described?', cond: 'Two to four criteria, each with a direction and a measurement source.',
                fail: { what: 'Success is either unmeasurable or measures output rather than outcome.', returnTo: 'Discover step 4 — Define success criteria', correct: 'For each criterion name the measurement source. Where none exists, capture building it as work, or delete the criterion.', recheck: 'Success criteria', owner: 'Product lead' } },
              { id: 'g5', q: 'Is the initial scope understood?', cond: 'There is an explicit out-of-scope list with reasons.',
                fail: { what: 'No boundary exists, so every adjacent idea remains arguable during refinement.', returnTo: 'Discover step 5 — Define initial scope', correct: 'Ask what the most enthusiastic stakeholder would add and rule on each item. Write the out list with reasons.', recheck: 'Scope boundary', owner: 'Product lead' } },
              { id: 'g6', q: 'Are major constraints known?', cond: 'Technical, operational, commercial and regulatory sources have been walked, and existing ADRs reviewed.',
                fail: { what: 'Constraints are unexamined, so design will be done against assumptions that may already be forbidden.', returnTo: 'Discover step 6 — Identify major constraints', correct: 'Walk the four sources with engineering. Review existing ADRs. Record each constraint with its source.', recheck: 'Constraint list', owner: 'Engineering lead' } }
            ],
            passText: 'Discover is complete. The Initiative is accepted and recorded. Work moves to Refine, where requirements are discovered from the objective.',
            failText: 'Discover is not complete. Correct the failed conditions at the steps named above, then run this gate again. Do not start refinement on a failed Discover — every requirement you discover will inherit the defect.'
          }
        ]
      },
      {
        id: 's5', title: 'Evidence, not claims', kicker: 'Evidence',
        blocks: [
          { type: 'claimevidence', data: {
            claim: '"We did discovery."',
            evidence: 'An Initiative record containing a problem statement with a countable signal, an objective that passes the two-solutions test, success criteria with named measurement sources, an explicit out-of-scope list, constraints with sources, and an acceptance by a named decision maker on a date.',
            note: 'The evidence is not more words. It is the specific things a sceptic could check.'
          }},
          { type: 'transform', data: {
            before: 'A raw request naming a solution.',
            now: 'INIT-42, accepted 12 March.',
            connects: 'The objective is what Refine reads in its very first step to discover requirements.',
            next: 'Chapter 04 — Refine.'
          }}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     04 — REFINE
     --------------------------------------------------------- */

  const ch04 = {
    id: 'ch04', num: 4, title: 'Refine',
    kicker: 'Lifecycle · 02',
    question: 'What exactly needs to be true?',
    stage: 'refine', scaffold: 'high',
    intro: 'Refinement is not a meeting. It is four activities: frame the problem, discover requirements, check impact and testability, then decompose and slice. This chapter covers the first two in full; impact has its own chapter, and decomposition has two.',
    sections: [
      {
        id: 's1', title: 'The four activities', kicker: 'Understand',
        blocks: [
          { type: 'flow', dir: 'row', nodes: [
            { t: 'Frame the problem', s: 'Re-read intent' },
            { t: 'Discover requirements', s: 'What must be true' },
            { t: 'Impact + testability', s: 'Can we, and can we prove it' },
            { t: 'Decompose + slice', s: 'Epic → Feature → Story' }
          ]},
          { type: 'opmodel', data: {
            inputs: 'An accepted Initiative with objective, outcome, success criteria, scope boundary and constraints.',
            actions: 'Frame, discover requirements, classify, check architecture impact, check testability, decompose, slice, write Acceptance Criteria.',
            output: 'A requirement set with classifications and traces; Epics, Features and Stories; Acceptance Criteria on each Story.',
            evidence: 'Requirements traced to Stories; an architecture impact outcome recorded for each requirement that could touch the system.',
            owner: 'Product lead, with the whole team',
            participants: 'Engineers, QA, design, domain experts',
            decision: 'Product lead for scope and priority; engineering lead for impact; QA lead for testability',
            sor: 'Work management system, attached to the Initiative',
            next: 'Design where impact exists, then the Ready Gate per Story. On failure: back to Discover if the objective will not support requirements.'
          }},
          { type: 'callout', variant: 'principle', label: 'Where requirements come from', text: 'Requirements are discovered during refinement, from the objective. They are not handed down from Discover, and they are not invented during implementation.' }
        ]
      },
      {
        id: 's2', title: 'Requirement discovery', kicker: 'Follow',
        lede: 'Ten steps that turn an objective into a requirement set. This is the procedure that most teams skip, and it is why their Stories arrive with no traceable reason to exist.',
        blocks: [
          { type: 'procedure', steps: [
            {
              n: 1, title: 'Read the Initiative objective',
              why: 'Requirements are derived from the objective. Starting anywhere else produces requirements with no reason to exist.',
              inputs: ['Accepted Initiative'], who: 'Product lead', participants: ['Team'],
              what: 'Shared understanding of the objective, out loud.',
              how: ['Read the objective aloud to the group.', 'Read the desired outcome.', 'Read the out-of-scope list — this is the moment it earns its keep.', 'Ask whether anyone reads the objective differently. Resolve it now.'],
              example: { label: 'Atlas', before: 'Objective: ' + E.objective.statement, after: 'One engineer read "visible" as "notified". The out-of-scope list already ruled digests out, so the ambiguity was resolved in 30 seconds instead of in week four.' },
              mistakes: ['Skipping the read-aloud because "everyone has seen it".'],
              output: 'Agreed reading of the objective', evidence: 'Ambiguities raised and resolved in the session notes',
              where: 'Refinement notes on the Initiative', ifFailed: 'If the group cannot agree what the objective means, return to Discover step 2.'
            },
            {
              n: 2, title: 'Identify required outcomes',
              why: 'An objective is usually several outcomes bundled together. Splitting them first prevents a requirement set that covers one outcome well and the others not at all.',
              inputs: ['Objective', 'Desired outcome', 'Success criteria'], who: 'Product lead', participants: ['Team'],
              what: 'A list of the distinct outcomes the objective requires.',
              how: ['Write the objective on one line.', 'Ask: what distinct things must become true for this to hold?', 'List them. Expect three to six.', 'Check each success criterion maps to at least one outcome. If one does not, you are missing an outcome.'],
              example: { label: 'Atlas — outcomes', list: [
                'A PM can see at-risk work across all their projects in one place',
                'Risk is derived from data Atlas already holds, not entered by hand',
                'Identification is fast enough to do at a glance',
                'The PM can act on what they see',
                'Atlas can tell whether early warning actually reduced misses'
              ], note: 'The last outcome exists only because of the second success criterion. Without step 2, measurement work is always the thing that gets forgotten.' },
              mistakes: ['Jumping straight to features.', 'Missing the measurement outcome, then discovering after release that you cannot tell whether it worked.'],
              output: 'Outcome list', evidence: 'Every success criterion maps to an outcome',
              where: 'Refinement notes', ifFailed: 'A success criterion with no outcome means either the criterion is wrong or an outcome is missing. Resolve before continuing.'
            },
            {
              n: 3, title: 'Ask what must be true for each outcome',
              why: 'This is the actual discovery move. Each answer is a candidate requirement.',
              inputs: ['Outcome list', 'Current system behaviour'], who: 'Team', participants: ['Engineers', 'QA', 'Design', 'Domain expert'],
              what: 'Raw candidate requirements, unclassified.',
              how: [
                'Take one outcome.',
                'Ask: what must be true for this to exist? Write every answer down, including the obvious ones.',
                'For each answer, ask "and what must be true for that?" until you reach something the system either does or does not do.',
                'Ask the negative: what must never happen? Those are requirements too, and they are the ones that get missed.',
                'Ask who must not see this. Permission requirements come from that question.',
                'Repeat for every outcome.'
              ],
              example: { label: 'Atlas — from one outcome to requirements', before: 'Outcome: risk is derived from data Atlas already holds.', after: 'What must be true? There must be a rule that says what Late means (REQ-03). And a rule for At risk (REQ-02). And the rules must use fields we have — due date and status. What must never happen? A PM must never see deliverables from projects they are not on (REQ-10). That negative question produced the permission requirement that nobody had mentioned.' },
              mistakes: ['Only asking the positive question, so permission, privacy and failure requirements are never found.', 'Stopping at the first level of "what must be true" and leaving the rest to implementation.'],
              output: 'Candidate requirement list', evidence: 'Each candidate traceable to an outcome',
              where: 'Refinement notes', ifFailed: 'If a candidate cannot be traced to any outcome, it is either scope creep or a missing outcome. Decide which, explicitly.'
            },
            {
              n: 4, title: 'Identify Functional requirements',
              why: 'Functional requirements state what the system must do. They are the ones most likely to be found and the least likely to be mis-stated.',
              inputs: ['Candidate list'], who: 'Product lead', participants: ['Engineers'],
              what: 'Candidates classified as Functional.',
              how: ['For each candidate ask: does this describe behaviour the system performs?', 'If yes, mark it Functional.', 'Rewrite it as a single testable statement, one behaviour per requirement.', 'Strip implementation detail — "a rule classifies a deliverable as Late" not "a nightly job writes a flag column".'],
              example: { label: 'Atlas', before: 'Candidate: "we need to know what counts as late"', after: E.requirements[2].text + ' — REQ-03, Functional' },
              mistakes: ['Bundling two behaviours in one requirement with "and".', 'Writing the implementation instead of the behaviour.'],
              output: 'Functional requirements', evidence: 'Each is a single testable statement',
              where: 'Requirement set on the Initiative', ifFailed: 'If you cannot describe how you would test it, it is not yet a requirement.'
            },
            {
              n: 5, title: 'Identify Business requirements',
              why: 'Business requirements state what the business needs to be true — commercial, contractual, or operational. They rarely surface unless you ask for them by name.',
              inputs: ['Candidate list', 'Commercial context'], who: 'Product lead', participants: ['Commercial stakeholders'],
              what: 'Candidates classified as Business.',
              how: ['Ask: does this constrain who gets it, what it costs, or what the business must be able to do or report?', 'Mark those Business.', 'Check pricing, plan availability, contractual obligations and internal reporting needs explicitly — each is a common source.'],
              example: { label: 'Atlas', list: [E.requirements[7].text + ' — REQ-08', E.requirements[8].text + ' — REQ-09'], note: 'REQ-09 exists because a success criterion needed measuring. Measurement requirements are business requirements, and they are almost always found late unless asked for here.' },
              mistakes: ['Assuming availability across plans rather than deciding it.', 'Treating measurement as "analytics will sort it out".'],
              output: 'Business requirements', evidence: 'Plan and pricing position stated explicitly',
              where: 'Requirement set', ifFailed: 'If nobody can say which plans get this, find the person who can. Do not guess.'
            },
            {
              n: 6, title: 'Identify UX requirements',
              why: 'UX requirements state what the experience must achieve. They are not design decisions — they are the conditions a design must satisfy.',
              inputs: ['Candidate list', 'Desired outcome'], who: 'Design lead', participants: ['Product lead', 'A user'],
              what: 'Candidates classified as UX.',
              how: ['Ask: does this describe what the person must be able to perceive, understand or do, rather than what the system computes?', 'Mark those UX.', 'Include accessibility conditions here — they are requirements, not polish.', 'Keep them solution-free: "distinguishable without relying on colour alone", not "use a triangle icon".'],
              example: { label: 'Atlas', list: [E.requirements[3].text + ' — REQ-04', E.requirements[4].text + ' — REQ-05'], note: 'REQ-04 contains its accessibility condition inside the requirement. That is why AC-6 on STORY-114 tests shape and label, not just colour — the requirement forced it.' },
              mistakes: ['Writing the design instead of the requirement.', 'Leaving accessibility to a later review, where it becomes rework rather than a condition.'],
              output: 'UX requirements', evidence: 'Each is satisfiable by more than one design',
              where: 'Requirement set', ifFailed: 'If only one design could satisfy it, you have written a design. Restate the condition it must meet.'
            },
            {
              n: 7, title: 'Identify Non-functional requirements',
              why: 'NFRs state how well the system must behave. Missed here, they surface as production incidents.',
              inputs: ['Candidate list', 'Constraints', 'Current system characteristics'], who: 'Engineering lead', participants: ['Ops', 'Security', 'QA'],
              what: 'Candidates classified as Non-functional, each with a number.',
              how: [
                'Walk the categories: performance, scale, availability, security, privacy, data freshness, accessibility, operability.',
                'For each, ask whether this objective imposes a condition.',
                'Give every NFR a number and a boundary condition — "within 1.5s at p95 at 2,000 deliverables", not "fast".',
                'Check each against the Initiative constraints. A constraint often generates an NFR directly.'
              ],
              example: { label: 'Atlas', list: [E.requirements[5].text + ' — REQ-06', E.requirements[6].text + ' — REQ-07', E.requirements[9].text + ' — REQ-10'], note: 'REQ-07 came straight from the 90-second replica lag constraint recorded in Discover. Constraints found early become requirements here and decisions in Design.' },
              mistakes: ['NFRs without numbers, which cannot pass or fail.', 'Treating permission and privacy as "obvious" and never writing them down.'],
              output: 'Non-functional requirements', evidence: 'Every NFR has a number and a condition',
              where: 'Requirement set', ifFailed: 'An NFR you cannot measure is a wish. Give it a number or delete it.'
            },
            {
              n: 8, title: 'Identify constraints that are not requirements',
              why: 'Constraints limit solutions; requirements state what must be true. Confusing them either over-constrains design or loses the limit entirely.',
              inputs: ['Initiative constraints', 'Requirement set'], who: 'Engineering lead', participants: ['Product lead'],
              what: 'A clean separation.',
              how: ['For each constraint ask: is this something the system must do, or something that limits how we may do it?', 'If it limits how, it stays a constraint.', 'If it states a condition the system must meet, promote it to an NFR.', 'Record which requirements each constraint bears on.'],
              example: { label: 'Atlas', before: 'Constraint: ADR-006 forbids cross-module direct table reads.', after: 'Stays a constraint — it does not say what the system must do, it rules out a way of doing it. It later eliminates one of three options in ADR-014.' },
              mistakes: ['Turning every constraint into a requirement, which makes the requirement set unreadable.'],
              output: 'Separated constraints and NFRs', evidence: 'Each constraint linked to the requirements it bears on',
              where: 'Requirement set', ifFailed: 'If you cannot tell which it is, ask whether a test could pass or fail on it. Requirements can be tested; constraints cannot.'
            },
            {
              n: 9, title: 'Remove duplicates and merge',
              why: 'Duplicate requirements produce duplicate Stories, duplicate tests, and contradictory acceptance.',
              inputs: ['Full requirement set'], who: 'Product lead', participants: ['Team'],
              what: 'A deduplicated set.',
              how: ['Sort by outcome.', 'Within each outcome, look for requirements that would be satisfied by the same behaviour.', 'Merge only where truly identical; keep separate where the tests would differ.', 'Renumber and record what was merged.'],
              example: { label: 'Atlas', before: 'Two candidates: "PM sees late items" and "PM sees items about to be late".', after: 'Kept separate. They have different rules (REQ-02 and REQ-03) and different tests, and merging them would have hidden the 3-working-day boundary that later produced the public-holiday defect.' },
              mistakes: ['Over-merging to make the list look shorter, which hides distinct behaviour.'],
              output: 'Deduplicated requirement set', evidence: 'Merge decisions recorded',
              where: 'Requirement set', ifFailed: 'If merging loses a test, do not merge.'
            },
            {
              n: 10, title: 'Relate requirements to Stories',
              why: 'Traceability is what lets you answer, at release time, whether what you shipped satisfies what was required.',
              inputs: ['Requirement set', 'Draft Stories from decomposition'], who: 'Product lead', participants: ['Team'],
              what: 'Each requirement linked to the Stories that satisfy it.',
              how: ['For each requirement, name the Stories that will satisfy it.', 'A requirement with no Story is either out of scope or a gap — decide which.', 'A Story satisfying no requirement is scope creep — delete it or find its requirement.', 'Record links in both directions.'],
              example: { label: 'Atlas', before: 'REQ-08 (available on all paid plans) had no Story.', after: 'Correct. It is satisfied by not building a plan gate — a configuration position, recorded on the requirement, with no Story needed. That decision is itself the evidence.' },
              mistakes: ['Leaving requirements unlinked and discovering at release that nothing satisfied them.', 'Creating a Story to satisfy a requirement that needs a decision, not work.'],
              output: 'Traced requirement set', evidence: 'Every requirement either linked to Stories or explicitly resolved',
              where: 'Work management system', ifFailed: 'An unlinked requirement at the Ready Gate is a fail. Resolve it here, where it is cheap.'
            }
          ]},
          { type: 'requirements' },
          { type: 'checklist', id: 'cl-refine-req', title: 'Requirement discovery — procedural checklist', items: [
            'Objective read aloud and ambiguities resolved',
            'Distinct required outcomes listed',
            'Every success criterion maps to an outcome',
            '"What must be true?" asked for every outcome',
            'The negative question asked: what must never happen?',
            'Permission and privacy questions asked explicitly',
            'Functional requirements identified, one behaviour each',
            'Business requirements identified, including plan availability and measurement',
            'UX requirements identified, including accessibility conditions',
            'Non-functional requirements identified, each with a number',
            'Constraints separated from requirements',
            'Duplicates merged only where the tests are identical',
            'Every requirement traced to Stories or explicitly resolved',
            'Every Story traceable to at least one requirement'
          ]}
        ]
      },
      {
        id: 's3', title: 'Classify them yourself', kicker: 'Practice',
        lede: 'Four categories. Every answer is explained, including the ones that are arguable.',
        blocks: [
          { type: 'callout', variant: 'principle', label: 'Say it again', text: 'Functional, Business, UX and Non-functional are requirement categories. They are not hierarchy levels. You do not create an "NFR Epic" — you write the NFR and trace it to the Stories that satisfy it.' },
          { type: 'exercise', kind: 'classify', id: 'ex-04-classify',
            prompt: 'Classify each requirement.',
            buckets: [
              { id: 'functional', label: 'Functional' },
              { id: 'business', label: 'Business' },
              { id: 'ux', label: 'UX' },
              { id: 'nfr', label: 'Non-functional' }
            ],
            items: [
              { text: 'A deliverable is classified as Late when its due date has passed and its status is not Complete.', answer: 'functional', explain: 'Functional — it describes behaviour the system performs. Note it states a rule, not an implementation. It does not say where the classification is computed, which is what leaves ADR-014 free to decide that later.' },
              { text: 'The at-risk view renders within 1.5 seconds at p95 for an account with 2,000 active deliverables.', answer: 'nfr', explain: 'Non-functional — how well, not what. It has a number, a percentile and a scale condition, which is the minimum for an NFR that can actually pass or fail.' },
              { text: 'The capability is available on all paid plans with no separate charge.', answer: 'business', explain: 'Business — it constrains who gets it commercially. It generates no Story: it is satisfied by deciding not to build a plan gate, and that decision is recorded on the requirement.' },
              { text: 'A project manager can distinguish Late from At risk without relying on colour alone.', answer: 'ux', explain: 'UX — it states what the person must be able to perceive. Accessibility conditions belong inside UX requirements, not in a later review. This one directly produced AC-6 on STORY-114.' },
              { text: 'A project manager only sees deliverables from projects they are a member of or follow.', answer: 'nfr', explain: 'Non-functional — this is a security and privacy condition. It is arguable: some teams file permission rules as Functional because the system performs a check. What matters is that it is written down and traced; here it is classified NFR because it is a property that must hold across all behaviour, not a behaviour in itself.' },
              { text: 'Atlas can report, per account, how often a flagged risk preceded a missed deliverable.', answer: 'business', explain: 'Business — the business needs to be able to report it, in order to evaluate the Initiative. It became STORY-118. If step 5 had been skipped, this would have been discovered after release, when it is too late to establish a baseline.' },
              { text: 'From the at-risk view, a project manager can reach the deliverable in one action.', answer: 'ux', explain: 'UX — it constrains the interaction cost, not the computation. "One action" is testable and satisfiable by several designs, which is what a good UX requirement looks like.' },
              { text: 'Risk classification reflects data no more than 60 seconds old and is never served from the reporting replica.', answer: 'nfr', explain: 'Non-functional — a data-freshness condition with a number. Its second clause came from a constraint found in Discover, and it is the single requirement that decided ADR-014.' }
            ]
          }
        ]
      },
      {
        id: 's4', title: 'What we now have', kicker: 'Continue',
        blocks: [
          { type: 'transform', data: {
            before: 'INIT-42: an objective, an outcome, success criteria, a boundary and constraints.',
            now: 'Eleven requirements, classified, each traceable to an outcome.',
            connects: 'Each requirement now needs two questions answered: can the architecture support it, and can we prove it works?',
            next: 'Chapter 05 — Architecture Impact.'
          }}
        ]
      }
    ]
  };

  /* ---------------------------------------------------------
     05 — ARCHITECTURE IMPACT
     --------------------------------------------------------- */

  const ch05 = {
    id: 'ch05', num: 5, title: 'Architecture Impact',
    kicker: 'Lifecycle · 03',
    question: 'Can the existing system support this change?',
    stage: 'design', scaffold: 'moderate',
    intro: 'The Architecture Impact Check is Always. System Design is When needed. ADR is When a significant decision exists. This chapter is how the first decides the other two.',
    sections: [
      {
        id: 's1', title: 'Why a check and not a document', kicker: 'Understand',
        blocks: [
          { type: 'prose', p: [
            'Two failure modes bracket this stage. A team that designs everything produces documents nobody reads and delays the work that actually needed design. A team that designs nothing discovers the architecture during implementation, which is the most expensive place to discover it.',
            'The check resolves both. It is cheap, it runs on every requirement that could touch the system, and it produces one of three recorded outcomes. Only two of those outcomes produce a document.'
          ]},
          { type: 'flow', dir: 'col', nodes: [
            { t: 'Requirement' },
            { t: 'Architecture Impact Check', s: 'Always — eight checks', accent: true },
            { t: 'No impact · Contained impact · Structural impact' },
            { t: 'System Design', s: 'Only where impact exists' },
            { t: 'ADR', s: 'Only where a significant decision exists' }
          ]},
          { type: 'opmodel', data: {
            inputs: 'A requirement. The current architecture view. Existing ADRs. The Initiative constraints.',
            actions: 'Walk the eight checks, determine the outcome, decide what design work follows.',
            output: 'A recorded impact outcome naming the triggering check.',
            evidence: 'The outcome recorded on the requirement or Story, with the check that triggered it named.',
            owner: 'Engineering lead',
            participants: 'Module owners, security, ops where relevant',
            decision: 'Engineering lead',
            sor: 'Work management system, on the requirement or Story',
            next: 'No impact → Ready. Contained or Structural → Design, then Ready.'
          }}
        ]
      },
      {
        id: 's2', title: 'The ten steps', kicker: 'Follow',
        blocks: [
          { type: 'steplist', title: 'Architecture Impact Check', items: [
            { n: 1, t: 'Read the requirement', d: 'Read exactly what it says, not what you expect it to mean. Most false "no impact" answers come from answering a simpler requirement than the one written.' },
            { n: 2, t: 'Check existing architecture', d: 'Does a component already own this behaviour and this data? If yes, and it can do it as it stands, this check is clean.' },
            { n: 3, t: 'Check data boundaries', d: 'Which module owns the data? Does anything outside that module now need it? Crossing an ownership boundary is impact, even when the change looks small.' },
            { n: 4, t: 'Check APIs and integrations', d: 'Is a published contract changing, or does a new one need to exist? A new interface is always at least contained impact.' },
            { n: 5, t: 'Check security and trust boundaries', d: 'Does this expose data across a boundary, or require a permission decision in a new place? Re-implementing an existing rule in a second location is a finding, not a detail.' },
            { n: 6, t: 'Check performance and scale', d: 'What is the query or call shape at the top of the supported range? Compare against the NFR. "It works on my data" is not an answer.' },
            { n: 7, t: 'Check deployment and operations', d: 'New deployable unit, new dependency, new failure mode, new metric or alert? Operability changes are impact.' },
            { n: 8, t: 'Check existing ADRs', d: 'Does an accepted decision forbid the obvious approach? This is the check most often skipped and the one that most often invalidates work already started.' },
            { n: 9, t: 'Determine the impact', d: 'No impact: fits as-is on all eight. Contained: new interface, new query shape, or a local change within one module. Structural: new component, new integration, or a change to how the system is shaped.' },
            { n: 10, t: 'Decide what design work follows', d: 'No impact → record and continue. Contained → System Design scoped to the change. Structural → System Design before any Story is made Ready. Then ask whether a significant decision with alternatives was made; if so, write an ADR.' }
          ]},
          { type: 'archimpact' },
          { type: 'callout', variant: 'note', label: 'Read check 8 again', text: 'ADR-006 forbade the shortcut. Without check 8, the team would have had the Workspace module read Delivery tables directly — it is the obvious, fastest implementation — and would have found out at review, after the work was done.' }
        ]
      },
      {
        id: 's3', title: 'Reason it out first', kicker: 'Practice',
        lede: 'Three scenarios. Decide before you reveal. Getting these wrong here is free.',
        blocks: [
          { type: 'exercise', kind: 'choice', id: 'ex-05-sc1',
            prompt: 'What is the impact outcome?',
            scenario: 'REQ: "A project manager can filter the at-risk list to a single project." The at-risk list already exists and is served by the interface built in STORY-114. Filtering would be applied to results the interface already returns, within the Workspace module, using data it already has in hand.',
            options: [
              { text: 'No impact', correct: true, explain: 'Correct. Walk the eight: no new component, no data crossing an ownership boundary, no contract change, no permission decision in a new place, no change to the query shape at scale, no operational change, no ADR conflict. Record the outcome as No impact and name the checks you ran — then go to Ready. No design document.' },
              { text: 'Contained impact — it changes the interface', correct: false, explain: 'It does not. The filter is applied to results already returned, inside the consuming module. If the filter had needed to push down into the query for performance reasons, check 6 would have triggered and this answer would become right — which is why check 6 is worth running even when the change looks trivial.' },
              { text: 'Structural impact', correct: false, explain: 'Nothing here changes how the system is shaped. Reserve Structural for new components, new integrations, or a change to the system\'s structure.' },
              { text: 'Cannot tell without a System Design', correct: false, explain: 'Backwards. The check decides whether a design is needed. If you need a design to run the check, you are doing the design first, which is the bureaucracy this stage exists to prevent.' }
            ]
          },
          { type: 'exercise', kind: 'choice', id: 'ex-05-sc2',
            prompt: 'What is the impact outcome?',
            scenario: 'REQ: "Atlas emails a project manager a daily digest of their at-risk deliverables at 07:00 in their local time zone." Atlas has a notifications service that sends transactional email. It has never sent scheduled batch email. There is no per-user time zone stored on the member record — only an account-level default.',
            options: [
              { text: 'No impact — we already send email', correct: false, explain: 'The most common false negative. "We already do something similar" answers check 2 and stops. Checks 3 (a per-user time zone does not exist), 7 (scheduled batch is a new operational pattern with new failure modes) and 6 (fan-out at account scale) all trigger.' },
              { text: 'Contained impact — just add a scheduler', correct: false, explain: 'Closer, but it understates it. A new scheduled batch pattern, a new data field with a migration and a backfill, and a new operational failure mode is not local to one module\'s existing behaviour. Calling it contained means designing it as a small change, which is how scheduled-email systems become incident sources.' },
              { text: 'Structural impact — new operational pattern, new data ownership question, new failure modes', correct: true, explain: 'Correct. Scheduled batch is a genuinely new capability with its own failure modes — partial sends, retries, duplicate suppression, backfill on deploy. The time zone field raises an ownership question. This needs a System Design before any Story is made Ready, and probably an ADR on where scheduling lives.' },
              { text: 'No impact, but write an ADR', correct: false, explain: 'Incoherent. An ADR records a significant architectural decision; if there is genuinely no impact, there is no decision to record. This combination usually means the check was not actually run.' }
            ]
          },
          { type: 'exercise', kind: 'choice', id: 'ex-05-sc3',
            prompt: 'What is the impact outcome?',
            scenario: 'REQ: "The at-risk classification treats public holidays as non-working days when counting the 3-working-day window." Working-day arithmetic already exists in the Delivery module for milestone scheduling, and it already consults a holiday calendar table owned by the same module. The at-risk classification currently uses a simpler calendar-day count.',
            options: [
              { text: 'No impact — the logic and the data already exist in the right module', correct: true, explain: 'Correct, and this is the case teams most often over-engineer. All eight checks come back clean: same module, same data owner, no contract change, no permission change, no meaningful change to the query shape, no operational change, no ADR conflict. Record No impact and go to Ready. It still needs a Story with its own acceptance — "no architecture impact" never means "no work".' },
              { text: 'Contained impact — the classification rule is changing', correct: false, explain: 'A behaviour change is not by itself architecture impact. Impact is about structure, boundaries, contracts, scale and operability. If every behaviour change counted as impact, the check would produce a design document for everything, which is exactly the failure mode it exists to prevent.' },
              { text: 'Structural impact — calendars are cross-cutting', correct: false, explain: 'They would be if the calendar were owned elsewhere or needed to be. Here it is owned by the same module that does the classification. Check 3 comes back clean.' },
              { text: 'Contained impact, and it needs an ADR', correct: false, explain: 'No alternatives with lasting consequences are being chosen between — the existing helper is used. Following an existing standard is not a decision.' }
            ]
          }
        ]
      },
      {
        id: 's4', title: 'Decision rules', kicker: 'Judgement',
        lede: 'Work each tree. The point is the reasoning on the way down, not the answer at the bottom.',
        blocks: [
          { type: 'dtree', ruleId: 'dr-design' },
          { type: 'dtree', ruleId: 'dr-adr' }
        ]
      },
      {
        id: 's5', title: 'What impact produced here', kicker: 'See',
        blocks: [
          { type: 'artifactcard', data: {
            kind: 'System Design', id: E.systemDesign.id, name: E.systemDesign.name,
            rows: [
              { k: 'The change', v: E.systemDesign.change },
              { k: 'Components', v: { list: E.systemDesign.components } },
              { k: 'Data', v: E.systemDesign.data },
              { k: 'Contracts', v: E.systemDesign.contracts },
              { k: 'Failure modes', v: { list: E.systemDesign.failureModes } },
              { k: 'Rollout', v: E.systemDesign.rollout },
              { k: 'Operations', v: E.systemDesign.ops }
            ],
            foot: [{ k: 'Owner', v: E.systemDesign.owner }, { k: 'System of record', v: 'Engineering documentation space' }, { k: 'Triggered by', v: 'AIC-42 — contained impact' }]
          }},
          { type: 'artifactcard', data: {
            kind: 'ADR', id: E.adr.id, name: E.adr.name,
            rows: [
              { k: 'Status', v: E.adr.status },
              { k: 'Context', v: E.adr.context },
              { k: 'Decision', v: E.adr.decision },
              { k: 'Alternatives', v: { pairs: E.adr.alternatives.map(function (a) { return { k: a.opt, v: a.why }; }) } },
              { k: 'Consequences', v: { list: E.adr.consequences } }
            ],
            foot: [{ k: 'Owner', v: E.adr.owner }, { k: 'System of record', v: 'ADR log' }, { k: 'Immutable', v: 'Superseded, never edited' }]
          }},
          { type: 'callout', variant: 'principle', label: 'Why this ADR earns its place', text: 'Three options existed, each with different long-term consequences, and the chosen one is expensive to reverse — it constrains how cheap future risk rules must be. That is the significance test passing. Note the consequences list contains the bad ones.' },
          { type: 'transform', data: {
            before: 'Eleven requirements, unchecked.',
            now: 'An impact outcome, a System Design scoped to the change, and one ADR.',
            connects: 'Every Story that touches the risk interface now has a resolved architecture position — which is a Ready Gate condition.',
            next: 'Chapter 06 — Decompose.'
          }}
        ]
      }
    ]
  };

  return [ch01, ch02, ch03, ch04, ch05];
})();
