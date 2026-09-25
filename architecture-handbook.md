# Architecture &amp; System Design Handbook

> **A practical, production-grade guide for understanding a problem, establishing architecture,
> making architectural decisions, designing systems, documenting the result, reviewing it through
> multiple lenses, and evolving it safely over time.**

This is the standalone text edition. The interactive edition is `architecture-handbook.html` —
same content, with interactive diagrams, explorers, simulations and checklists. Both are
self-contained: no network, no dependencies, no tracking.

---

## How to use this handbook

Start with **“I have a new project”**, follow the book in order, and finish with a defensible
architecture, a system design, documented decisions, diagrams, standards and review evidence.
Then use Part XIII to evolve that architecture safely.

If you have an **existing system**, start at Chapter 2 (the two entry modes), then go to Part XIII
and borrow from Parts IX and X as the change requires.

Every stage teaches four things, and that pattern is non-negotiable:

| | |
|---|---|
| **Understand** | what it is and why it exists |
| **Do** | step-by-step instructions |
| **Produce** | a real artifact |
| **Check** | a gate with objective criteria |

---

## The central model

```text
                         PROBLEM
                            │
                            ▼
                      REQUIREMENTS
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ARCHITECTURAL DRIVERS         CONSTRAINTS
              │                           │
              └─────────────┬─────────────┘
                            ▼
                  ARCHITECTURAL PRINCIPLES
                            │
                            ▼
                    ARCHITECTURE LENSES
                            │
                            ▼
                  ARCHITECTURAL OPTIONS
                            │
                            ▼
                  DECISIONS & TRADE-OFFS
                            │
                            ▼
                 ARCHITECTURE BASELINE
                            │
                            ▼
                     SYSTEM DESIGN
                            │
                            ▼
                     IMPLEMENTATION
                            │
                            ▼
                      VALIDATION
                            │
                            ▼
                       EVOLUTION
                            │
                            └───────────────┐
                                            ▼
                                  ARCHITECTURE IMPACT
                                            │
                                            └──→ DECISION
```

And underneath the whole thing:

```text
PRINCIPLES
    ↓
STANDARDS
    ↓
PATTERNS
    ↓
GUARDRAILS
    ↓
AUTOMATED VALIDATION
```

## The operating loop

```text
 1. UNDERSTAND   Problem • Product • Requirements • Context
 2. FRAME        Drivers • Constraints • Assumptions
 3. REASON       Principles • Lenses • Risks • Trade-offs
 4. SHAPE        Boundaries • Components • Relationships
 5. DECIDE       Options • Evidence • ADRs • Consequences
 6. BASELINE     Architecture + documentation + decisions
 7. DESIGN       APIs • Data • Workflows • Runtime • Security
 8. REVIEW       Requirements • Principles • Lenses • Risk
 9. BUILD        Implementation + architectural guardrails
10. EVOLVE       Impact → Decision → Design → Update
                 ↺
```

## The worked example, used throughout

**Farm Commerce Platform.** A regional cooperative of 40 farms sells boxes and single items
directly to households, with weekly delivery windows.

| Actor | Needs |
|---|---|
| Customer | Subscribe to a weekly box, adjust it until the Thursday cut-off, pay, receive delivery |
| Farm staff | Publish weekly availability, confirm actual harvest Friday morning, print pick lists |
| Administrator | Manage catalogue, delivery zones, pricing rules, refunds |
| Payment provider *(external)* | Hosted card fields, authorisation, capture, webhooks |
| Delivery partner *(external)* | Accepts a route file at 06:00, returns status hourly — batch only |

Everything difficult about this system lives in one gap: **the basket is final at Thursday 18:00,
the harvest is known at Friday 06:00, and money moves in between.**

---

## Contents

- **Part I — Foundations** · 1 What Is Architecture? · 2 The Architecture Lifecycle · 3 Architectural Thinking
- **Part II — The Architecture Model** · 4 Depth Is Not the Whole Architecture · 5 Architecture Depth — L0 to L4 · 6 The Architecture Views · 7 Depth × Views · 8 Runtime & Behavioural Architecture
- **Part III — Architecture in Practice** · 9 Architectural Patterns in Practice · 10 The Module Architecture Contract · 11 The Architecture Artifact Map · 12 The Capability Architecture Loop · 13 Architecture Completeness · 14 The Architecture Process
- **Part IV — Drivers** · 15 Understanding the Problem · 16 Architectural Drivers · 17 Constraints, Assumptions & Unknowns
- **Part V — Universal Architecture Principles** · 18 Principles of Good Architecture · 19 Applying Principles Without Becoming Dogmatic
- **Part VI — Architecture Lenses** · 20 The Lens Model · 21 Engineering · 22 Product & Business · 23 UX · 24 Developer Experience · 25 Security · 26 Data · 27 Reliability · 28 Performance · 29 Operations · 30 Cost, Compliance & Accessibility · 31 Cross-Lens Review
- **Part VII — From Principles to Standards** · 32 Principles → Standards · 33 Architecture Standards · 34 Patterns & Reference Architectures
- **Part VIII — Architecture Initialization** · 35 Starting a New Project · 36 Establishing System Context · 37 Establishing the Initial Architecture · 38 Architecture Baseline · 39 Architecture Baseline Gate
- **Part IX — Architectural Decision-Making** · 40 What Is an Architectural Decision? · 41 Decision Framework · 42 Architecture Decision Records · 43 Evidence, Experiments & Spikes
- **Part X — System Design** · 44 From Architecture to System Design · 45 Designing Components · 46 API & Contract Design · 47 Data Design · 48 Workflow & Sequence Design · 49 State & Event Design · 50 Security Design · 51 Runtime & Deployment Design
- **Part XI — Architecture Documentation** · 52 Documentation as a System · 53 Document Types · 54 How to Write Architecture Documents · 55 Diagramming · 56 How to Draft a Diagram · 57 Diagram Quality
- **Part XII — Architecture Review** · 58 Reviewing Architecture · 59 Review Checklist · 60 Architecture Gates
- **Part XIII — Architecture Evolution** · 61 Architecture Impact · 62 Architecture Debt · 63 Evolving the Baseline
- **Part XIV — Complete Worked Example** · 64 Farm Commerce Platform, End to End
- **Part XV — The Practitioner Toolkit** · 65 Templates · 66 Checklists · 67 Reference

---
---

# PART I — FOUNDATIONS

*Before technique, a mental model. What architecture is, where it sits in the life of a system,
and how architects reason.*

---

## Chapter 1 — What Is Architecture?

> Architecture is the set of structural decisions that are expensive to reverse — plus the
> reasoning that justifies them.

**Why this matters.** Almost every unproductive architecture argument is really a disagreement
about what the word means. Fix the vocabulary first.

### The three altitudes

```text
Architecture
    ↓
What the system is shaped like
and why

System Design
    ↓
How a particular capability
actually works

Implementation
    ↓
How the design becomes code
```

Software architecture is the set of **structures** of a system, the **relationships** between
them, the **decisions** that produced them, and the **constraints** those decisions impose on
everything built afterwards.

Two properties separate an architectural decision from an ordinary one. It is *structural* — it
shapes what other decisions are possible. And it is *consequential* — reversing it costs far more
than making it. A naming convention is neither. Choosing to make the catalogue an independently
deployable service is both.

> **Working definition.** Architecture is what you would have to explain to someone before they
> could safely change the system — and what would be expensive to change if they got it wrong.

### What architecture is not

**Not a technology list.** “React, Postgres, Kubernetes” is a set of choices, not an architecture.
It says nothing about boundaries, ownership, data flow or failure. Two systems with identical
technology lists can have completely different architectures — and different costs of change.

**Not a diagram.** A diagram is a *representation* of architecture, as a map is of terrain. A
system has architecture whether or not anyone has drawn it. Undrawn architecture is simply
architecture nobody can review.

**Not documentation.** Documentation is the maintained record of architectural knowledge. It is
essential, and it is not the thing itself. A beautiful document describing a system that no longer
exists is worse than nothing, because it is trusted.

**Not the implementation.** Code is the ground truth of behaviour but under-determines intent. Code
shows that the domain imports the database driver. It does not tell you whether that was a
decision, an accident, or a violation.

**Not a phase that ends.** Architecture is established early, then deliberately evolved.

**Not a job title.** Architecture is produced by whoever makes consequential structural decisions —
on most teams, several engineers, continuously. What matters is whether the decisions are visible.

### Architecture, design, implementation

| | Architecture | System Design | Implementation |
|---|---|---|---|
| Question | What is the system shaped like, and why? | How does this capability actually work? | How does this design become code? |
| Scope | Whole system and its context | One capability or workflow | One component or function |
| Output | Context/container views, drivers, ADRs, standards | Component interactions, API and data design, sequences | Source, tests, configuration |
| Cost of reversal | High — weeks to quarters | Medium — days to weeks | Low — hours to days |
| Changes when | Drivers, constraints or scale change | A capability changes | Continuously |

> **Why this distinction earns its keep.** It tells you how much evidence a decision deserves.
> Implementation choices can be made and remade cheaply. Architectural choices are expensive to
> reverse, so they deserve options, criteria and evidence before commitment.

### What good looks like

| Good | Weak |
|---|---|
| Boundaries can be named, and each has an owner | The architecture is “whatever the code does” |
| Significant decisions recorded with reasoning | Decisions remembered by whoever was in the room |
| Shape matches how the business describes itself | Structure mirrors an old org chart |
| Constraints and assumptions written down and dated | Assumptions have quietly become facts |
| Someone can explain why the system is not simpler | Complexity has no owner and no justification |

### Artifact — architecture vocabulary

| Term | Means | Does not mean |
|---|---|---|
| Architectural driver | A requirement or quality attribute that shapes structure | Any requirement |
| Constraint | Must be true; not negotiable by this team | Something we would prefer |
| Assumption | Believed true, not yet verified | A fact |
| Quality attribute | A measurable property (latency, availability, changeability) | A vague aspiration |
| Boundary | A named edge where responsibility, trust or ownership changes | A folder |
| Component | A unit with a responsibility and an interface | A class |
| Container | An independently deployable or runnable unit | A Docker image, necessarily |
| Decision | A commitment made among considered options | A preference stated confidently |
| Standard | A normative statement of what must be true | A pattern |
| Pattern | One proven way to satisfy a standard | A requirement |
| Guardrail | A mechanism that makes a rule cheap to follow | A code review comment |
| Baseline | The current agreed architectural model | A one-off document |

### ✓ Checkpoint

- Define architecture without naming a single technology
- Distinguish architecture, system design and implementation by question and cost of reversal
- Explain why a diagram is a representation and not the architecture
- Use the vocabulary table to settle a definitional argument in a review

**Related:** Ch. 2 Lifecycle · Ch. 3 Architectural Thinking · Ch. 16 Drivers · Ch. 40 Decisions · Ch. 52 Documentation

---

## Chapter 2 — The Architecture Lifecycle

> **The activity list and the loop.** The lifecycle below describes the *stages* of
> architecture work. Chapter 14 states the same work as seventeen activities and a
> nine-station loop — Understand, Model, Decide, Design, Validate, Baseline, Implement,
> Observe, Evolve — which is the form to reach for when someone wants architecture
> scheduled as a phase.

> Architecture has two entry points: you are establishing one, or you are assessing the impact of
> a change on one. Everything in this book hangs off that distinction.

**Why this matters.** Teams get lost because they use new-system techniques on existing systems,
and existing-system habits on new ones.

```text
NEW PROJECT
    ↓
Architecture Initialization
    ↓
Architecture Baseline  ←───────────────┐
    ↓                                  │
System Design                          │
    ↓                                  │
Implementation                         │
    ↓                                  │
Change                                 │
    ↓                                  │
Architecture Impact Assessment         │
    ↓                                  │
Architecture Evolution ────────────────┘
    ↓
Updated Baseline
```

The loop matters more than the list. A baseline is established once and updated many times. Every
change is asked one question — *does this affect the architecture?* — and the answer routes the work.

### Two entry modes

**A — New system → establish architecture.** No baseline exists. Understand the problem, identify
drivers and constraints, choose principles, shape boundaries, decide the consequential questions,
record enough that delivery can start safely.
*Route:* Parts IV → VIII → IX, then the baseline gate in Chapter 39.

**B — Existing system → assess architectural impact.** A baseline exists, explicitly or implicitly.
Determine whether a proposed change alters structure, boundaries, ownership, trust or quality
attributes — and if so, run a scoped version of the same process.
*Route:* Part XIII, borrowing from Parts IX and X as needed.

> **The most common lifecycle error.** Treating every change as mode A (re-architecting on every
> ticket), or as neither (no impact assessment at all, until the boundary has quietly disappeared).

### What happens at each stage

| Stage | You produce | You stop when |
|---|---|---|
| Initialization | Input brief, drivers, constraints, candidate principles, relevant lenses | The problem is understood well enough to shape a boundary |
| Baseline | Context, major structure, decisions, assumptions, open questions | The baseline gate passes (Ch. 39) |
| System design | Component, API, data, workflow, security, runtime design | A team can implement without inventing architecture |
| Implementation | Working software plus guardrails | The capability works and the guardrails hold |
| Change | A proposal, and an impact answer | You know whether architecture is affected |
| Evolution | New decisions, revised structure, updated baseline | The baseline again describes reality |

Notice what is *not* a stage: “draw the diagrams” or “write the ADRs”. Those artifacts are produced
throughout, as tools of the process — never as the process itself.

### ✓ Checkpoint

- Identify which entry mode a piece of work belongs to
- Describe the loop from baseline through change back to baseline
- Explain why architecture is not a phase that finishes

---

## Chapter 3 — Architectural Thinking

> Architecture is not choosing technologies. Architecture is making consequential structural
> decisions under constraints.

**Why this matters.** Technique without reasoning produces confident, well-documented, expensive
mistakes.

### Eleven habits

1. **Problem before solution.** The first question is never “should we use a queue?” It is “what problem are we solving, for whom, and what makes it hard?”
2. **Evidence before preference.** Experience is a prior, not a proof. Weight of evidence scales with consequence and uncertainty.
3. **Constraints before technology.** Constraints eliminate options for free. Find them first.
4. **Explicit assumptions.** Write them down, date them, label them. Undated assumptions become facts within a quarter.
5. **Trade-offs, not wins.** If you cannot name what a decision costs, you have finished advocating, not analysing.
6. **Consequences over elegance.** What does this make easy, hard, and impossible?
7. **Uncertainty is a first-class input.** Say “we do not know”, then decide how much it matters.
8. **Reversibility.** Classify: reversible, expensive to reverse, effectively permanent. Spend evidence accordingly.
9. **Cost of decisions.** Build, operate, learn, staff, migrate. A design cheap to build and expensive to operate is a loan against a team that never agreed to take it.
10. **Local versus systemic optimisation.** A change that makes one team faster and three slower is a loss.
11. **Avoid premature detail.** Detail produced before the shape is settled fabricates confidence you have not earned.

> **Common failure — the solution that arrived first.**
> ❌ Choosing the structure in the first meeting, then gathering requirements that support it.
> *Why it fails:* every later piece of evidence is evaluated against the commitment instead of the
> problem. The tell is that the risks named in review are always risks of *not* doing the chosen thing.

### The consequence drill

```text
This makes EASY       ......................
This makes HARD       ......................
This makes IMPOSSIBLE ......................
To reverse this we would have to ..........
```

If the last line reads “rewrite the system”, you are looking at an architectural decision and it
needs a record (Chapter 42).

### ✓ Checkpoint

- State a problem without implying a solution
- Separate a constraint from an assumption from a preference
- Classify a decision by reversibility and choose evidence accordingly
- Name what a favoured design makes hard

---
---

# PART II — THE ARCHITECTURE MODEL

*L0 to L4 describe how deeply we have described the system. They do not describe every dimension of it. This part separates depth from view, and makes runtime behaviour a first-class part of the architecture rather than a diagram someone drew once.*

---

## Chapter 4 — Depth Is Not the Whole Architecture

> L0 to L4 is one axis — structural decomposition. Architecture also has behaviour, patterns, data, deployment, cross-cutting guarantees, decisions and evidence. Those are views, not deeper levels.

**Why this matters.** Teams that treat L0-L4 as the complete model produce architectures that are structurally accurate and behaviourally unknown. They can tell you every module and not one failure path.

A team finishes L4. Every module is named, every folder is placed, the dependency rule is enforced in CI. Then the first incident arrives and nobody can say what happens when the outbox relay dies halfway through a drain.

Nothing was done wrong. The structural model was complete. The problem is that structure was mistaken for the whole architecture, and the levels invited the mistake: a numbered sequence ending at 4 looks finished at 4.

> **The correction.** **L0-L4 describe architectural depth — structural decomposition. They do not describe every dimension of architecture.** Depth answers *how finely have we decomposed this*. It never answers *how does it behave*, *what does it guarantee*, or *how do we know*.

The fix is not another level. There is no L5. Adding one would repeat the mistake in a more expensive form: behaviour is not a finer decomposition of structure, and deployment is not a finer decomposition of behaviour. They are *different questions about the same system*, and different questions belong on a different axis.

### The model

**Context** — What is the system, who uses it, what surrounds it?

**Structure** — What exists and how is it decomposed?
  - L0 Context
  - L1 Containers
  - L2 Components
  - L3 Detailed design
  - L4 Implementation design

**Behaviour / Runtime** — How does it behave when something actually happens?

**Architectural Patterns** — What established approach is being used, and at what cost?

**Data** — What data exists, who owns it, how does it move?

**Deployment / Infrastructure** — Where does it run?

**Cross-Cutting Concerns** — What guarantees and constraints apply across the whole system?
  - Security
  - Reliability
  - Performance
  - Scalability
  - Observability
  - Operations
  - UX / DX where relevant

**Decisions** — Why was it designed this way?

**Validation / Evidence** — How do we know the architecture actually satisfies its intent?

Read it this way. **Structure** is the only branch with levels, because structure is the only dimension that decomposes. Every other branch is a view: a complete perspective on the whole system, examined at whatever depth the risk justifies.

*What each dimension answers*

```text
Structure      "What exists and how is it decomposed?"
Behavior       "How does it behave at runtime?"
Patterns       "What established approach is being used?"
Data           "What data exists, who owns it, how does it move?"
Deployment     "Where does it run?"
Cross-cutting  "What guarantees apply across the system?"
Decisions      "Why was it designed this way?"
Validation     "How do we know it satisfies its intent?"
```

### Why the mistake is so easy to make

**Levels are numbered and views are not.** A numbered ladder implies completion at the top. A set of views implies a judgement about which ones matter, and judgement is harder than counting. Teams reach for the ladder.

**Structure is the easiest dimension to draw.** Boxes and lines are quick, look authoritative, and rarely provoke disagreement. A failure-flow diagram forces someone to admit what happens at 3am, which is a longer meeting.

**Tools model structure and nothing else.** Most diagramming tools have a component shape and no concept of a guarantee, a trust boundary or an idempotency requirement. What the tool cannot hold, the architecture tends not to contain.

**Structure survives review.** A reviewer can confirm a module list without knowing the domain. Confirming that the failure behaviour is right requires understanding what the business can tolerate — so reviews drift toward the part that is easy to check.

**What good looks like**

- Someone can say which views are deliberately shallow, and why
- Behaviour is described for the capabilities where it is not obvious
- Every cross-cutting guarantee has an owner
- The record says what is claimed and what is demonstrated
- Depth varies across the system in proportion to risk

**What weak looks like**

- A complete L2 and no failure behaviour anywhere
- Every module documented to the same depth regardless of consequence
- “The architecture” means the container diagram
- Security appears once, as a box labelled Auth
- Nobody can name what has been validated versus asserted

### What this does not change

- **L0-L4 stay exactly as they are.** They are the right model for structural depth and this part preserves them intact.
- **There is no L5.** Behaviour, patterns, deployment, data and decisions do not become another level.
- **Nothing becomes mandatory.** Views are dimensions you can examine, not documents you must produce.
- **The lifecycle is unchanged.** Discover, frame, shape, decide, design, document, review, evolve — the same loop, now with a clearer answer to “review *what*”.

> **The failure this prevents.** An architecture that is structurally complete and behaviourally unknown passes every review it is given, because reviewers are shown structure. It then fails in production along a dimension nobody examined. The most expensive incidents are almost never caused by the wrong module boundary; they are caused by an unexamined failure path, an unowned guarantee, or a decision nobody recorded.

**You should now be able to**

- Explain why depth and views are different axes without reaching for an L5
- Name the eight dimensions and the question each answers
- Diagnose an architecture that is structurally complete and behaviourally unknown
- Decide which views deserve depth in a given system

*Related: Architecture Depth, L0 to L4 · The Architecture Views · Depth × Views · What Is Architecture? · Documentation as a System*

---

## Chapter 5 — Architecture Depth — L0 to L4

> Five levels of structural decomposition, each answering a different set of questions. L4 is implementation design, not a mandatory artifact for every part of the system.

**Why this matters.** Depth is the axis teams already understand. Stated precisely, it stops being a documentation quota and becomes a decision about where detail earns its cost.

Each level answers questions the level above cannot. Descending is not a formality; it is a commitment of effort that should be justified by uncertainty, complexity, consequence or risk.

#### L0 — Context

*The system as one box*

Answers:
- Who interacts with the system?
- What is inside and outside it?
- What external systems exist?
- What are the major boundaries?

**Artifacts.** System Context Diagram · External systems table · Explicit out-of-scope list

**Squid at this level.** Squid is one box. Around it: members, workspace admins, guests, the identity provider, object storage, the mail provider, the payment provider, the calendar providers. Task lives inside; e-mail delivery does not.

**When this level is enough.** L0 is enough when the argument is about scope, ownership or who is affected — not about how anything is built.

**What going no further costs.** Skipping L0 is how teams end up arguing about components while disagreeing about what the system is for.

#### L1 — Containers

*Major deployable or independently meaningful building blocks*

Answers:
- What runs as its own thing?
- Which of those can be deployed independently?
- What stores state?
- What talks to what, over which protocol?

**Artifacts.** Container diagram · Container responsibility table · Protocol and direction per edge

**Squid at this level.** Next.js app (SSR + route handlers + server actions), the worker fleet, the realtime service, MongoDB Atlas, Redis, object storage, Atlas Search. The Task module lives inside the Next.js app and the worker, not in a container of its own.

**When this level is enough.** L1 is enough when the question is deployment, scaling, failure isolation or operational ownership.

**What going no further costs.** Teams that stop at L1 ship a diagram of boxes nobody disagrees with and a codebase nobody can navigate.

#### L2 — Components

*What lives inside a container, and who owns what*

Answers:
- What major components exist inside each container?
- What responsibility does each own?
- How are responsibilities separated?
- Which components depend on which, and in which direction?

**Artifacts.** Component diagram per container · Module responsibility table · Dependency direction rules

**Squid at this level.** Inside the Next.js app: identity, workspace, work (Task), docs, search, notify, files, policy, gateway. Work depends on identity and policy; nothing depends on work except the notification consumers, and those consume events rather than calling in.

**When this level is enough.** L2 is enough when the question is ownership, coupling or where a change belongs.

**What going no further costs.** L2 without dependency direction is a folder listing with rounded corners.

#### L3 — Detailed system design

*How it actually works when something happens*

Answers:
- How does a request flow?
- What are the API contracts?
- What are the data models?
- How does state change?
- What happens when something fails?
- What security controls apply?
- What transactions and consistency rules exist?
- What workflows exist?

**Artifacts.** Sequence diagrams · API contracts · Data models · State diagrams · Workflow diagrams · Data-flow diagrams · Failure-flow diagrams

**Squid at this level.** Assign a task: server action → Zod → policy check → gateway with a version predicate → Mongo transaction writing task + outbox → worker drains outbox → notification fan-out. Conflict returns 409 and the client refetches. The AssignTask contract, the task document shape and the task state machine all belong here.

**When this level is enough.** L3 is required wherever behaviour is non-obvious, money or safety is involved, or the failure path is not the happy path with an error message bolted on.

**What going no further costs.** Skipping L3 is the single most common cause of "the architecture was fine, the system was not".

#### L4 — Implementation design

*Modules, schemas, interfaces, queries, configuration*

Answers:
- What modules, functions and interfaces exist?
- What schemas are used?
- What repositories and queries exist?
- What commands and events exist?
- What configuration is required?
- How are implementation boundaries enforced?

**Artifacts.** Module structure · Schema definitions · Interface signatures · Query and index list · Event catalogue · Dependency guardrail configuration

**Squid at this level.** src/modules/work/{db,domain,policy,actions,ui}, the task schema with { workspaceId, assigneeId, updatedAt } compound index, assignTask(cmd) returning Result, the TaskAssigned event shape, and the import rule in architecture/deps.json that fails CI when docs imports work/db.

**When this level is enough.** L4 is written where uncertainty, risk or consequence justify it — not everywhere.

**What going no further costs.** Mandatory L4 everywhere produces documentation nobody reads and nobody updates, which is worse than none.

### Progressive elaboration

The single most damaging misreading of a depth model is that every part of the system must reach the bottom. It must not. Some capabilities deserve a sequence diagram, a data model and a failure flow. Others deserve a sentence. The difference is not seniority or taste — it is **risk-weighted**, and the weights can be named.

*What justifies more depth — walk this before writing L3 or L4*

| Force | Ask | More depth when | Less depth when |
|---|---|---|---|
| Uncertainty | Do we genuinely not know how this will work? | Prototype it, then write L3. | We have built this shape four times. L2 and a paragraph. |
| Complexity | How many moving parts and interactions? | Multi-step workflow with compensations — L3 sequence and failure flow. | One collection, one form, one query. |
| Business consequence | What breaks for the business if this is wrong? | Billing, permissions, deletion — design it properly. | An avatar cropper. |
| Technical risk | Is there a plausible way this collapses under load or change? | Evidence first, then design. | Bounded, replaceable, cheap to redo. |
| Security risk | Does it cross a trust boundary or touch personal data? | L3 security design is not optional. | Internal read of non-sensitive data. |
| Operational risk | Who gets paged, and can they fix it at 3am? | Runbook, signals and failure behaviour before launch. | Fails closed, no state, retried by the user. |
| Change frequency | How often will this be edited? | Invest in the boundary; document the contract. | Written once, read rarely. |
| Reversibility | How expensive is it to undo? | Slow down: ADR with evidence. | One pull request to reverse — decide and move. |

> **The depth rule.** Document to the depth at which *the next person would otherwise make an expensive mistake*. Above that line you are under-describing. Below it you are producing artifacts that will go stale faster than they are read — which is worse than nothing, because stale documents are trusted.

**What good looks like**

- Depth varies visibly across the system
- The deepest documentation sits on the riskiest capability
- Someone can say why a given module has no L4
- L3 exists everywhere behaviour is non-obvious
- Each artifact names who it is for

**What weak looks like**

- Every module documented identically
- L4 required by policy, produced by obligation, read by nobody
- Depth decided by who had time
- The riskiest workflow has the thinnest description
- Documentation completeness measured by count

**Under-described.** A billing workflow with a container diagram and nothing else. Every engineer who touches it rediscovers the consistency rules, and one of them gets it wrong in a way that takes three weeks to find.

**Over-described.** A settings page with a sequence diagram, a component diagram and an ADR. Six months later the page has changed four times and all three artifacts are wrong, which now makes them dangerous rather than merely useless.

> **Why L4 is optional and L3 usually is not.** L4 describes implementation, and the implementation is present in the code where it can be read directly. L3 describes behaviour that spans components — sequences, consistency, failure branches — and that is *nowhere* readable in full. It exists only in the heads of the people who built it. That is why skipping L3 is the expensive omission and skipping L4 usually is not.

**You should now be able to**

- State what each level answers and which artifact carries it
- Justify the depth chosen for a capability using named forces
- Explain why L4 is not required everywhere
- Identify the under-described capability in your own system

*Related: Depth Is Not the Whole Architecture · The Architecture Views · From Architecture to System Design · Designing Components*

---

## Chapter 6 — The Architecture Views

> Twelve views of one system. Each asks a different set of questions, is answered by different artifacts, and is validated differently.

**Why this matters.** Same architecture, different dimension. A team that can name the views can name what it has not examined — which is the only way to be honest about what a baseline covers.

A view is not a document type and not a diagram. It is a standing set of questions about the whole system. The artifacts exist to answer them; when the questions change, the artifacts should.

#### Context

*What is the system, who uses it, and what surrounds it?*

`Purpose → Actors → Boundary → External systems → Out of scope`

Questions it asks:
- What problem does the system exist to solve?
- Who are the actors, human and machine?
- What is inside the boundary and what is outside?
- Which external systems do we depend on, and who owns them?
- What is explicitly out of scope?

**Artifacts.** System Context Diagram · External systems table

**Squid.** Squid is a workspace collaboration system for teams. Actors: member, workspace admin, guest, integration client. Externals: identity provider, object storage, mail, payments, calendar. Out of scope: running e-mail infrastructure, being a CRM.

**Validated by.**
- Every actor names a need, not a job title.
- Every external names an owner, a failure behaviour and an exit cost.
- Someone outside the team can read it and correctly say what the system does not do.

**How it is faked.** A context diagram that shows internal components. That is L1 wearing L0's clothes.

---

#### Structure

*What exists and how is it decomposed?*

`Building blocks → Ownership → Dependency direction → Boundaries → Deliberate non-separation`

Questions it asks:
- What are the major building blocks?
- What does each own?
- Which direction do dependencies point?
- Where are the boundaries, and what is allowed to cross them?
- What is deliberately not separated?

**Artifacts.** Container diagram · Component diagram · Module responsibility table · Dependency rules

**Squid.** A modular monolith in Next.js plus a worker fleet. Nine modules with explicit owners. Work owns tasks; policy owns authorisation; gateway owns all database access. No module reaches into another module's db folder — CI enforces it.

**Validated by.**
- Every block has exactly one owner and one sentence of responsibility.
- No cycles in the dependency graph.
- A new joiner can place a change in the right module without asking.

**How it is faked.** Boxes named after teams or after layers with no responsibility statement. "Services" is not a responsibility.

---

#### Behaviour

*How does the system behave at runtime when something actually happens?*

`Triggers → Components → Interactions → State → Data → Events → Failures → Recovery`

Questions it asks:
- What triggers the behaviour?
- Which component receives it first?
- Which boundaries are crossed, and in which order?
- Which components participate?
- Which data changes?
- Which events are emitted?
- Which external systems are called?
- What is synchronous and what is asynchronous?
- What happens on success?
- What happens on failure, at each step?
- What is retried, and what is idempotent?
- What happens if a dependency is unavailable?
- What happens if the request is duplicated?
- What happens if processing partially succeeds?

**Artifacts.** Sequence diagram · Workflow diagram · State diagram · Event-flow diagram · Data-flow diagram · Failure-flow diagram

**Squid.** Assign a task: server action receives the command, Zod validates shape, policy decides, gateway writes task and outbox row in one transaction, worker drains the outbox at-least-once, notify fans out, realtime pushes the board update. Duplicate delivery is absorbed by the notification idempotency key.

**Validated by.**
- Every step names the boundary it crosses.
- Every step has a failure branch, or an explicit note that it cannot fail.
- The sequence has been executed once against the real system, not only drawn.

**How it is faked.** Knowing a module exists is not knowing how the system behaves. A component diagram cannot tell you what happens when the outbox drain dies halfway.

---

#### Patterns

*What established architectural approach is being used, and what does it cost?*

`Problem → Intent → Structure → Runtime behaviour → Benefits → Costs → When not to use`

Questions it asks:
- What recurring problem is this solving?
- Which pattern fits, and which almost fits?
- What does the pattern cost us here?
- What does it forbid?
- When would we abandon it?
- Are we applying it because it fits, or because it is familiar?

**Artifacts.** Pattern specification · ADR recording the selection · Reference implementation

**Squid.** Modular monolith + application service + repository behind a gateway + domain events + transactional outbox + idempotent consumers + cache-aside for board reads. Not used: CQRS with separate read models, event sourcing, sagas outside billing.

**Validated by.**
- Each pattern names the problem it was chosen for.
- Each pattern names its cost in this system, not in the abstract.
- At least one pattern has been rejected in writing.

**How it is faked.** Pattern cargo-culting: adopting CQRS because a conference talk used it, then discovering you own two models and one team.

---

#### Data

*What data exists, who owns it, and how does it move?*

`Ownership → Sources of truth → Schema → Lifecycle → Consistency → Transactions → Replication → Retention → Access`

Questions it asks:
- Which module is the source of truth for each entity?
- What is the schema, and who may change it?
- What is the lifecycle: created, changed, archived, deleted, purged?
- Where are the transaction boundaries?
- What consistency does each workflow need?
- What is replicated, cached or duplicated, and how is it invalidated?
- What is retained, for how long, and under what obligation?
- Who may read it?

**Artifacts.** Data architecture · Entity model · Transaction boundary map · Retention and deletion policy · Migration plan

**Squid.** 21 collections, each with exactly one owning module. Tasks and the outbox share a transaction. Board reads are eventually consistent by up to 2 seconds and say so in the UI. Soft delete plus a 30-day TTL purge; deletion trace is an open question.

**Validated by.**
- Every collection names one owning module.
- Every transaction boundary is deliberate and written down.
- Deletion has been traced end to end, including caches, search and backups.

**How it is faked.** Two modules writing the same collection "temporarily". That is not a data model, it is a future incident.

---

#### Deployment

*Where does it run?*

`Topology → Environments → Networking → Scaling units → Configuration → Deploy → Rollback → Recovery`

Questions it asks:
- What is the runtime topology?
- Which environments exist, and how do they differ?
- What are the scaling units and their triggers?
- How is configuration and secret material supplied?
- How is it deployed, and how is it rolled back — including data?
- What are the recovery objectives, and when were they last tested?

**Artifacts.** Deployment diagram · Environment table · Runbook · Rollback plan

**Squid.** Vercel for the Next.js app, a container platform for workers and realtime, Atlas for MongoDB, managed Redis. Four environments. Workers scale on queue depth; realtime scales on connections. Rollback is a redeploy plus a backwards-compatible migration window of one release.

**Validated by.**
- Rollback has been performed, not merely written down.
- Recovery objectives have a drill date.
- No environment differs from production in a way nobody can name.

**How it is faked.** A deployment diagram that does not show where state lives is a picture of the easy half.

---

#### Security *(cross-cutting)*

*Who is trusted with what, and what stops the rest?*

`Trust boundaries → Identity → Authentication → Authorisation → Data access → Secrets → Threats → Controls → Validation`

Questions it asks:
- Where are the trust boundaries?
- How is identity established and propagated?
- Where are authorisation decisions made, and by which component?
- How is tenant isolation enforced?
- How are secrets stored and rotated?
- What are the abuse cases?
- What does each control do when it fails?
- What is audited?

**Artifacts.** Security design · Threat model · Trust boundary diagram · Audit requirements

**Squid.** Session cookie terminated at the Next.js edge; every gateway call carries a workspace predicate; policy decides and denies by default; presigned upload URLs expire in 15 minutes; ten abuse cases with a preventive or detective control each.

**Validated by.**
- Every trust boundary names what is checked when it is crossed.
- Every control states what happens when it fails — and the answer is not "requests continue".
- Cross-tenant access has been tested, not assumed.

**How it is faked.** Authorisation scattered across route handlers. Ten places to change, nine that will be missed.

---

#### Reliability *(cross-cutting)*

*What does the system promise when parts of it are broken?*

`Failure modes → Degradation → Retry → Idempotency → Isolation → Recovery`

Questions it asks:
- What are the failure modes of each dependency?
- What degrades and what stops?
- What is retried, and with what backoff?
- What is idempotent, and what is not?
- What is the blast radius of each failure?
- What is the recovery path, and who runs it?

**Artifacts.** Failure-mode table · Failure-flow diagram · Runbook · Recovery objectives

**Squid.** Ten dependencies with a degraded and an unavailable behaviour each. Search down means the board still loads and search shows a banner. Realtime down means collaboration falls back to save-and-refresh. Mail down means notifications queue rather than vanish.

**Validated by.**
- Every dependency has a written degraded behaviour.
- At least one failure has been injected in a non-production environment.
- Nothing in the list degrades to "unknown".

**How it is faked.** "We retry" is not a reliability model. Retry without idempotency is duplication with extra steps.

---

#### Performance *(cross-cutting)*

*How fast, at what size, and what happens beyond it?*

`Load model → Targets → Bottlenecks → Caching → Growth → Headroom`

Questions it asks:
- What is the load today and the load assumed?
- Which operations have a latency target, and why that number?
- Where is the bottleneck, and how do we know?
- What is cached, and how is it invalidated?
- What grows without bound?
- What breaks first when volume doubles?

**Artifacts.** Quality attribute table with measures · Benchmark or spike evidence · Capacity model

**Squid.** Board view p95 under 400ms at 5,000 tasks per workspace. Document sync convergence under 200ms for 20 concurrent editors. Search p95 under 700ms. The capacity and cost model behind these numbers does not yet exist — recorded as a gap.

**Validated by.**
- Every target has a measure and a measurement point.
- At least one target has evidence, not an estimate.
- The growth assumption is written down with a date to revisit.

**How it is faked.** Targets with no measurement point are aspirations. "Fast" is not a target.

---

#### Operations *(cross-cutting)*

*How is it observed, deployed, recovered and maintained?*

`Signals → Alerts → Runbook → Deployment → Ownership → Cost`

Questions it asks:
- What signals exist, and which of them page a human?
- What does the first responder do in the first five minutes?
- How is a release deployed and reverted?
- What routine work does this design create forever?
- Who owns it at 3am?
- What is the cost of running it?

**Artifacts.** Operational model · Signal and alert list · Runbook · On-call ownership

**Squid.** Ten signals with thresholds, five runbook first-actions, deployment and rollback per component. Every asynchronous path added during refinement created an operational obligation and the obligation is named.

**Validated by.**
- Every alert has a first action.
- Every asynchronous path has a backlog signal.
- The on-call person was in the review.

**How it is faked.** Architecture that is elegant to draw and unowned to run. Every queue you add, somebody watches forever.

---

#### Decisions

*Why was it designed this way, and what would change our mind?*

`Problem → Drivers → Options → Criteria → Evidence → Decision → Consequences → Rejected`

Questions it asks:
- What was the problem, in its own terms?
- What drove the choice?
- What options were genuinely considered?
- On what criteria were they compared?
- What evidence was gathered?
- What are the consequences, good and bad?
- What was rejected and why?
- What would make us revisit this?

**Artifacts.** ADR · Assumption register · Evidence and spikes

**Squid.** 26 ADRs. ADR-001 modular monolith over microservices. ADR-007 outbox over dual write. ADR-012 CRDT over operational transform. Six were written during refinement when design work exposed a decision nobody had made.

**Validated by.**
- Every consequential decision has a record.
- Every record names a rejected option with the reason.
- Evidence is proportional to consequence — a benchmark for the expensive ones.

**How it is faked.** ADRs written after the code, to describe what was already built. That is minutes, not decisions.

---

#### Validation

*How do we know the architecture actually satisfies its intent?*

`Claims → Evidence → Experiments → Guardrails → Review → Open risk`

Questions it asks:
- Which claims are asserted and which are demonstrated?
- What evidence exists for each quality attribute?
- What was prototyped, measured or injected?
- Which guardrails are automated?
- What has been reviewed, by whom, and with what standing?
- What remains unproven, and what does that block?

**Artifacts.** Evidence log · Spike results · Guardrail configuration · Review record · Baseline gate record

**Squid.** The dependency guardrail fails CI on a forbidden import. The CRDT choice has a spike behind it. The performance targets do not yet have benchmarks. Every review finding so far came from inside the team — the baseline gate is recorded as partial for that reason.

**Validated by.**
- Each quality attribute states whether it is claimed or demonstrated.
- Unvalidated claims are visible, not buried.
- Someone outside the team has reviewed the architecture at least once.

**How it is faked.** A baseline signed off by the people who wrote it, with no evidence attached, is a document, not an architecture.

### Views and lenses are not the same thing

They are closely related and constantly confused. A **view** is a dimension of the architecture itself — it exists whether or not anyone examines it. A **lens** is a perspective a reviewer adopts in order to examine one. Security is both: there is a security view of the system, and there is a security lens someone looks through to interrogate it.

*Same word, different job*

|  | View | Lens |
|---|---|---|
| What it is | A dimension of the architecture | A disciplined way of examining it |
| Exists when | Always — described or not | Only when someone adopts it |
| Produces | Artifacts: diagrams, contracts, models | Findings, questions, evidence requests |
| Answers | “What is true of the system here?” | “What would go wrong if nobody asked?” |
| Fails by | Being left blank | Being owned by only one person |
| Related chapter | This chapter | Part VI, The Architecture Lens Model |

> **Cross-cutting means every view, not one section.** Security, reliability, performance, scalability, observability and operations are *cross-cutting*: each one has something to say about structure, behaviour, data and deployment. A security section at the end of a document is a confession that security was considered last. The test is simple — if the security content is confined to one chapter, it was not cross-cutting.

### Choosing which views to invest in

1. **Context, structure and decisions are never optional.** A system without these is not described at all.
2. **Behaviour is required wherever the runtime is not obvious** — which is anywhere that has more than one participant, asynchrony, or money.
3. **Data is required wherever state has an owner**, which is everywhere, though the depth varies enormously.
4. **Cross-cutting views are ranked by the drivers.** If availability is the top driver, reliability gets depth; if the product is internal and low-traffic, performance may honestly be a paragraph.
5. **Validation is required in proportion to consequence.** Cheap to be wrong means an argument suffices; expensive to be wrong means evidence.
6. **Write down which views you deliberately left shallow.** An undescribed view and a deliberately shallow one look identical in a document and are completely different in a review.

**What good looks like**

- Each view names who owns it
- Shallow views are marked shallow, with a reason
- Cross-cutting concerns appear in several views, not one section
- The views with depth match the ranked drivers
- Validation states what is proven and what is asserted

**What weak looks like**

- Views nobody has looked at, indistinguishable from views with nothing to say
- Security as an appendix
- Performance targets with no measurement point
- Deployment described without where state lives
- Decisions recorded after the fact to match the code

**You should now be able to**

- Name the twelve views and the question each answers
- Distinguish a view from a lens and explain why both are needed
- Choose the views that deserve depth from the ranked drivers
- Spot a cross-cutting concern that has been confined to one section

*Related: Depth × Views · The Architecture Lens Model · Cross-Lens Architecture Review · The Architecture Artifact Map*

---

## Chapter 7 — Depth × Views

> The two axes intersect. “What does security look like at L1?” is a better question than either axis can ask alone.

**Why this matters.** Most architecture gaps live in a cell nobody thought to visit — data at L3, operations at L2, validation anywhere.

Depth and views are independent. Crossing them turns a vague instruction — “think about security” — into a specific, answerable question at a specific altitude.

*The two axes*

```text
                         ARCHITECTURE VIEWS
             Context  Structure  Behavior  Data  Security  ...
                │         │         │       │       │
   L0 Context   ·         ·         ·       ·       ·
   L1 Container ·         ·         ·       ·       ·
   L2 Component ·         ·         ·       ·       ·
   L3 Design    ·         ·         ·       ·       ·
   L4 Impl.     ·         ·         ·       ·       ·

   Each cell is a question somebody should be able to answer —
   or deliberately decline to.
```

**Context**

| Level | What this view looks like at that depth |
|---|---|
| L0 | This view IS L0. One box, the actors around it, the external systems it touches. |
| L1 | Which container each external system actually talks to — the mail provider talks to the worker, not the web app. |
| L2 | Which module owns each external relationship: notify owns mail, files owns object storage. |
| L3 | The contract with each external: protocol, auth, failure behaviour, SLA, retry and ordering guarantees. |
| L4 | The adapter implementation, the client configuration, the timeout and the circuit-breaker settings. |

**Structure**

| Level | What this view looks like at that depth |
|---|---|
| L0 | The system is one block. Structure at L0 is the boundary itself. |
| L1 | Containers: web, worker, realtime, database, cache, object storage, search. |
| L2 | Modules inside each container, their responsibilities and their dependency direction. |
| L3 | The internal structure of a component: which collaborators, which ports, which error set. |
| L4 | Directories, interfaces, and the guardrail that enforces the dependency rule in CI. |

**Behaviour**

| Level | What this view looks like at that depth |
|---|---|
| L0 | "A member assigns work and the assignee is notified." One sentence, no mechanism. |
| L1 | Which containers participate: web receives, database persists, worker delivers. |
| L2 | Which modules participate and in which order: work → policy → gateway → outbox → notify. |
| L3 | The full sequence with the boundary crossed per step, the failure branch per step, and the compensations. |
| L4 | The function that owns each hop, the retry policy, the idempotency key, and the test that proves it. |

**Patterns**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Rarely visible at L0 — patterns are internal choices, not context. |
| L1 | Container-level patterns: modular monolith, worker fleet, cache-aside, API gateway. |
| L2 | Module-level patterns: ports and adapters, repository, application service. |
| L3 | Behavioural patterns in a workflow: outbox, saga, idempotency, retry with backoff, circuit breaker. |
| L4 | The concrete implementation of the pattern, and the guardrail that keeps it honest. |

**Data**

| Level | What this view looks like at that depth |
|---|---|
| L0 | What classes of data the system holds at all — and which of them are personal. |
| L1 | Which stores exist and which container writes to each. |
| L2 | Which module owns which collection. One writer per collection. |
| L3 | Schema, indexes, transaction boundaries, consistency per workflow, retention and deletion behaviour. |
| L4 | The schema file, the index definition, the migration with up() and down(), the TTL configuration. |

**Deployment**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Which region and which legal jurisdiction the system runs in. |
| L1 | Which containers run where, and what scales independently. |
| L2 | Component placement only where it differs from its container. |
| L3 | Deployment order, migration compatibility windows, rollback behaviour with data. |
| L4 | The pipeline definition, the health check, the resource limits, the alert threshold. |

**Security**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Who is outside the trust boundary: the public internet, guests, integration clients. |
| L1 | Which container terminates authentication, and which are never reachable from outside. |
| L2 | One policy module owns authorisation; no module decides for itself. |
| L3 | The rule set per resource, tenant isolation on every query, abuse cases with controls, fail-closed behaviour. |
| L4 | The policy function signature, the workspace predicate in the gateway, the test that proves a cross-tenant read returns nothing. |

**Reliability**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Which external dependencies the system cannot survive without. |
| L1 | Which container failures are contained and which are total. |
| L2 | Which modules fail closed and which degrade. |
| L3 | Per-dependency behaviour: degraded, unavailable, and what the user sees in each. |
| L4 | The timeout value, the retry policy, the circuit breaker, the dead-letter queue. |

**Performance**

| Level | What this view looks like at that depth |
|---|---|
| L0 | The volume the business expects, stated as a number. |
| L1 | Which container is expected to be the bottleneck and which scales to absorb it. |
| L2 | Which module owns the expensive path. |
| L3 | Query shapes, index coverage, page sizes, payload sizes, concurrency limits. |
| L4 | The index definition, the projection, the pagination cursor, the load test. |

**Operations**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Whether the system is operated by us at all. |
| L1 | What each container emits and who watches it. |
| L2 | Which module owns each alert. |
| L3 | Signal, threshold, first action, escalation. |
| L4 | The metric name, the dashboard, the alert rule, the runbook entry. |

**Decisions**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Decisions about scope and boundary — what the system will never do. |
| L1 | Decisions about topology: modular monolith over microservices, one database over several. |
| L2 | Decisions about ownership and dependency direction. |
| L3 | Decisions about contracts, consistency and failure behaviour. |
| L4 | Implementation choices — usually not ADR-worthy, and that is the point. |

**Validation**

| Level | What this view looks like at that depth |
|---|---|
| L0 | Whether the problem statement was validated with anyone outside the team. |
| L1 | Whether the topology was load-tested or merely argued. |
| L2 | Whether the dependency rule is enforced by a tool or by good intentions. |
| L3 | Whether the workflow was executed, and whether failures were injected. |
| L4 | Whether the test exists and runs in CI. |

### Using the matrix

**As a review agenda.** Walk the cells that matter for the change in front of you. A reviewer who asks “what does data ownership look like at L3 for this?” gets a precise answer or a precise silence. Both are useful; vague approval is not.

**As a gap finder.** Fill the matrix for your own system and look at the empty cells. Some are empty because nothing needed saying. Others are empty because nobody asked. Only you can tell them apart, and only if you look.

**As a scoping tool.** Before a design session, mark the four or five cells the session is actually about. It prevents the meeting where structure is re-litigated because the failure behaviour was uncomfortable.

**As an onboarding path.** A new engineer reads the top-left cells first — context and structure at L0 and L1 — and descends only into the capability they are about to change. Most onboarding documents have no such path, which is why they are read once.

> **Not a documentation quota.** Sixty cells is not sixty documents. Most systems have real content in perhaps fifteen of them, a sentence in another twenty, and a defensible blank in the rest. The matrix is a *question generator*. Treating it as a checklist to complete is how architecture becomes theatre.

**You should now be able to**

- Ask a precise question by naming a view and a level
- Find gaps by looking for cells nobody visited
- Scope a design session to specific cells
- Explain why an empty cell is not automatically a problem

*Related: The Architecture Views · Architecture Depth, L0 to L4 · Architecture Review Checklist · Architecture Completeness*

---

## Chapter 8 — Runtime & Behavioural Architecture

> Knowing a module exists is not knowing how the system behaves when that module participates in a real scenario.

**Why this matters.** This is the view most often missing and most expensive to be missing. Structure tells you where a change goes; behaviour tells you what breaks at 3am.

A component diagram can tell you that work, policy, gateway and notify exist. It cannot tell you that the outbox relay delivers at-least-once, that the notification consumer is idempotent on eventId, or that a version conflict returns 409 and the client refetches. Those are behavioural facts, and they are architecture.

> **The behavioural test.** Pick any capability. Ask: *what happens, step by step, when it is exercised — and what happens at each step when it fails?* If the team can answer the first half and not the second, the behavioural view does not exist yet, regardless of how complete the structure is.

### The questions this view asks

**Trigger and entry**

- What triggers the behaviour?
- Which component receives it first?
- Which boundaries are crossed, in what order?

**Participation**

- Which components participate?
- Which data changes?
- Which events are emitted?
- Which external systems are called?

**Timing**

- What is synchronous?
- What is asynchronous?
- What does the user wait for?

**Success**

- What is true afterwards?
- What invariants hold?
- What has the user been told?

**Failure**

- What happens on failure at each step?
- What is retried?
- What is idempotent?
- What if a dependency is unavailable?

**Edge cases**

- What if the request is duplicated?
- What if processing partially succeeds?
- What if two people do it at once?

### Worked example — assigning a task in Squid

The same example is used from here to the end of this part. It is deliberately ordinary: a member assigns a task to a colleague. There is no distributed transaction, no exotic technology, and nine places where it can go wrong.

| # | From → To | Protocol | What happens | Why here | On failure |
|---|---|---|---|---|---|
| 1 | Browser → Server action | HTTPS POST | assignTask command with a client-generated ULID | The action is the module's entry point; the ULID makes a double submit harmless. | Network failure — the client retries with the same ULID and gets the same result. |
| 2 | Server action → Validation | in-process | Zod parses the command shape | Nothing untrusted reaches the domain. Shape errors are not business errors. | Invalid shape → 400 with field errors. No side effects. |
| 3 | Server action → Policy | in-process | may(actor, "task.assign", resource) | One module decides permission, so there is one place to change it and one place to audit. | Denied → 403, logged with actor and resource. Policy unavailable → fail closed with a retryable error. |
| 4 | Application service → Gateway | in-process | load the task aggregate by id with the workspace predicate | Tenant scope is applied by the gateway, never by the caller. | Not found or wrong workspace → 404. The two are indistinguishable on purpose. |
| 5 | Domain → Domain | in-process | assign() applies the rule: assignee must be an active member; status may not be ARCHIVED | The rule lives with the state it protects. | Rule violation → Invalid, returned as 422 with the rule name. |
| 6 | Gateway → MongoDB | Mongo wire, one transaction | update task with a version predicate, insert an outbox row | State change and event publication become atomic without a distributed transaction. | Version mismatch → 409, the client refetches and retries. Database failure → rollback; nothing happened, nothing was published. |
| 7 | Relay → Broker | poll then enqueue | drain undelivered outbox rows, publish TaskAssigned, mark delivered | At-least-once delivery, recoverable after any crash. | Relay dies mid-drain → the row is redelivered; consumers are idempotent. Broker down → the outbox grows and alerts at 500 rows. |
| 8 | Notify consumer → Mail provider | HTTPS, idempotency key eventId+channel | send the assignment notification | The consumer owns delivery concerns; work does not know mail exists. | Provider error → retry with backoff up to 15 minutes, then dead-letter. Duplicate delivery → absorbed by the key. |
| 9 | Realtime service → Browser | WSS | push the board update to connected clients | Collaborators see the change without polling. | Realtime down → the write already succeeded; clients fall back to refresh-on-focus and a banner appears. |

Read the failure column rather than the happy path. Each branch is a decision somebody made: 404 rather than 403 for a wrong-tenant read, so the endpoint cannot be used to enumerate; 409 rather than last-write-wins, so no edit is silently discarded; the outbox rather than a direct publish, so a crash between write and publish cannot lose the event.

### Failure behaviour, stated as outcomes

| Failure | Result | Behaviour |
|---|---|---|
| Validation failure | 400 | Field errors returned; no side effects; not logged as an error. |
| Authorization failure | 403 | Denied by policy, audited with actor and resource. The resource is not revealed. |
| Not found or wrong tenant | 404 | Indistinguishable from absence, deliberately — otherwise 404 versus 403 becomes an enumeration oracle. |
| Domain rule violation | 422 | The rule name is returned so the UI can explain it in the user's terms. |
| Concurrent update | 409 | The version predicate matched nothing. The client refetches and reapplies; no data is silently overwritten. |
| Database failure | 500 | Transaction rolls back. No task change, no outbox row, therefore no event. The system is consistent with having done nothing. |
| Outbox relay failure | — | The state change stands. Events wait in the outbox and are replayed. Backlog depth alerts at 500 rows. |
| External dependency failure | — | Retry with backoff inside the consumer, then dead-letter. The user's operation is unaffected because it already committed. |
| Duplicate request | 200 | The client ULID or the consumer idempotency key absorbs it. One task, one notification. |
| Partial success across consumers | — | Each consumer succeeds or retries independently. There is no combined state to be half-done, which is the reason the fan-out is asynchronous. |

**What good looks like**

- Every step names the boundary it crosses
- Every step has a failure branch or an explicit “cannot fail”
- Synchronous and asynchronous are visually distinct
- Idempotency is stated where delivery is at-least-once
- The sequence has been executed, not only drawn

**What weak looks like**

- A happy path with an error box at the end
- “Errors are logged” as a failure strategy
- Retry described without idempotency
- Asynchronous steps drawn as if the user waits for them
- Partial success unaddressed because it is uncomfortable

### Artifacts that carry this view

*Pick the one that answers the question being asked*

| Artifact | Answers | Use when |
|---|---|---|
| Sequence diagram | Which participants, in what order, crossing which boundaries | Behaviour spans components and the order matters |
| Workflow diagram | What the business process is, independent of components | Product and engineering need the same picture |
| State diagram | Which states are legal and who may cause a transition | An entity has a lifecycle with rules |
| Event-flow diagram | What is published and who reacts | Asynchronous fan-out exists |
| Data-flow diagram | Where data originates, is copied and leaves | Privacy, deletion or replication is in question |
| Failure-flow diagram | What the system does when a dependency is degraded or gone | There is a designed degradation worth describing |

> **Why this view is skipped.** Because it is the only view that forces specific commitments. A box labelled “Notification Service” commits nobody to anything. “At-least-once delivery, idempotent on eventId, dead-letters after five attempts, backlog alerts at 500” commits somebody to building all four, and to watching the fourth forever. Teams skip behaviour because behaviour is where the work becomes real.

**You should now be able to**

- Describe a capability step by step with the boundary crossed at each step
- Give every step a failure branch stated as an outcome
- Choose the right behavioural artifact for a given question
- Recognise an architecture that is structurally complete and behaviourally empty

*Related: Workflow & Sequence Design · State & Event Design · Reliability & Resilience Lens · Architectural Patterns in Practice · The Module Architecture Contract*

---

# PART III — ARCHITECTURE IN PRACTICE

*Patterns chosen honestly, modules that state what they guarantee, artifacts selected by the question they answer, and a repeatable loop for every capability. This part turns the model into something a team can run on a Tuesday.*

---

## Chapter 9 — Architectural Patterns in Practice

> A pattern is a named trade-off. Every entry here must be usable as an argument against itself.

**Why this matters.** Pattern cargo-culting is the most common way an architecture acquires cost with no corresponding benefit — and it always arrives with good intentions.

Boxes and arrows show what a system is shaped like. Patterns explain *why it has that shape* — and, more usefully, what that shape costs.

> **How to record a pattern.** Pattern → intent → problem it solves → context where it fits → structure → runtime behaviour → benefits → **costs** → risks → **when not to use it** → example → validation. A pattern entry with no cost section and no exclusion is marketing, and it will be cited in a design review as though it were analysis.

#### Layered Architecture  
`Application shape` · *used in Squid*

**Intent.** Separate concerns into horizontal layers so that policy does not depend on mechanism.

**Problem it solves.** Business rules, persistence and transport get written in the same function and become impossible to test or move.

**Context where it fits.** Almost any application. Cheapest possible structural discipline.

**Structure.** Presentation → application → domain → infrastructure. Dependencies point inward only.

**Runtime behaviour.** A request enters at the outer layer and is translated at each boundary; no layer calls outward.

**Benefits.**
- Trivial to explain
- Cheap to enforce with an import rule
- Makes the domain testable without a database

**Costs.**
- Adds indirection for genuinely simple operations
- Tempts teams to create anaemic pass-through layers

**Risks.**
- Layers that all import each other are not layers, they are folders
- Mapping fatigue leads people to leak persistence models upward

**When NOT to use it.** Do not layer a script. If there is no domain logic, a route handler talking to a query is the honest design.

**Example.** Squid: ui → actions → domain → gateway. The import rule in architecture/deps.json fails CI when domain imports gateway internals.

**Validation.** A guardrail that fails the build on an outward dependency, plus a domain test suite that runs with no database.

---

#### Modular Monolith  
`Application shape` · *used in Squid*

**Intent.** Get the boundaries of a distributed system without paying for the network.

**Problem it solves.** Microservices bought early cost distributed transactions, deployment complexity and an operations burden before there is a team to carry it.

**Context where it fits.** One team or a few teams, one deployment cadence, boundaries not yet proven.

**Structure.** One deployable, modules with explicit public interfaces, no cross-module private access, one database with per-module ownership.

**Runtime behaviour.** In-process calls between modules through published interfaces; events for anything that would otherwise be a reverse dependency.

**Benefits.**
- Refactoring a boundary is a rename, not a migration
- One deploy, one trace, one transaction where you need it
- Extraction later is cheap if the boundary held

**Costs.**
- Boundary discipline is voluntary unless automated
- A single runtime failure affects everything
- Scaling is coarse — you scale the whole app

**Risks.**
- "Modular" that is not enforced becomes a distributed ball of mud without the distribution
- One slow module can starve the rest of the process

**When NOT to use it.** Do not use it when parts genuinely have incompatible scaling or availability requirements, or when independent teams need independent release cadence.

**Example.** Squid: nine modules in one Next.js deployment plus a worker fleet. ADR-001 records the choice and names the trigger for revisiting it — a module that needs to scale or release separately.

**Validation.** Dependency guardrail in CI, plus a written extraction trigger per module.

---

#### Hexagonal Architecture  
`Application shape` · *partly used in Squid*

**Intent.** Make the application core independent of how it is driven and what it drives.

**Problem it solves.** The domain becomes unusable outside an HTTP request because it is written against the framework.

**Context where it fits.** Systems with real domain logic, multiple entry points, or a long expected life.

**Structure.** Application core in the middle; driving adapters (HTTP, CLI, queue consumer) on one side, driven adapters (database, mail, payment) on the other; both attach through ports.

**Runtime behaviour.** An adapter translates the outside world into a port call; the core never knows which adapter called it.

**Benefits.**
- The same use case can be driven by a route, a job or a test
- Infrastructure can be replaced without touching rules
- Tests run in milliseconds

**Costs.**
- Two extra types for every operation
- Genuine overhead for CRUD that has no rules

**Risks.**
- Ports invented for things that will never have a second adapter
- Teams confuse the shape with the benefit and produce ceremony

**When NOT to use it.** Do not apply it to modules that are a thin shell over a query. Squid's search module has no hexagon and should not.

**Example.** Squid: work and billing have ports; search and files talk to their infrastructure directly, deliberately.

**Validation.** A use case executed by two different adapters, at least one of which is a test.

---

#### Ports and Adapters  
`Boundary` · *partly used in Squid*

**Intent.** Name the interface the core owns, and keep the implementation on the other side of it.

**Problem it solves.** Direct calls to a vendor SDK scatter a replacement across fifty files.

**Context where it fits.** Any dependency that is external, unstable or likely to be swapped.

**Structure.** The core declares the port (an interface expressed in domain terms). The adapter implements it in vendor terms.

**Runtime behaviour.** The core calls the port. Composition supplies the adapter. Failures are translated into the core's error set at the boundary.

**Benefits.**
- Vendor changes are contained
- The core's error vocabulary stays stable
- Test doubles are trivial

**Costs.**
- An interface per dependency
- Leaky ports are worse than none — a port that exposes the vendor's types buys nothing

**Risks.**
- Port-per-class ritual
- Hiding a dependency so thoroughly that its real failure behaviour is invisible to the core

**When NOT to use it.** Do not port a dependency you would never replace and whose failure you already handle locally — the standard library, for instance.

**Example.** Squid: MailPort with send(to, template, data). The adapter maps provider errors into Transient and Permanent, which is the only distinction notify cares about.

**Validation.** Grep for the vendor package name: it should appear in exactly one directory. This is also the same idea as Hexagonal Architecture, named for the mechanism rather than the shape — knowing that saves an argument.

---

#### Clean Architecture  
`Application shape` · *rejected for Squid*

**Intent.** Organise the whole codebase around the dependency rule: source dependencies point only toward higher-level policy.

**Problem it solves.** Frameworks become load-bearing and the business rules cannot outlive them.

**Context where it fits.** Long-lived systems with substantial rules and a real chance of outliving their framework.

**Structure.** Entities, use cases, interface adapters, frameworks and drivers — four rings, dependencies inward.

**Runtime behaviour.** Control flows outward through interfaces while source dependencies point inward; the inversion is the whole trick.

**Benefits.**
- Domain survives framework churn
- Explicit use cases are excellent documentation

**Costs.**
- Substantial ceremony — request models, response models, presenters
- Slower to write, and noticeably so for small features

**Risks.**
- Teams adopt the folder structure and none of the dependency rule, paying the cost and getting nothing
- Four rings for an application with no rules

**When NOT to use it.** Do not use it in a product still searching for its shape, or where the framework is the product.

**Example.** Squid rejected it. ADR-002: the Next.js App Router is load-bearing by choice, and a layered modular monolith gives most of the benefit at a fraction of the cost.

**Validation.** If adopted: an entity test that imports nothing from the framework. If not adopted: an ADR saying so, which is what Squid has.

---

#### Repository  
`Data` · *used in Squid*

**Intent.** Give the domain a collection-like interface and keep query mechanics out of it.

**Problem it solves.** Query builders spread through business logic; nobody can tell which indexes are needed or which tenant predicate was forgotten.

**Context where it fits.** Any module that owns persistent state.

**Structure.** One repository per aggregate, expressed in domain terms: findAssignable, save, ofId.

**Runtime behaviour.** The domain calls the repository; the repository owns the query, the index assumption and the mapping.

**Benefits.**
- Queries become reviewable in one place
- Tenant and soft-delete predicates can be enforced centrally
- Index requirements become visible

**Costs.**
- Generic repositories degenerate into a worse ORM
- Rich query needs push methods onto the interface until it is a query language again

**Risks.**
- findAll() plus filtering in memory
- A repository that returns database documents is not a repository

**When NOT to use it.** Do not wrap a reporting query in a repository. Reporting wants the query language, not an abstraction over it.

**Example.** Squid: the gateway is the only code that touches Mongo. Every call carries a workspace predicate and honours deletedAt, because it is one place rather than four hundred.

**Validation.** A test that proves a query without a workspace predicate cannot compile or cannot pass review.

---

#### Application Service  
`Application shape` · *used in Squid*

**Intent.** Hold one use case: orchestrate, do not decide.

**Problem it solves.** Transport handlers accumulate rules, and the same rule ends up implemented differently in a route and in a job.

**Context where it fits.** Any operation with more than one step or more than one participant.

**Structure.** A function per use case: validate input, check policy, load, invoke domain, persist, emit.

**Runtime behaviour.** Owns the transaction boundary and the event emission. Contains orchestration, not business rules.

**Benefits.**
- One place per use case
- Reusable from HTTP, queue and test
- Transaction boundary is explicit

**Costs.**
- A thin extra hop for genuinely trivial operations

**Risks.**
- Application services that grow rules become a second domain model
- "Service" as a dumping ground for anything homeless

**When NOT to use it.** Do not create one for a pure read with no policy beyond tenancy.

**Example.** Squid: assignTask(cmd) validates, asks policy, loads the task, calls the domain operation, writes task and outbox in one transaction, returns a Result.

**Validation.** Read the service aloud. If it contains the word "if" more than twice, the rules belong in the domain.

---

#### Domain Events  
`Messaging` · *used in Squid*

**Intent.** Let a module announce that something happened without knowing who cares.

**Problem it solves.** Every new reaction to an action means editing the action. Work ends up importing notify, search and analytics.

**Context where it fits.** When several unrelated reactions follow one business fact.

**Structure.** The owning module publishes a named past-tense fact with a stable payload. Consumers subscribe.

**Runtime behaviour.** Emitted inside the transaction that made the fact true; delivered after commit.

**Benefits.**
- Reverse dependencies disappear
- New consumers require no change to the producer
- The event log is a readable history of the domain

**Costs.**
- The payload is a contract and versioning it is real work
- Debugging crosses an asynchronous seam

**Risks.**
- Events used as commands in disguise ("TaskShouldBeIndexed")
- Consumers depending on fields the producer considered incidental

**When NOT to use it.** Do not use events where you need an answer. A question is a call, not an event.

**Example.** Squid: TaskAssigned carries workspaceId, taskId, assigneeId, actorId, at. Notify, search and activity consume it. Work imports none of them.

**Validation.** The producer module's import list contains no consumer. Check it in CI.

---

#### Event-Driven Architecture  
`Messaging` · *partly used in Squid*

**Intent.** Make the event stream the primary means of integration between components.

**Problem it solves.** Synchronous chains couple availability: if any participant is down, the whole operation fails.

**Context where it fits.** Many independent reactions, tolerance for eventual consistency, and an operations capability to match.

**Structure.** Producers, a broker, independent consumers with their own state and failure handling.

**Runtime behaviour.** Asynchronous, at-least-once, out-of-order unless you pay for ordering.

**Benefits.**
- Availability decoupling
- Independent scaling of consumers
- Natural audit trail

**Costs.**
- Every consumer needs idempotency, retry and a dead-letter path
- End-to-end tracing becomes a project
- "Where is my data" becomes a support category

**Risks.**
- Eventual consistency leaking into a UI that promised immediacy
- A broker outage becoming a silent, system-wide failure

**When NOT to use it.** Do not make everything an event. Squid keeps commands synchronous so the user sees the result of their own action.

**Example.** Squid is event-driven only after the commit: the user's write is synchronous and immediate; notification, search indexing and activity are asynchronous.

**Validation.** For every asynchronous path: an idempotency strategy, a retry policy, a dead-letter queue and a backlog alert. Missing any one of the four means it is not ready.

---

#### Transactional Outbox  
`Messaging` · *used in Squid*

**Intent.** Make "state changed" and "event published" atomic without a distributed transaction.

**Problem it solves.** Writing to the database and then publishing to a broker can succeed halfway. The dual write is the bug.

**Context where it fits.** Any system that must emit events about its own state changes reliably.

**Structure.** An outbox collection written inside the same transaction as the state change; a relay drains it and publishes.

**Runtime behaviour.** Commit writes both. The relay polls or tails, publishes, marks delivered. Delivery is at-least-once.

**Benefits.**
- No lost events, ever, without two-phase commit
- The outbox is a replayable log when a consumer was broken

**Costs.**
- A relay to run and watch
- Publication latency of one poll interval
- Consumers must be idempotent

**Risks.**
- An outbox that grows unbounded because nobody purges delivered rows
- A relay running twice and doubling every event

**When NOT to use it.** Do not use it when losing the event is genuinely acceptable — a best-effort metric does not need this.

**Example.** Squid: ADR-007 chose the outbox over dual write after a spike showed a 0.3% loss rate under worker restarts. Rows purge after 7 days; backlog depth alerts at 500.

**Validation.** Kill the relay mid-drain. Every event must arrive exactly once from the consumer's point of view.

---

#### Saga / Process Manager  
`Messaging` · *partly used in Squid*

**Intent.** Coordinate a multi-step process that cannot be one transaction, with explicit compensation.

**Problem it solves.** A business process spans systems that cannot share a transaction, and failing halfway leaves inconsistent state.

**Context where it fits.** Long-running processes crossing a real boundary — usually money, an external provider, or both.

**Structure.** A state machine per process instance, persisted; each step has a compensating action.

**Runtime behaviour.** Step, persist, react to the result, compensate backwards on failure.

**Benefits.**
- Partial failure becomes a designed state rather than an incident
- The process is inspectable and resumable

**Costs.**
- A state machine to build, persist, version and monitor
- Compensations are business decisions, not technical ones — refunds are not rollbacks

**Risks.**
- Saga adopted for processes that fit in one transaction
- Stuck instances nobody monitors

**When NOT to use it.** Do not use it inside one database. Squid assigns a task in a single transaction and needs no saga to do it.

**Example.** Squid uses one: subscription upgrade — reserve seats, charge the provider, apply entitlements, notify. Compensation releases the seat reservation and records a failed upgrade.

**Validation.** A test that fails at each step and asserts the compensated end state, plus an alert on instances older than an hour.

---

#### CQRS  
`Data` · *rejected for Squid*

**Intent.** Separate the model that writes from the model that reads when their needs genuinely conflict.

**Problem it solves.** One model optimised for invariants makes read queries expensive, or vice versa.

**Context where it fits.** Very different read and write shapes, very different scaling, or a read path that cannot tolerate write-side contention.

**Structure.** Command side with the domain model; query side with denormalised read models kept up to date by events.

**Runtime behaviour.** Writes go through the domain; reads bypass it entirely; propagation is asynchronous.

**Benefits.**
- Reads can be shaped exactly for the screen
- Read and write scale independently

**Costs.**
- Two models to maintain and keep consistent
- Every read is stale by some amount you must now specify
- Debugging requires understanding the projection

**Risks.**
- Adopted as a default and paid for forever
- Projections that drift with no rebuild path

**When NOT to use it.** Do not adopt it before a specific read that a well-indexed query demonstrably cannot serve.

**Example.** Squid rejected it (ADR-009). Board reads are served by a compound index and a projection; the p95 measured 180ms at the target size. A denormalised board read model is named as the next step if that number degrades.

**Validation.** Before adopting: a measurement proving the single model cannot meet the target. After adopting: a projection rebuild that has actually been run.

---

#### API Gateway  
`Edge` · *partly used in Squid*

**Intent.** Put cross-cutting edge concerns in one place in front of the system.

**Problem it solves.** Authentication, rate limiting, TLS and routing get reimplemented per service, differently.

**Context where it fits.** Multiple backend services exposed to untrusted clients.

**Structure.** A single entry point handling termination, authentication, routing, rate limiting and request logging.

**Runtime behaviour.** Every external request passes through it; internal traffic may not.

**Benefits.**
- One place for edge policy
- Backends stop caring about transport concerns

**Costs.**
- A component on the critical path of everything
- Configuration becomes a deployment concern of its own

**Risks.**
- Business logic creeping into gateway configuration
- A single point of failure with no fallback

**When NOT to use it.** Do not put one in front of a single application that already terminates its own requests — that is what Squid does.

**Example.** Squid: the Next.js edge performs the gateway role for web traffic. A separate gateway is deferred until the public API has external consumers, recorded as a trigger rather than a plan.

**Validation.** Ask what happens when the gateway is down. If the answer is "everything", the pattern needs a second instance before it needs more features.

---

#### Backend-for-Frontend  
`Edge` · *used in Squid*

**Intent.** Give each client surface a backend shaped for that surface.

**Problem it solves.** One generic API forces every client to over-fetch, and every client's needs distort it.

**Context where it fits.** Genuinely different surfaces — a web app, a mobile app, a partner API — with different payload and latency needs.

**Structure.** A thin per-surface layer that composes and shapes responses from shared services.

**Runtime behaviour.** Client talks only to its BFF; the BFF talks to the modules.

**Benefits.**
- Payloads fit the screen
- Clients evolve without renegotiating a shared contract

**Costs.**
- One more thing to deploy per surface
- Logic duplicated across BFFs if discipline slips

**Risks.**
- BFFs that accumulate business rules
- A "BFF" that is actually the only backend

**When NOT to use it.** Do not build one per client when the clients want the same data.

**Example.** Squid: React Server Components are the web BFF — they compose module calls server-side and send the page, not the data model. A separate mobile BFF is not built and not needed yet.

**Validation.** Count the fields the client discards. If it is near zero, the shaping is working.

---

#### Cache-Aside  
`Data` · *used in Squid*

**Intent.** Reduce load on a source of truth without making the cache authoritative.

**Problem it solves.** Repeated identical reads of slow or expensive data.

**Context where it fits.** Read-heavy data that tolerates a defined staleness.

**Structure.** Read cache; on miss read source and populate; on write invalidate.

**Runtime behaviour.** The cache is never the source of truth and never written to directly by business logic.

**Benefits.**
- Large latency and load win for small effort
- Cache loss degrades performance, not correctness

**Costs.**
- Every cached item needs an invalidation story and a TTL
- Stampedes on popular keys need handling

**Risks.**
- Invalidation that is forgotten on one of the write paths
- Caching personal data past its retention window

**When NOT to use it.** Do not cache what you have not measured, and never cache an authorisation decision without a very short TTL.

**Example.** Squid: workspace membership and feature flags, 60-second TTL, invalidated on membership change. Task content is not cached — it changes too often and correctness matters more than the milliseconds.

**Validation.** Flush the cache under load and watch the source survive. Then change the underlying data and time how long the stale value lives.

---

#### Retry with Backoff  
`Resilience` · *used in Squid*

**Intent.** Survive transient failure without amplifying it.

**Problem it solves.** A brief dependency blip fails a user operation that would have succeeded a second later.

**Context where it fits.** Transient, idempotent operations across a network.

**Structure.** Bounded attempts, exponential delay, jitter, and a distinction between retryable and permanent errors.

**Runtime behaviour.** Attempt, classify the error, wait, retry, then give up into a dead-letter path.

**Benefits.**
- Most transient faults disappear
- Cheap to add where it belongs

**Costs.**
- Latency on the failure path
- Requires the operation to be idempotent — or it creates duplicates

**Risks.**
- Retry storms turning a degradation into an outage
- Retrying a permanent error forever
- Retries stacked at three layers multiplying into hundreds of calls

**When NOT to use it.** Never retry a non-idempotent write without an idempotency key. Never retry a 4xx.

**Example.** Squid: mail delivery retries 5 times with jitter up to 15 minutes, then dead-letters. Payment capture never retries without the provider's idempotency key.

**Validation.** Count the calls the dependency actually receives during an injected failure. Retry budgets should be visible in that number.

---

#### Circuit Breaker  
`Resilience` · *partly used in Squid*

**Intent.** Stop calling a dependency that is clearly broken, so the caller stays alive.

**Problem it solves.** A slow dependency consumes every worker thread and takes down a healthy system.

**Context where it fits.** A remote dependency with a plausible failure mode of slowness rather than refusal.

**Structure.** Closed, open, half-open — with a failure threshold, an open duration and a trial request.

**Runtime behaviour.** When open, fail immediately with the designed degraded behaviour instead of waiting.

**Benefits.**
- Bounded blast radius
- Recovery without a deploy

**Costs.**
- Thresholds require tuning against real traffic
- A breaker that opens too eagerly creates the outage it was meant to prevent

**Risks.**
- No designed behaviour for the open state — an exception is not a design
- Breakers per instance behaving inconsistently across a fleet

**When NOT to use it.** Do not add one before you have a timeout. A timeout is the prerequisite; the breaker is the amplifier.

**Example.** Squid: the search adapter opens after 10 failures in 30 seconds and the board renders with a "search unavailable" banner. Mail has retries and a dead-letter queue instead — it is asynchronous and nothing waits on it.

**Validation.** Injected latency should cause the breaker to open and the user-facing degradation to appear, both within the stated time.

---

#### Bulkhead  
`Resilience` · *used in Squid*

**Intent.** Partition resources so one workload cannot consume everything.

**Problem it solves.** A single expensive job class starves every other job in a shared pool.

**Context where it fits.** Shared pools — threads, connections, queue workers — serving workloads of different importance.

**Structure.** Separate pools, queues or instances per workload class, each with its own limit.

**Runtime behaviour.** Saturating one partition degrades only that partition.

**Benefits.**
- Failure isolation without new services
- Priority becomes structural rather than aspirational

**Costs.**
- Lower average utilisation
- More pools to size and watch

**Risks.**
- Partitions sized by guesswork
- So many partitions that none has enough headroom to absorb a spike

**When NOT to use it.** Do not partition below the point where a partition can absorb one unit of its own work.

**Example.** Squid: export jobs run on their own queue and worker pool with concurrency 1, so a large export cannot delay notification delivery during the morning peak.

**Validation.** Saturate one pool and confirm the others meet their targets unchanged.

---

#### Idempotency  
`Resilience` · *used in Squid*

**Intent.** Make repeating an operation harmless, so that retries and at-least-once delivery are safe.

**Problem it solves.** Network uncertainty means the caller cannot tell whether an operation happened. Retrying may duplicate it.

**Context where it fits.** Every asynchronous consumer and every externally retryable write.

**Structure.** A caller-supplied key, or natural idempotency through a deterministic identifier and a conditional write.

**Runtime behaviour.** First execution performs the work and records the key; subsequent executions return the first result.

**Benefits.**
- Makes at-least-once delivery acceptable
- Turns a retry from a risk into a tool

**Costs.**
- A key store with its own retention
- The key must cover the right scope, which is easy to get subtly wrong

**Risks.**
- Keys scoped per attempt rather than per intent — which protects nothing
- Idempotency asserted but never tested

**When NOT to use it.** Do not bolt it on after adopting retries. It is the precondition, not the follow-up.

**Example.** Squid: notification consumers key on eventId + channel. Task creation from the UI keys on a client-generated ULID, so a double submit creates one task.

**Validation.** Deliver the same event twice on purpose in a test and assert one effect.

---

#### Strangler Fig  
`Change` · *rejected for Squid*

**Intent.** Replace a system incrementally by routing capability away from it, piece by piece.

**Problem it solves.** A rewrite that must land all at once will not land.

**Context where it fits.** Replacing or extracting from a system that must keep running throughout.

**Structure.** A routing seam in front of old and new; capabilities move across one at a time; the old system shrinks until it is removed.

**Runtime behaviour.** Every request is routed to one implementation; both run in parallel during migration.

**Benefits.**
- Value lands continuously
- Each step is individually reversible
- Risk is bounded per capability

**Costs.**
- Two implementations to run, monitor and keep consistent
- The seam itself is work

**Risks.**
- The final 10% never gets migrated and the seam becomes permanent
- Data ownership split across both systems with no source of truth

**When NOT to use it.** Do not use it when the system can be replaced in a single safe step, or when nobody has committed to finishing.

**Example.** Squid does not need it today — it is a new system. It is recorded as the intended approach if the work module is ever extracted, together with the seam that would be required.

**Validation.** A dated plan with the last capability named, and a per-capability traffic percentage that someone actually watches.

### Preventing cargo cult

**Name the problem before the pattern.** If the sentence starts with the pattern — “we should use CQRS” — stop and write the problem first. A problem statement that does not survive being written down was a preference.

**State the cost in this system.** Not the textbook cost. *Ours.* “Two models to keep consistent” is generic. “Two models, maintained by four engineers who also own billing, with no projection rebuild yet written” is a decision input.

**Name what you are rejecting.** Every pattern selection is a rejection of at least one alternative. If no alternative was considered, no decision was made — a default was accepted.

**Name the abandonment trigger.** Under what future condition would this pattern be wrong? A pattern with no abandonment trigger becomes permanent by default, which is how systems end up with two event buses.

**Check the prerequisite.** Several patterns have hard prerequisites. Retry requires idempotency. A circuit breaker requires a timeout. At-least-once delivery requires idempotent consumers. Adopting the headline without the prerequisite produces the failure the pattern was meant to prevent, with extra machinery.

> **The three most expensive mis-adoptions.** - **CQRS without a measurement.** Adopted because reads “will get slow”, paid for in two models forever. Measure first; an index usually wins.
> - **Microservices without an operations capability.** The boundaries are the benefit; the network is the cost. A modular monolith gives the first without the second.
> - **Retry without idempotency.** Turns a transient failure into a duplicate write, which is a data problem rather than an availability one, and far harder to see.

**What good looks like**

- Each pattern names the problem it was chosen for
- Costs are stated in this system’s terms
- At least one pattern has been rejected in writing
- Prerequisites are satisfied before the pattern is adopted
- Each pattern has an abandonment trigger

**What weak looks like**

- Patterns named in a diagram legend and nowhere else
- Benefits listed, costs absent
- A pattern adopted because another team uses it
- Three retry implementations with three behaviours
- Nobody can say when the pattern would be wrong

**You should now be able to**

- Record a pattern with intent, cost, exclusion and validation
- Reject a pattern in writing, with the reason
- Identify a missing prerequisite before adoption
- Name the abandonment trigger for a pattern in your system

*Related: Patterns & Reference Architectures · Principles → Standards · Decision Framework · The Module Architecture Contract*

---

## Chapter 10 — The Module Architecture Contract

> Twenty-one clauses that turn “this module exists” into “this is what you may rely on”.

**Why this matters.** A module is not architecturally complete because folders and files have been defined. Folders answer where; a contract answers what, why, how, and what if it fails.

Ask most teams to describe a module and you get a directory listing and a sentence. Ask what happens when its dependency is unavailable, who owns its data, which events it publishes and what it guarantees under concurrency, and the room goes quiet. The contract is the set of questions that fills that silence.

*What a real architectural description of a module answers*

```text
WHAT?                 It exists, and owns this
WHY?                  It exists for this reason
HOW?                  It is structured this way
HOW DOES IT INTERACT? Through this interface, these events
WHAT PATTERN?         This approach, at this cost
WHAT DATA?            These collections, this lifecycle
WHAT IF IT FAILS?     These outcomes, not these exceptions
WHAT GUARANTEES?      This, under these conditions
HOW DO WE KNOW?       This evidence, dated
```

**1. Purpose** — Why does this module exist, in one sentence a product person would accept?

> *Squid, work module.* Manage business tasks and their lifecycle inside a workspace.
>
> *Weak answer.* "Handles task-related functionality." That sentence would survive the module being deleted.

**2. Responsibility** — What is this module answerable for — and what is it explicitly not answerable for?

> *Squid, work module.* Answerable for: task identity, metadata, status transitions, relationships, lifecycle. Not answerable for: who may act (policy), notification delivery (notify), or full-text retrieval (search).
>
> *Weak answer.* A responsibility list with no exclusions. Everything in the system is arguably task-related.

**3. Boundary** — What is inside the module, and what must go through its public interface?

> *Squid, work module.* Inside: the task aggregate, its state machine, its repository. Outside: any caller. No code outside work reads a task document directly.
>
> *Weak answer.* A boundary that exists in the folder structure and nowhere else.

**4. Owned data** — Which collections does it own, and what is the lifecycle of each?

> *Squid, work module.* tasks, task_links, task_activity. Soft delete on tasks with a 30-day TTL purge; activity retained 400 days; links cascade on task purge.
>
> *Weak answer.* Shared write access to tasks "just for the migration".

**5. Dependencies** — What does it depend on, and could it be built without each one?

> *Squid, work module.* identity (actor resolution), workspace (membership and seat state), policy (authorisation). Plus the gateway for persistence and the outbox for publication.
>
> *Weak answer.* A dependency list that omits the ones acquired accidentally through a shared utility.

**6. Dependency direction** — Which way do dependencies point, and what may not point back?

> *Squid, work module.* work → identity, workspace, policy. Nothing may import work except through its published interface; notify, search and activity consume events instead.
>
> *Weak answer.* Work importing notify to send an e-mail. That is the cycle that turns a modular monolith into a monolith.

**7. Public interface** — What commands and queries does it expose, with what error set?

> *Squid, work module.* Commands: createTask, updateTask, assignTask, transitionTask, linkTasks, archiveTask. Queries: taskById, boardView, assignableMembers. Errors: NotFound, Forbidden, Conflict, Invalid.
>
> *Weak answer.* An interface that returns database documents, which makes the schema a public contract by accident.

**8. Internal structure** — How is it organised inside, and what enforces that?

> *Squid, work module.* db/ (schema, repository), domain/ (aggregate, state machine, rules), policy/ (resource descriptors), actions/ (application services), ui/ (server components and islands). Import rules in architecture/deps.json.
>
> *Weak answer.* Structure documented in a wiki page and enforced by code review on a good day.

**9. Architectural patterns** — Which patterns are used here, and what does each cost?

> *Squid, work module.* Application service, repository behind the gateway, domain events, transactional outbox. Not hexagonal — there is one driving adapter and no plan for a second.
>
> *Weak answer.* Listing patterns without cost. Every pattern here bought something and charged for it.

**10. Runtime behaviour** — What happens, step by step, when the module is exercised?

> *Squid, work module.* Command → Zod validation → policy decision → load aggregate → domain operation → transaction writing task and outbox → return Result. Relay publishes after commit.
>
> *Weak answer.* "It saves the task." That is the one step nobody was worried about.

**11. Events** — What does it publish, what does it consume, and what is the payload contract?

> *Squid, work module.* Publishes TaskCreated, TaskUpdated, TaskAssigned, TaskCompleted, TaskArchived. Consumes UserDeleted (unassign and anonymise) and ProjectArchived (archive contained tasks).
>
> *Weak answer.* Events with the whole document as payload. Now every field is a contract.

**12. State** — What states exist, which transitions are legal, and who may cause them?

> *Squid, work module.* DRAFT, OPEN, IN_PROGRESS, BLOCKED, DONE, ARCHIVED. DONE → OPEN only by the assignee or an admin, and only within 24 hours. ARCHIVED is terminal apart from restore by an admin.
>
> *Weak answer.* Status as a free string, validated in the UI.

**13. Failure behaviour** — What happens when each thing that can fail, fails?

> *Squid, work module.* Validation → 400 with field errors. Authorisation → 403, logged. Version conflict → 409 and the client refetches. Database failure → transaction rolls back, nothing published. Outbox relay failure → events wait and are replayed; the backlog alerts at 500. Duplicate submit → absorbed by the client-supplied ULID.
>
> *Weak answer.* A failure section that lists exceptions rather than outcomes.

**14. Security model** — What trust boundary does it sit behind, and what does it check itself?

> *Squid, work module.* Behind the authenticated session boundary. Never trusts the caller for workspace scope — every gateway call carries the workspace predicate. Policy is asked for every command; default deny.
>
> *Weak answer.* "The route already checked." Modules that assume their callers are careful eventually get a careless caller.

**15. Reliability model** — What does it promise when its dependencies are degraded?

> *Squid, work module.* Policy unavailable → fail closed, commands rejected with a retryable error. Search unavailable → board unaffected. Realtime unavailable → writes succeed, clients fall back to refresh.
>
> *Weak answer.* Promises with no stated behaviour for the degraded case.

**16. Performance considerations** — What are the targets, and what is the expensive path?

> *Squid, work module.* Board view p95 under 400ms at 5,000 tasks per workspace, served by { workspaceId, status, updatedAt }. Task write p95 under 250ms. The expensive path is the board query with filters; it is paginated and capped at 200 rows.
>
> *Weak answer.* No target, therefore no bug — until someone notices.

**17. Observability** — What does it emit, and what would tell you it is unhealthy?

> *Squid, work module.* Structured logs with workspaceId and actorId, a counter per command outcome, a histogram of board-read latency, and outbox lag. Unhealthy looks like conflict rate above 2% or outbox lag above 60 seconds.
>
> *Weak answer.* Logging that cannot be filtered by tenant during an incident.

**18. Operational considerations** — What ongoing work does this design create for whoever runs it?

> *Squid, work module.* Watch outbox lag, purge delivered rows, run the 30-day task purge, re-run the board index build after a schema migration. One runbook entry per alert.
>
> *Weak answer.* Operational cost discovered by the on-call engineer.

**19. Architectural decisions** — Which ADRs constrain this module?

> *Squid, work module.* ADR-001 modular monolith, ADR-004 one writer per collection, ADR-007 outbox over dual write, ADR-009 no CQRS for board reads, ADR-016 optimistic concurrency via a version predicate.
>
> *Weak answer.* A module whose shape nobody can explain, because the reasons were never written down.

**20. Constraints** — What is fixed, by whom, and what happens if it is violated?

> *Squid, work module.* No direct Mongo access outside the gateway (CI fails). No synchronous call to notify (CI fails). Board payload capped at 200 rows (test fails). Data resides in one region (a legal constraint, not a technical one).
>
> *Weak answer.* Constraints that are conventions. A constraint nobody can break is a constraint; the rest are hopes.

**21. Validation evidence** — What demonstrates that the above is true rather than intended?

> *Squid, work module.* Board benchmark at 5,000 tasks (180ms p95, dated). Outbox kill test — no loss, no duplicates at the consumer. Cross-tenant read test returns empty. Dependency check green in CI. Not yet evidenced: behaviour at 50,000 tasks per workspace.
>
> *Weak answer.* An empty evidence section, which converts the whole contract into an intention.

### How to use it

1. **Not every module needs all twenty-one clauses.** A module with no state skips owned data; a module with no events skips events. Skipping is fine; leaving a clause blank because nobody asked is not.
2. **Write it when the module is created, not when it is finished.** Half the clauses are decisions, and decisions made in writing are cheaper than decisions discovered in review.
3. **Keep it beside the code.** A contract in a wiki drifts; a contract in the module directory is edited by the same pull request that breaks it.
4. **Review it when the boundary changes.** A new dependency, a new event, or a new writer to owned data are all contract amendments, not implementation details.
5. **Treat the evidence clause as load-bearing.** Without it, the other twenty clauses describe intentions.

**A README.** Tells you how to run the module, what the scripts do, and where the tests are. Necessary. It says nothing about what other modules may rely on, so it cannot be violated.

**What others may depend on.** States the interface, the guarantees, the failure behaviour and the evidence. It can be violated, which is precisely what makes it worth writing — a promise nobody can break is not a promise.

> **Why twenty-one clauses and not five.** Because the omitted clauses are always the same ones — failure behaviour, dependency direction, owned data lifecycle, observability and evidence — and they are exactly the clauses that cost money when they are missing. A shorter template would be adopted faster and would omit the expensive parts, which is the outcome it was meant to prevent.

**You should now be able to**

- Write a module contract that someone could violate
- Distinguish a contract from a README
- Identify which clauses a given module can legitimately skip
- Use the evidence clause to separate what is true from what is intended

*Related: Designing Components · API & Contract Design · Architecture Document Types · Architecture Completeness*

---

## Chapter 11 — The Architecture Artifact Map

> Start from the question, not from the artifact. Fifteen questions, fifteen answers, and what each artifact must not try to be.

**Why this matters.** Teams produce artifacts because a template listed them. Producing them because someone has a question is the difference between documentation and architecture.

Every artifact in this handbook exists to answer a specific question. When the question is not being asked, the artifact is overhead — maintained, trusted, and slowly becoming wrong.

**What is the system?**  
→ Context Diagram · Context view · L0

- *Shows.* The system as one box, its actors, the external systems it depends on, and the boundary between them.
- *Squid example.* Squid with members, admins, guests around it and identity, storage, mail, payments and calendar outside.
- *Must not become.* It does not show internal components, and the moment it does it has stopped being a context diagram.

**What exists?**  
→ Container / Architecture Diagram · Structure view · L1

- *Shows.* Independently deployable or independently meaningful blocks, what each owns, and how they communicate.
- *Squid example.* Next.js app, worker fleet, realtime service, MongoDB, Redis, object storage, Atlas Search — with protocol on every edge.
- *Must not become.* It does not show classes, and it should not show every collection.

**What is inside a module?**  
→ Component Diagram · Structure view · L2

- *Shows.* Components inside one container or module, their responsibilities and their dependency directions.
- *Squid example.* Inside work: command handlers, the task domain model, the task repository port, the board query.
- *Must not become.* One per container that needs it — not one per container as a rule.

**How does it execute?**  
→ Sequence Diagram · Behaviour view · L3

- *Shows.* Participants in order, the boundary crossed at each step, and the failure branch at each step.
- *Squid example.* Assign task: action → validation → policy → gateway → transaction → outbox → relay → notify.
- *Must not become.* It is not a call graph. If every function appears, it is too detailed to be read.

**How does a business process work?**  
→ Workflow Diagram · Behaviour view · L3

- *Shows.* The business-level steps, decision points, actors and compensations — independent of components.
- *Squid example.* Onboarding a workspace: invite, accept, seat allocation, first project, billing activation.
- *Must not become.* It does not name components, which is exactly why product people can read it.

**How does state change?**  
→ State Diagram · Behaviour view · L3

- *Shows.* The legal states of one entity, the transitions between them, and who may cause each transition.
- *Squid example.* Task: DRAFT → OPEN → IN_PROGRESS → BLOCKED → DONE → ARCHIVED, with the rule that DONE cannot return to DRAFT.
- *Must not become.* It is not a flowchart of the UI.

**How does data move?**  
→ Data-Flow Diagram · Data view · L3

- *Shows.* Where data originates, where it is stored, where it is copied, and where it leaves the system.
- *Squid example.* Task text → Mongo → search index → notification e-mail body → the mail provider's logs. That last hop is why deletion is hard.
- *Must not become.* It is not the entity model; it is about movement, not shape.

**Who owns data?**  
→ Data Architecture · Data view · L2

- *Shows.* Every store and collection with exactly one owning module, plus retention and deletion rules.
- *Squid example.* Squid: 21 collections, one writer each, soft delete with a 30-day purge.
- *Must not become.* Not a schema dump. Ownership and lifecycle are the point.

**Where does it run?**  
→ Deployment Diagram · Deployment view · L1

- *Shows.* Runtime placement, environments, scaling units, and where state actually lives.
- *Squid example.* Vercel edge + regional functions, worker containers scaling on queue depth, Atlas in one region.
- *Must not become.* Not the logical structure again with cloud icons.

**How does it fail?**  
→ Failure-Flow Diagram · Reliability view · L3

- *Shows.* The path a request takes when a dependency is degraded or gone, and what the user sees.
- *Squid example.* Search unavailable: the board renders, the search box is disabled with a banner, an alert fires.
- *Must not become.* Not an exception-handling diagram. It is about designed behaviour, not stack traces.

**What pattern is being used?**  
→ Pattern Specification · Patterns view · L2–L3

- *Shows.* Intent, problem, structure, runtime behaviour, cost in this system, and when it would be abandoned.
- *Squid example.* Outbox in Squid: chosen over dual write, costs a relay and a purge job, abandoned if the broker gains transactional writes.
- *Must not become.* Not a textbook summary. If it has no cost section it is not finished.

**Why was this chosen?**  
→ Architecture Decision Record · Decisions view · any

- *Shows.* Context, problem, drivers, options, criteria, evidence, decision, consequences, risks, rejected alternatives.
- *Squid example.* ADR-012: CRDT over operational transform for document sync, with a spike behind it.
- *Must not become.* Not for every implementation choice. Reserve it for the expensive and the irreversible.

**What does this module guarantee?**  
→ Module Architecture Contract · Structure view · L2–L3

- *Shows.* Purpose, boundary, owned data, dependencies and direction, public interface, patterns, runtime behaviour, events, state, failure, security, reliability, performance, observability, operations, decisions, constraints, evidence.
- *Squid example.* The Squid work module's contract — the persistent example of this handbook.
- *Must not become.* Not a README. A README tells you how to run it; a contract tells you what you may rely on.

**What constraints apply?**  
→ Architecture Standards · Structure view · any

- *Shows.* Enforceable rules derived from principles, each with a guardrail and a stated exception path.
- *Squid example.* "No module imports another module's db folder" — enforced by the dependency checker in CI.
- *Must not become.* Not a style guide, and not advice. A standard that cannot be violated visibly is a preference.

**What proves the architecture?**  
→ Architecture Evidence · Validation view · any

- *Shows.* Measurements, spikes, injected failures, guardrail runs and review records tied to specific claims.
- *Squid example.* The board-read benchmark at 5,000 tasks; the outbox loss-rate spike; the CI dependency check.
- *Must not become.* Not a sign-off. A signature is not evidence.

### Reading the map backwards

The map is also a diagnostic. Take the artifacts your team actually maintains and find the question each one answers. Any artifact whose question nobody is asking is a candidate for deletion. Any question on the map that nothing in your system answers is a gap — and the gap is usually behaviour, data ownership or evidence.

> **One artifact, one question.** An artifact that answers three questions answers none of them well and goes stale three times as fast. When a diagram starts accumulating annotations about deployment, security and failure, it is telling you that three views want their own artifact.

**What good looks like**

- Every maintained artifact has a question and an audience
- Artifacts are deleted when their question stops being asked
- The riskiest question has the most carefully maintained answer
- Each artifact states what it is not

**What weak looks like**

- A documentation folder nobody has opened in a year
- One diagram carrying structure, deployment and failure
- Artifacts produced because a template required them
- Questions answered only in the heads of two people

**You should now be able to**

- Select an artifact by the question being asked
- Delete an artifact whose question is dead
- Find gaps by looking for unanswered questions
- Explain what each artifact must refuse to become

*Related: Architecture Document Types · Diagramming · Documentation as a System · The Architecture Views*

---

## Chapter 12 — The Capability Architecture Loop

> Twelve stations, run per capability, at whatever depth the capability deserves.

**Why this matters.** Architecture fails at the seams between capabilities. A repeatable loop means the same questions get asked every time, including by whoever is least likely to think of them.

This is the reusable mental model of the handbook. It is not a process to be scheduled; it is a sequence of questions that takes ten minutes for a small capability and two sessions for a consequential one.

**01 · Capability** — What can a user or the business do that they could not before?

- *Do.* State it as an outcome, not a feature list.
- *Output.* One sentence.
- *Squid, assigning a task.* A team can assign work to a person and both sides can see its state change.
- *Going shallow.* Never. If you cannot say this, nothing below it is grounded.

**02 · Context** — Who participates, and what does it touch outside itself?

- *Do.* Name the actors and the external systems involved in this capability only.
- *Output.* A context sketch or a paragraph.
- *Squid, assigning a task.* Members and admins; touches identity, notification and the calendar integration.
- *Going shallow.* Skip the diagram when the capability touches nothing external; keep the sentence.

**03 · Boundary** — Which module owns it, and what crosses the line?

- *Do.* Assign one owner. List what enters and leaves.
- *Output.* An ownership statement.
- *Squid, assigning a task.* work owns it. Policy decides permission; notify reacts; nothing else writes.
- *Going shallow.* Never. An unowned capability is how duplication starts.

**04 · Structure** — What exists to make it work?

- *Do.* Identify components — existing ones first. New components need a reason.
- *Output.* Component list or diagram.
- *Squid, assigning a task.* Task aggregate, assignment rule, repository, board query. No new component.
- *Going shallow.* Skip the diagram when nothing new appears.

**05 · Pattern** — Is there an established approach, and does it fit here?

- *Do.* Name the pattern and its cost in this system. Name the one you rejected.
- *Output.* A line in the design, or an ADR if consequential.
- *Squid, assigning a task.* Application service plus domain event. Rejected: calling notify directly, which would create a cycle.
- *Going shallow.* Skip when the work is an obvious variation of something already patterned.

**06 · Behaviour** — What happens at runtime, step by step?

- *Do.* Write the sequence with the boundary crossed per step.
- *Output.* Sequence or workflow.
- *Squid, assigning a task.* Validate → authorise → load → transition → persist with outbox → publish → notify.
- *Going shallow.* Skip when the behaviour is a single write with no participants beyond the module.

**07 · Data** — What is created, changed or moved, and who owns it?

- *Do.* Name fields, indexes, transaction boundary and retention.
- *Output.* Data notes or a model change.
- *Squid, assigning a task.* tasks.assigneeId, tasks.version, an activity row; one transaction with the outbox; activity kept 400 days.
- *Going shallow.* Never skip ownership. Skip the detail when no schema changes.

**08 · Failure behaviour** — What happens when each step fails?

- *Do.* One branch per step. "Cannot fail" is an acceptable answer if it is true.
- *Output.* Failure branches on the sequence.
- *Squid, assigning a task.* Conflict → 409 and refetch. Outbox relay down → event waits. Mail down → queued, retried, dead-lettered.
- *Going shallow.* Never. This is the step teams skip and the one incidents come from.

**09 · Cross-cutting** — What do the lenses say?

- *Do.* Walk security, reliability, performance, operations, UX, DX, cost, accessibility. Record "nothing to add" where that is the honest answer.
- *Output.* A short note per lens that has something to say.
- *Squid, assigning a task.* Security: assignee must be a workspace member. UX: optimistic update with rollback. Ops: one more outbox consumer to watch. A11y: the assignment control must be operable by keyboard and announce the change.
- *Going shallow.* Skip depth, never the walk. A lens with nothing to say takes ten seconds to clear.

**10 · Decision** — Was anything decided here that someone will later ask about?

- *Do.* Write the ADR if it is consequential or expensive to reverse.
- *Output.* An ADR, or nothing.
- *Squid, assigning a task.* No new ADR — it follows ADR-007 and ADR-016.
- *Going shallow.* Skip for reversible, low-consequence choices. Most of them.

**11 · Validation** — How will we know it works as designed?

- *Do.* Attach the test, the measurement or the injected failure.
- *Output.* Evidence, named before the work starts.
- *Squid, assigning a task.* Concurrency test proving the version predicate; duplicate-event test proving one notification.
- *Going shallow.* Never. Decide the evidence before the implementation, or it becomes optional.

**12 · Baseline** — What changed in the architecture, and is it recorded?

- *Do.* Update the affected views and the version. Or record explicitly that nothing changed.
- *Output.* A baseline entry.
- *Squid, assigning a task.* No structural change; the event catalogue gained TaskAssigned; baseline moved to 1.3.
- *Going shallow.* Never. Unrecorded change is how the baseline becomes fiction.

### Running it well

**Never skip boundary, failure, cross-cutting or validation.** The other eight stations can be answered in a sentence when the capability is simple. These four are where the expensive omissions live, and a sentence each is still an answer.

**Scale the output, not the station list.** A small capability produces one paragraph covering all twelve. A large one produces a sequence diagram, a data model and an ADR. The stations do not change; the artifacts do.

**“Nothing to add” is a valid answer, silence is not.** Walking the cross-cutting station and recording “no security implications beyond workspace membership” takes ten seconds and is worth exactly as much as the sentence it saves in the incident review.

**Decide the evidence before the implementation.** Validation named at station eleven, before any code exists, is a test somebody writes. Validation named afterwards is a test somebody intends to write.

> **The failure mode of any loop.** Ritual. Twelve stations walked mechanically, each with a sentence that means nothing, produces a document that satisfies a process and protects nobody. The signal that this is happening: the failure-behaviour station says “handled gracefully” more than once.

**You should now be able to**

- Run the loop for one capability at proportionate depth
- Identify the four stations that must never be skipped
- Record “nothing to add” honestly rather than leaving silence
- Spot a loop that has degenerated into ritual

*Related: From Architecture to System Design · Runtime & Behavioural Architecture · Architecture Impact · Evidence, Experiments & Spikes*

---

## Chapter 13 — Architecture Completeness

> An element is not architecturally complete because it appears on a diagram. Fourteen questions decide.

**Why this matters.** “Is the architecture done?” is unanswerable. “Can this element answer these fourteen questions, at the depth its risk justifies?” is answerable in a meeting.

Completeness is not the number of documents. It is whether a significant element can answer the questions someone will need answered before they can safely change it — or before they are paged about it.

> **The completeness standard.** **A significant architectural element is not considered architecturally complete merely because it appears on an architecture diagram.** It is complete when it can answer structure, responsibility, boundary, dependencies, behaviour, interaction, patterns, data, failure, security, reliability, operations, decisions and validation — each to the depth its risk justifies, and no further.

| Dimension | Question | A real answer | Not this |
|---|---|---|---|
| Structure | What exists? | The element is named, placed, and has exactly one owner. | It appears on a diagram and nowhere else. |
| Responsibility | What does it own? | One sentence of responsibility and an explicit exclusion. | A noun. "The task service." |
| Boundary | What is inside and outside? | What must go through the public interface is stated. | The boundary is the folder name. |
| Dependencies | What does it depend on? | Dependencies listed with direction, including the accidental ones. | The obvious three are listed and the shared utility is not. |
| Behaviour | How does it behave at runtime? | At least one real scenario written step by step. | "It handles requests." |
| Interaction | How does it communicate? | Protocol, synchronicity and contract per edge. | An arrow with no label. |
| Patterns | What approach is used? | Named, with its cost in this system. | Named, with its benefits only. |
| Data | What does it own, read, write and publish? | Collections with ownership, events with payload contracts. | A schema with no ownership statement. |
| Failure | What happens when things fail? | A branch per failure, including dependency unavailability. | "Errors are logged." |
| Security | What trust boundaries and rules apply? | Where the decision is made, what the default is, what happens when the control fails. | "Requires authentication." |
| Reliability | What guarantees exist? | Degraded behaviour stated per dependency. | "Highly available." |
| Operations | How is it observed, deployed, recovered? | Signals with thresholds and a first action per alert. | A dashboard nobody owns. |
| Decisions | Why is it this way? | The consequential choices have records with rejected options. | Everyone remembers the meeting. |
| Validation | What evidence exists? | Measurements, tests or injected failures tied to specific claims. | A sign-off. |

### Significant, and what it excludes

This standard applies to *significant* elements: those whose failure, change or misuse has consequences beyond their own boundary. A utility that formats dates is not significant. A module that owns data, crosses a trust boundary, integrates with an external system, or sits on a critical path is. Applying the standard to everything is how a useful bar becomes bureaucracy, and how teams learn to ignore it.

**Always significant**

- Owns persistent data
- Crosses a trust boundary
- Integrates with an external system
- Sits on a critical path
- Has a failure mode that affects others

**Sometimes**

- Internal module with no state
- Component with one caller
- Job that can be re-run freely
- Read-only projection

**Not significant**

- Pure functions and formatters
- UI components with no rules
- Configuration wrappers
- Anything cheap to delete and rewrite

> **Why “complete” must be relative to risk.** An absolute standard produces one of two outcomes: everything is incomplete forever, or the bar is lowered until everything passes. A risk-relative standard produces a third — a small number of elements documented deeply, most documented briefly, and an explicit, reviewable statement of which is which.

**You should now be able to**

- Judge whether an element is architecturally complete
- Decide whether an element is significant enough to hold to the standard
- Explain why completeness is relative to risk
- Use the fourteen questions as a review agenda

*Related: Architecture Review Checklist · Architecture Baseline Gate · The Module Architecture Contract · Depth × Views*

---

## Chapter 14 — The Architecture Process

> Seventeen activities, and the nine-station loop that stops them being a waterfall.

**Why this matters.** Written as a sequence, architecture looks like a phase. Written as a loop, it looks like what it is — a model that is established early, corrected by evidence, and evolved on purpose.

The activities below are real and each one produces something. The order is a reasonable default, not a gate sequence. Most systems revisit half of them in any given quarter.

*The activities — a default order, not a waterfall*

```text
 1 Establish context              10 Record architectural decisions
 2 Establish structure            11 Review architecture
 3 Identify architectural drivers 12 Validate with evidence
 4 Define boundaries              13 Baseline architecture
 5 Select / define patterns       14 Perform detailed system design
 6 Define runtime behavior        15 Implement
 7 Define data                    16 Validate
 8 Define deployment              17 Evolve architecture
 9 Define cross-cutting concerns
```

> **Read this before using the list.** This is **not** a rigid waterfall. Architecture is progressively elaborated: you establish enough context to propose structure, enough structure to find the real decisions, and enough evidence to know whether the structure survives. Teams that run the list top to bottom once, then stop, have performed architecture rather than done it.

### The loop underneath

**1. Understand** — What problem, whose problem, and what would success look like?

- *Produces.* Problem statement, actors, drivers with measures.
- *The trap.* Starting at Model. Every architecture argument that will not resolve is an unshared understanding.

**2. Model** — What would this look like?

- *Produces.* Context and structure at the depth the uncertainty justifies.
- *The trap.* Modelling at L4 before anyone agrees on L1.

**3. Decide** — Which choices are expensive to reverse, and which option wins on the criteria?

- *Produces.* ADRs with rejected options.
- *The trap.* Deciding without naming the criteria, which makes the decision unreviewable.

**4. Design** — How does it actually work, in detail, where detail matters?

- *Produces.* Sequences, contracts, data models, failure branches.
- *The trap.* Designing everything to the same depth.

**5. Validate** — What evidence supports the claims?

- *Produces.* Spikes, benchmarks, injected failures, guardrails, a review by someone outside.
- *The trap.* Treating review as approval rather than as an attempt to break the thing.

**6. Baseline** — What is now the agreed state, and what is still open?

- *Produces.* A versioned baseline with open questions listed, not hidden.
- *The trap.* Baselining to look finished.

**7. Implement** — Does the code match the architecture?

- *Produces.* Working software plus guardrails that keep it matching.
- *The trap.* Discovering during implementation that the design was never checked against the framework.

**8. Observe** — What is the system actually doing?

- *Produces.* Signals, incidents, real load numbers.
- *The trap.* No feedback path from production into the architecture.

**9. Evolve** — What did we learn, and what must change?

- *Produces.* Impact assessments, updated views, a new baseline version.
- *The trap.* Letting the document and the system drift apart silently.

```text
UNDERSTAND
    ↓
MODEL
    ↓
DECIDE
    ↓
DESIGN
    ↓
VALIDATE
    ↓
BASELINE
    ↓
IMPLEMENT
    ↓
OBSERVE
    ↓
EVOLVE
    ↺
```

The loop and the list describe the same work. The list is what you produce; the loop is how the work actually moves — and the two stations teams most often have no path for are **Observe** and **Evolve**. Without a feedback path from production into the architecture, the baseline is a snapshot of what was believed at the start, and the drift is invisible until an incident measures it.

**What good looks like**

- Architecture work happens at the depth the uncertainty justifies
- Production behaviour feeds back into the model
- The baseline version moves when the system changes
- Evidence corrects earlier decisions in writing
- Open questions are visible in the baseline

**What weak looks like**

- A single architecture phase before delivery
- A baseline that has not changed in a year of change
- Incidents that never reach the architecture record
- Decisions superseded in practice and not in writing
- The same depth of analysis applied to everything

**You should now be able to**

- Run the activities as a loop rather than a sequence
- Name the feedback path from production into the architecture
- Explain progressive elaboration to someone who wants a phase
- Identify a missing Observe or Evolve station in your own team

*Related: The Architecture Lifecycle · Architecture Gates · Evolving the Baseline · Architecture Debt · The Capability Architecture Loop*

---

# PART IV — DRIVERS

*Architecture responds to something. This part is about finding out what, precisely — and
separating what must be true from what we merely believe.*

---

## Chapter 15 — Understanding the Problem

> Work from problem to actors to goals to capabilities to requirements to constraints — in that
> order, and slowly enough to be surprised.

**Why this matters.** An architecture can only be as good as the problem statement it answers.
Most architectural failures are comprehension failures wearing technical clothes.

```text
Problem
   ↓
Users / Actors
   ↓
Goals
   ↓
Capabilities
   ↓
Requirements
   ↓
Constraints
```

### Three problems, not one

| Level | Question | Farm Commerce example |
|---|---|---|
| Business problem | What outcome does the organisation need? | Farms capture the retail margin currently lost to distributors |
| User problem | What is hard or annoying today? | Households want a weekly box they can adjust until the last minute without phoning anyone |
| System problem | What makes this hard to build correctly? | The basket changes until a cut-off, the harvest is uncertain after it, and money moves in between |

The **system problem** is the one architects are paid to notice. It is rarely in the brief.

### The four kinds of requirement

- **Functional** — what the system does. Determines capabilities and candidate boundaries, but rarely determines structure on its own.
- **Non-functional / quality** — how well: latency, availability, throughput, changeability, security, accessibility. The primary source of drivers, and only useful when measurable. “Fast” is not a requirement; “p95 under 400 ms at 40× median write rate” is.
- **Operational** — deployment cadence, recovery objectives, on-call model, environments, support hours. Routinely discovered after launch, which is the most expensive time.
- **Regulatory** — residency, retention, auditability, separation of duties, payment scope. Behaves like a constraint: removes options rather than ranking them.

> **Why measurability matters.** An unmeasurable quality requirement cannot be traded off,
> validated, or used to reject an option. It contributes nothing to a decision while feeling like it
> does. If you can only get a vague statement, record it as an *assumption* with an owner and a date.

### Artifact — Architecture Input Brief

**Purpose:** capture everything the architecture must respond to, in one place, before shaping anything.
**When:** start of a new system, or before a significant new capability.
**Output:** two to four pages.

Required sections: problem (business / user / system) · actors and external systems · goals and
non-goals · capabilities in scope · functional requirements (summary, linked) · quality
requirements with measures · operational requirements · regulatory requirements · constraints ·
assumptions with owners and dates · open questions with the decision each one blocks.

```text
PROBLEM (system)
The customer basket remains editable until Thursday 18:00. Actual
harvest is only known Friday 06:00. Payment is captured between the
two. Substitutions must reach the customer before picking starts.

QUALITY REQUIREMENTS
 · p95 basket edit < 400ms at 40× median write rate, 4-hour window
 · Substitution visible to customer within 60s of farm confirmation
 · Zero duplicate payment captures; every capture traces to one
   order version

NON-GOALS (year one)
 · Same-day delivery
 · Multi-region operation
 · Farm-managed pricing

OPEN QUESTION
Does the cut-off model survive same-day delivery? Blocks: ordering
boundary decision (ADR-002). Owner: Product. Due: end of quarter.
```

> **Common failure — the requirements list with no shape.**
> ❌ A 200-line requirements document in which nothing is marked architecturally significant.
> *Why it fails:* everything looks equally important, so structure gets chosen by habit or fashion.

### ✓ Checkpoint

- Separate the business, user and system problem
- Classify requirements as functional, quality, operational or regulatory
- Write a quality requirement with a measure attached
- Produce an Architecture Input Brief

---

## Chapter 16 — Architectural Drivers

> A requirement is an architectural driver when a plausible alternative structure would satisfy it
> materially better or worse.

**Why this matters.** Drivers are what you will point at later when someone asks why the system is
not simpler.

That test does real work. “The user can reset their password” passes no structure test. “Farms
publish availability without central gatekeeping” immediately implies ownership, permission and
boundary decisions.

### Common driver categories

| Driver | Typically forces | Measure it with |
|---|---|---|
| High availability | Redundancy, failure isolation, degraded modes | Target availability, max tolerable outage per workflow |
| Low latency | Colocation, caching, denormalisation, fewer hops | p95/p99 budget per user-visible operation |
| Multi-tenancy | Isolation model, scoping in data access, noisy-neighbour control | Tenants per store, isolation level required |
| Regulatory isolation | Residency boundaries, separated stores, audit paths | Jurisdictions, retention, evidence required |
| Large data volume | Partitioning, archival, read models | Growth rate, retention, query shapes |
| External integration | Anti-corruption layers, async boundaries, idempotency | Partner SLAs, protocols, failure rates |
| Security sensitivity | Trust boundaries, least privilege, auditability | Asset classification, threat profile |
| Rapid product evolution | Small independent units, narrow contracts, reversibility | Change frequency by area |
| Offline operation | Local state, sync model, conflict resolution | Offline duration, conflict tolerance |
| Geographic distribution | Regional deployment, replication, consistency choices | Regions, cross-region latency budget |
| Team topology | Deployment independence, ownership boundaries | Team count, on-call model, deploy cadence |

> **Team shape is an architectural driver.** Four engineers with no operations specialist is a real,
> measurable constraint on how many runtime components can be operated competently. Treat it as a
> driver, rank it, and let it eliminate options honestly.

### Drivers for the worked example

| Driver | Why it shapes structure | Measure | Priority |
|---|---|---|---|
| Weekly cut-off peak | 70% of weekly edits land in 4 hours before Thursday 18:00 | Sustain 40× median write rate for 4h; p95 edit < 400 ms | High |
| Harvest variability | Actual harvest differs from forecast; substitutions must propagate before picking | Substitution visible within 60 s of farm confirmation | High |
| Payment correctness | Charges happen after cut-off on a variable basket | Zero duplicate captures; every capture traceable to one order version | High |
| Small team | Four engineers, no dedicated operations staff | One on-call rotation; deploys < 15 min; fewer than 8 runtime components | High |
| Farm autonomy | Each farm manages availability without a central gatekeeper | Farm staff publish without admin involvement | Medium |
| Seasonal catalogue change | Catalogue changes weekly; product model changes each season | Catalogue change deployable without touching ordering | Medium |

```text
Architectural Drivers
       ↓
  Prioritized
       ↓
Measurable where possible
       ↓
Traceable to a decision
```

A driver that never appears in a decision record either was not a driver, or the decision was not
reasoned. Both are worth knowing.

| Good | Weak |
|---|---|
| Three to seven drivers, ranked | Everything is “high priority” |
| Each has a measure, or an explicit “not measurable yet” | Drivers are adjectives: fast, scalable, secure |
| Each traces to at least one decision | Drivers written after the design was chosen |
| Drivers survive a challenge from outside the team | Nobody can say which driver a component serves |

### ✓ Checkpoint

- Apply the alternative-structure test to separate drivers from requirements
- Attach a measure to a quality driver
- Rank drivers and defend the ranking
- Trace a structural element back to the driver that justifies it

---

## Chapter 17 — Constraints, Assumptions & Unknowns

> Three different things that look identical in a meeting: what must be true, what we believe is
> true, and what we do not know.

**Why this matters.** Architectures fail most often not because someone chose badly, but because
an assumption silently became a fact.

| | **Constraint** | **Assumption** | **Unknown** |
|---|---|---|---|
| Means | Must be true | Believed true | Not yet known |
| Source | Law, contract, platform limit, budget, organisational fact | Forecast, prediction, partner reliability | An open question |
| Handling | Use it to eliminate options immediately; record its source | Record owner, date, impact-if-wrong; review on a schedule | Name the decision it blocks; get evidence or decide so either answer survives |

> **The silent promotion.** An assumption written on a whiteboard in March is quoted as a fact in
> June and defended as a requirement in September. The only reliable defence is a register with
> dates and owners — and a review that asks, explicitly, “is this still an assumption?”

### Register — worked example

| Type | Statement | Detail | Source | Risk if wrong |
|---|---|---|---|---|
| Constraint | Card data must never touch our systems | PCI scope avoided by using the provider’s hosted fields | Legal / cost | — |
| Constraint | Delivery partner API is batch only | Routes submitted as a file at 06:00; status returns hourly | Partner contract | — |
| Constraint | Team of four, one deployable target | No Kubernetes expertise on the team | Organisational | — |
| Assumption | Under 20,000 active households in year one | Based on cooperative membership growth; revisit quarterly | Product forecast | Medium |
| Assumption | Farms confirm harvest by 06:00 Friday | Currently true for 38 of 40 farms by informal process | Operations | High |
| Unknown | Will we need same-day delivery in year two? | Would change routing, inventory and cut-off design | Product | High |
| Unknown | Regional expansion and tax treatment | Cross-border sales may change pricing and invoicing | Finance | Medium |

Both “Unknown” rows would change the ordering boundary. That is the signal to either run a spike or
choose a structure that survives both answers — and record which you did, and why.

### Artifact — Constraints & Assumptions Register

**Purpose:** keep the difference between fact, belief and ignorance visible for the life of the system.
**When:** created during initialization; reviewed at every baseline update and architecture review.

Fields: ID · type · statement · source or owner · date recorded · review date · impact if wrong ·
decision it affects · status (active / verified / invalidated / superseded).

```text
A-004  ASSUMPTION
Statement    Farms confirm harvest by 06:00 Friday.
Source       Operations; currently true for 38 of 40 farms.
Recorded     2026-02-11      Review  Quarterly
Impact       If false, substitution cannot complete before picking.
             Cut-off and notification design both change.
Affects      ADR-003 (harvest confirmation model)
Status       ACTIVE — two farms consistently late; escalate if a
             third joins them.
```

### ✓ Checkpoint

- Classify a statement as constraint, assumption or unknown
- Record an assumption with owner, date and impact-if-wrong
- Link an unknown to the decision it blocks
- Spot a promoted assumption during review

---
---

# PART V — UNIVERSAL ARCHITECTURE PRINCIPLES

*Principles are the reasoning patterns used to shape a system — and they are decision guides, not
laws. This part gives you both halves. The full 37-principle catalog is in Chapter 67.*

---

## Chapter 18 — Principles of Good Architecture

> Thirty-seven principles in seven families, each with intent, a good and a bad example, its
> trade-off, how to apply it and how to validate it.

```text
STRUCTURE      what the parts are
DEPENDENCIES   how they rely on each other
CHANGE         what happens when requirements move
RELIABILITY    what happens when things fail
DATA           who owns truth
SECURITY       who is allowed to do what
OPERATIONS     how it is run and recovered
```

**Structure** — separation of concerns · modularity · cohesion · loose coupling · encapsulation ·
information hiding · explicit boundaries · single responsibility

**Dependencies** — dependency direction · dependency inversion · stable dependencies · minimise
dependency surface · composition

**Change** — localise change · minimise accidental coupling · prefer simplicity · avoid speculative
complexity · prefer reversible decisions

**Reliability** — failure isolation · graceful degradation · explicit failure handling · bounded
resources · idempotency where required · recoverability

**Data** — explicit ownership · integrity · appropriate consistency · explicit lifecycle

**Security** — least privilege · defence in depth · secure by design · explicit trust boundaries ·
fail securely

**Operations** — observability · automation · repeatability · operational recoverability

Every principle in this handbook carries six faces, and the full catalog in **Chapter 67** gives
all of them for all 37:

> **Intent** tells you what the principle is for, so you can tell when it does not apply.
> **Good** and **Bad** make it concrete enough to argue about. **Trade-off** and **Failure mode**
> prevent dogma. **Apply** and **Validate** turn a belief into something a team can do and check.

### Principles collide — on purpose

| Tension | One side says | The other says | Resolve by |
|---|---|---|---|
| Modularity vs Simplicity | Separate for independent change | Fewer parts are easier to run | Which driver ranks higher, and the cost of reversing each |
| DRY vs Loose Coupling | Share the logic | Sharing creates a dependency | Must these consumers agree by definition? If not, duplicate |
| Strong consistency vs Availability | Never show wrong data | Always answer | Per workflow, not per system |
| Least privilege vs Operability | Narrow every permission | Incidents need reach | Pre-approved break-glass with audit |
| Fail securely vs Graceful degradation | Deny when the control fails | Keep serving | Classify the asset; catalogue and payments differ |

A team that cannot articulate these tensions will apply whichever principle it heard most recently.

### ✓ Checkpoint

- Name the family a principle belongs to and what it optimises for
- State the trade-off of any principle you invoke
- Identify two principles in tension in a real decision
- Describe how you would validate a principle in a codebase

---

## Chapter 19 — Applying Principles Without Becoming Dogmatic

> A principle applied without its intent is a superstition with good branding.

**Why this matters.** Most architectural damage done in the name of good practice is a principle
applied past the point where it helped.

```text
Principle
   ↓
Intent          why it exists
   ↓
Benefit         what it buys
   ↓
Trade-off       what it costs
   ↓
Failure mode    how it goes wrong
   ↓
When to apply
   ↓
When NOT to apply
```

### Worked correction — modularity

**Misreading:** “Create a module for everything.”

```text
  src/
   ├── user-name-formatter/
   ├── user-email-validator/
   ├── user-id-generator/
   ├── user-address-mapper/
   └── user-audit-logger/

Every change touches four modules.
Nobody can find anything. The boundaries encode nothing.
```

**Correct reading:** “Create meaningful boundaries where separation improves changeability,
ownership, reasoning or isolation.”

```text
  src/
   ├── identity/      owns users, auth, sessions
   ├── ordering/      owns orders, baskets, cut-off
   └── fulfilment/    owns picking, routes, delivery

A change to cut-off rules touches one module.
Each has an owner and one sentence of purpose.
```

The misreading optimises for a metric (module count) instead of the intent (independent change).
The correct reading can be checked: name a likely change and count the modules it touches.

### Four questions before invoking a principle

1. What is the intent of this principle, in one sentence, without jargon?
2. Which driver in our list does applying it serve?
3. What does applying it here cost — in parts, indirection, latency or operational surface?
4. What would have to be true for the opposite choice to be correct?

If question four produces nothing, you are not reasoning.

### Where principles stop

| Principle | Stops being helpful when | Better guidance then |
|---|---|---|
| Separation of concerns | The separated parts always change together | Merge them; the seam was imaginary |
| Dependency inversion | There is one implementation and no test need | Call it directly; add the interface when a second reason appears |
| Loose coupling | The indirection hides the only flow that matters | Make the flow explicit; readability is a real quality |
| Least privilege | Nobody can operate the system during an incident | Break-glass access with audit and expiry |
| Idempotency | The operation is naturally safe to repeat | Do not build keys for a read |
| Observability | Telemetry costs more than the insight it produces | Instrument boundaries and known incident questions only |

> **Common failure — the principle used as a veto.**
> ❌ “That violates separation of concerns” as the entirety of a review comment.
> *Why it fails:* it ends the conversation without transferring understanding. The useful form names
> the intent, the concrete consequence and a cheaper alternative: *“Pricing rules in the controller
> means the scheduled repricing job cannot reuse them — it will end up duplicated. Moving the rule
> to the domain costs one interface.”*

### ✓ Checkpoint

- State any principle’s intent, benefit, trade-off and failure mode
- Explain when a principle should not be applied
- Rewrite a dogmatic review comment as a reasoned one
- Detect optimisation of a proxy metric instead of the intent

---
---

# PART VI — ARCHITECTURE LENSES

*A principle tells you how architecture should be shaped. A lens tells you which concern you are
examining. Same architecture, different perspective.*

---

## Chapter 20 — The Architecture Lens Model

| **Principle** | **Lens** |
|---|---|
| How should this be shaped? | What concern am I examining? |
| Normative — pushes structure in a direction | Investigative — supplies a discipline’s questions |
| Answers *what should be true of the shape* | Answers *what have we not looked at* |

Nine standing lenses: Engineering · Product & Business · UX · Developer Experience · Security ·
Data · Reliability · Performance · Operations.
Three conditional lenses: Cost · Compliance · Accessibility.

```text
         PRODUCT       UX

    SECURITY   ◉   ENGINEERING
                SYSTEM
 DATA                    DX

    RELIABILITY   PERFORMANCE

           OPERATIONS
```

> **The depth rule.** Not every lens gets equal depth. Depth is driven by architectural risk and by
> the drivers you ranked in Chapter 16. Applying all nine at full depth to everything is how
> architecture review becomes a ceremony people learn to route around.

### Choosing depth

| Signal | Lens that deserves depth |
|---|---|
| Money, personal data or permissions are involved | Security, Data, Compliance |
| A user waits for the result | UX, Performance, Reliability |
| An external system is in the path | Reliability, Operations, Data |
| Several teams must coordinate to ship | Engineering, DX, Product |
| The area changes every sprint | Engineering, DX, Product |
| It runs unattended or overnight | Operations, Reliability, Data |
| Spend scales with usage | Cost, Performance |

### ✓ Checkpoint

- Explain the difference between a principle and a lens
- List the nine standing lenses and the three conditional ones
- Choose which lenses deserve depth for a given change
- Recognise when a review has only used one lens

---

## Chapter 21 — Engineering Lens

**Focus:** structure, cohesion, coupling, dependency direction, maintainability, testability,
changeability, complexity.

**Questions**
- Where are the boundaries, and what does each side own?
- Which direction do dependencies point, and is that direction stable?
- What has to change when a typical requirement changes?
- Can this be tested without standing up the whole system?
- What is accidental complexity here versus essential complexity?

**Evidence:** module/dependency graph · change-impact walkthrough for two real requirements ·
test pyramid and what each layer runs against.

### The change-cost walkthrough

```text
CHANGE            "Add a second delivery window per day"
Touches           ordering (cut-off rules), fulfilment (routes),
                  notification templates
Coordinated?      No — deployable independently
Contract change?  Yes — DeliverySlot gains a window id
Migration?        Yes — backfill existing slots
Verdict           Localised. Acceptable.

CHANGE            "Let farms set their own prices"
Touches           catalogue, ordering, billing, admin, reporting,
                  farm portal
Coordinated?      Yes — single release across six areas
Verdict           Not localised. The pricing boundary is wrong for
                  the product direction.
```

The second walkthrough is an architectural finding, produced without a single opinion about frameworks.

| Good | Weak |
|---|---|
| Dependencies point one way and a tool enforces it | Import graph contradicts the diagram |
| A typical change touches one module | Every change is a cross-team release |
| Business rules testable without infrastructure | Tests require a database and a network |
| Complexity present where the problem is complex | Accidental complexity accumulated by convention |

---

## Chapter 22 — Product & Business Lens

**Focus:** business capabilities, product evolution, domain boundaries, critical workflows,
business risk, value versus complexity.

**Questions**
- Which business capabilities does each part of the system serve?
- Which workflows must never break, and what is merely inconvenient?
- Where is the product most likely to change in the next four quarters?
- Does the structure match how the business talks about itself?
- Is the complexity we are buying proportional to the value?

```text
CAPABILITY                 OWNED BY            CHANGES
Browse & discover          catalogue           weekly
Subscribe & adjust basket  ordering            monthly
Confirm harvest            supply              seasonal
Take payment               billing             rarely
Pick & deliver             fulfilment          monthly

Rule of thumb: a capability that changes weekly should not share a
deployable with one that changes rarely unless something forces it.
```

> **Why value versus complexity belongs to this lens.** Engineering can tell you what a structure
> costs to build and run. Only product can tell you what it is worth. A decision that doubles
> operational surface to serve a capability worth 2% of revenue is not an engineering mistake — it
> is an unasked product question.

---

## Chapter 23 — UX Lens

**Focus:** user workflows, latency, state, failure experiences, interruptions, accessibility,
feedback, recovery.

**Questions**
- What does the user see while the system is waiting?
- What does failure look like from the user side, and can they recover?
- Where does user state live, and what happens if the session is interrupted?
- Is an asynchronous step honest about being asynchronous?
- Does the architecture make an accessible experience possible?

> **Architecture writes the failure UX.** By the time a designer sees the flow, the architecture has
> already decided whether a failure can be retried, whether the user loses their work, whether the
> result arrives later, and whether the system can tell the user what happened.

### Three states every workflow has

| State | Architectural question | Farm Commerce example |
|---|---|---|
| Waiting | Synchronous? What is the budget? What do we show? | Basket edit synchronous, 400 ms budget, optimistic UI with rollback |
| Failing | What can fail, and can the user act on it? | Payment declined is actionable; provider timeout retried silently until cut-off |
| Recovering | Can the user resume, and is anything lost? | Basket is server-side, so a lost connection loses nothing |

```text
DISHONEST                      HONEST

[Save] → spinner → done        [Save] → "Saved. Your farm
         (but the box is        confirmation arrives Friday
         not confirmed yet)     morning — we'll email you if
                                anything is substituted."

The architecture is async.     The architecture is async.
The UI pretends it is not.     The UI says so.
```

---

## Chapter 24 — Developer Experience Lens

**Focus:** discoverability, local development, contracts, tooling, debugging, consistency,
architecture discoverability, safe change.

**Questions**
- Can a new engineer find where a capability lives within an hour?
- Can the system be run locally, or a useful slice of it?
- Are contracts explicit enough to work against without reading implementations?
- When something breaks, how long does it take to find out where?
- Is the safe way to make a change also the easy way?

Ask a new engineer to answer three questions using only the repository: where does ordering live,
what is it allowed to depend on, and where is that written down? The time they take is a direct
measurement of your architecture’s discoverability.

| Good | Weak |
|---|---|
| Structure visible from the directory layout | Architecture lives in last year’s slide deck |
| Boundaries documented next to the code they govern | Rules known only to a few people |
| A guardrail catches a violation in seconds | Violations caught by a reviewer’s memory |
| The conventional path is the correct path | Doing it correctly requires folklore |

> **Common failure — the tribal boundary.** ❌ A boundary that exists only in senior engineers’ heads.
> *Why it fails:* it degrades at exactly the rate people join and leave. Every violation is reasonable
> from the violator’s point of view, because nothing in the system said otherwise.

---

## Chapter 25 — Security Lens

**Focus:** identity, authentication, authorization, trust boundaries, secrets, tenant isolation,
data protection, threats, abuse cases, auditability.

**Questions**
- Where are the trust boundaries, and what is validated as data crosses them?
- Where is authorization enforced — and is it enforced only there?
- How does identity flow through asynchronous and background work?
- What happens if one tenant is compromised?
- What would an attacker do with this component, and would we know?

```text
┌─ UNTRUSTED ─────────────────────────────────────────────┐
│  (CUSTOMER)      (FARM STAFF)      ╌╌PAYMENT PROVIDER╌╌ │
└──────┬───────────────┬────────────────────┬─────────────┘
       │ HTTPS+session │ HTTPS+role         │ signed webhook
┌──────▼───────────────▼────────────────────▼─────────────┐
│ TRUSTED — OUR CONTROL                                    │
│                      ┌───────┐                           │
│                      │  API  │ authenticates, resolves   │
│                      └───┬───┘ principal, authorises     │
│           ┌──────────────┴───────────────┐               │
│           ▼                              ▼               │
│      ┌────────┐                    ╭──────────╮          │
│      │ DOMAIN │ enforces invariants│ DATABASE │ scoped   │
│      └────────┘                    ╰──────────╯ grants   │
└──────────────────────────────────────────────────────────┘
```

> **“It is internal” is not a security property.** It is a network fact, and network facts change
> with every new integration, VPN, debugging tool and acquisition.

---

## Chapter 26 — Data Lens

**Focus:** ownership, source of truth, lifecycle, consistency, integrity, replication, migration,
retention, privacy.

**Questions**
- Who owns each entity, and who is merely a reader?
- Where is the source of truth, and what are copies?
- What consistency does each workflow actually require?
- How does this data get created, corrected, archived and deleted?
- What is the migration path when the model changes?

### The ownership table

| Entity | Owner | Readers | Consistency | Retention |
|---|---|---|---|---|
| Product / availability | Catalogue | Ordering, Web | Eventual (seconds) | Current season + 2 years |
| Basket | Ordering | Web | Strong | Until cut-off + 30 days |
| Order | Ordering | Billing, Fulfilment | Strong | 7 years (tax) |
| Harvest confirmation | Supply | Ordering, Fulfilment | Strong within farm | 2 years |
| Payment intent | Billing | Ordering (read) | Strong | 7 years |
| Delivery route | Fulfilment | Partner export | Eventual | 90 days |
| Customer profile | Identity | All (via API) | Strong | Until deletion request + 30 days |

Short, boring, and it prevents more incidents than most architecture diagrams. Two owners for one
entity is always a finding.

> **Common failure — consistency by infrastructure default.**
> ❌ Everything eventually consistent because the platform is, or everything in one transaction
> because the ORM makes that easy. *Why it fails:* consistency is a per-workflow requirement.

---

## Chapter 27 — Reliability & Resilience Lens

**Focus:** failure modes, dependency failure, partial failure, retries, timeouts, idempotency,
recovery, degradation.

**Questions**
- What happens when each dependency is slow, then unavailable?
- Which operations are safe to retry, and what makes them safe?
- What does partial success look like, and who reconciles it?
- What degrades, and what must never degrade?
- How does the system come back after a total outage?

### Failure simulation — checkout path

`USER → API → ORDERING → PAYMENT → DATABASE`

**Payment timeout** *(provider slow, times out at 800 ms)*
Expected: the call is abandoned at the timeout, not retried inline. The order is saved as
`payment_pending` with an idempotency key. A background worker reconciles against the provider. The
customer sees “payment confirming” rather than an error.
*Makes it possible:* bounded resources, idempotency, failure isolation.
*Without it:* inline retries hold web workers, the pool exhausts, and a slow partner becomes a full outage.

**Database unavailable**
Expected: writes fail fast with a clear error; reads served from cache where safe; catalogue stays
browsable; checkout explicitly disabled with an honest message; no partial order created.
*Requirement:* the degraded mode must be a designed, tested path. Degradation that has never been
exercised does not exist.

**Duplicate request** *(double-click, or client retry after timeout)*
Expected: the second request carries the same idempotency key, matches the stored result, and
returns the original response. Exactly one capture exists.
*Watch for:* server-generated keys (useless), keys without stored results, key lifetime shorter than
the retry window.

**Network failure mid-capture** — the genuinely hard one
Money may have moved without our knowing. Expected: the order sits in an explicit reconciling state;
the worker queries the provider by idempotency key; the webhook is a second, independent source of
truth. The customer is told only what we are certain of.
*Requirement:* the state machine must have a state for “we do not know yet”. Systems without it
invent one in production, badly.

---

## Chapter 28 — Performance & Scalability Lens

**Focus:** latency, throughput, concurrency, resource consumption, hot paths, growth, capacity,
bottlenecks.

**Questions**
- What is the latency budget for the critical path, per hop?
- What is the expected and peak throughput, and where does it break?
- Which resources are contended, and what serialises?
- What grows fastest, and what breaks first when it does?
- What have we measured, and what have we assumed?

```text
LATENCY BUDGET — basket edit (p95 target 400ms)

Browser → CDN/edge                   20ms
Edge → API                           15ms
API auth + principal resolution      10ms
Ordering: load basket                25ms
Ordering: apply rule + validate      15ms
Persist basket                       35ms
Publish basket-changed (async)        0ms   ← off the path
Response serialisation               10ms
Network back                         35ms
                                    -----
                                    165ms   headroom 235ms

RULE: anything that would consume headroom must either be moved off
the critical path or challenged as a requirement.
```

A budget converts an argument about speed into arithmetic, and shows what a “small” synchronous
addition really costs.

| Good | Weak |
|---|---|
| Measured budget per user-visible operation | “It is fast enough” with no number |
| Peak, not average, used for capacity | Capacity sized on averages |
| Known bottleneck with a named next bottleneck | Caching added before the bottleneck is known |
| Load tested at expected and 3× volume | First load test is the launch |

---

## Chapter 29 — Operations Lens

**Focus:** deployment, configuration, observability, incident response, recovery, rollback,
capacity, operational complexity.

**Questions**
- How is this deployed, and can it be deployed independently?
- How would we know it is unhealthy before a user tells us?
- What does rollback mean here, especially with data changes?
- Who is paged, and what do they do first?
- How much operational surface are we adding, and who carries it?

> **Operational surface is a design output.** Each new runtime component adds deployment,
> configuration, monitoring, alerting, on-call knowledge, upgrade work and one more thing to be woken
> up by. It is completely legitimate for this to eliminate an otherwise elegant design.

### Operational readiness — per component

- [ ] Deployable independently, or the coupling is deliberate and documented — *evidence: a deployment plan naming what must ship together and why*
- [ ] Configuration declared, versioned, environment-specific — *evidence: config in version control; no hand-edited production values*
- [ ] Health observable before users notice — *evidence: a signal that would have fired for the last three real incidents*
- [ ] Failures attributable to a boundary — *evidence: correlated logs or traces following one request across components*
- [ ] Rollback defined, including data changes — *evidence: a rehearsed rollback with backward-compatible migrations*
- [ ] Someone named as on-call — *evidence: rota entry plus a runbook with an unambiguous first step*
- [ ] Capacity has a headroom number and a growth trigger — *evidence: current utilisation, threshold, and what happens at it*

---

## Chapter 30 — Cost, Compliance & Accessibility Lenses

A conditional lens is not a lesser lens. When its trigger is present it may be the *dominant* lens —
a residency requirement can determine the entire deployment topology. The discipline is in naming
the trigger.

| Lens | Apply when | Skip when — and record that you did |
|---|---|---|
| Cost | Spend scales with usage; committed capacity; multi-region; large retention | Fixed small footprint with predictable cost |
| Compliance | Regulated data or industry; audit obligations; residency; contractual evidence | No regulated data and no contractual audit obligation |
| Accessibility | Any human-facing interface; public sector; timing-sensitive or async UI | No human interface (internal tools still have humans) |

**Cost questions:** What does one unit of work cost, and how does that scale? Which costs are fixed
commitments and which track usage? What is the cost of operational effort, not just infrastructure?
Which cheap decision today becomes an expensive commitment later?

**Compliance questions:** Which regulation applies, to which data, in which jurisdiction? What
evidence must the system produce, and for how long? Where must data physically reside? Which actions
require separation of duties?

**Accessibility questions:** Do architectural timeouts conflict with users who need more time? Does
the rendering strategy preserve semantics and focus? Are errors expressed as data the interface can
render accessibly? Do asynchronous updates announce themselves?

> **Recording a skip is part of the review.** “Compliance lens not applied — no regulated data in
> this capability; revisit if payment or health data enters scope” is a valid, valuable, auditable
> review output.

---

## Chapter 31 — Cross-Lens Architecture Review

```text
              Architecture Decision
                       │
       ┌──────┬──────┬─┴────┬──────┬──────┐
  Engineering Product UX    DX  Security Data
       └──────┴──────┴──┬───┴──────┴──────┘
            Reliability • Performance • Operations
```

### The lens matrix

| Concern | Eng | Prod | UX | DX | Sec | Data | Rel | Perf | Ops |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Boundary clarity | ✓ | ✓ | — | ✓ | ✓ | ✓ | — | — | — |
| Identity & trust flow | — | — | — | — | ✓ | — | — | — | — |
| Failure handling | ✓ | — | ✓ | — | — | — | ✓ | ✓ | ✓ |
| Observability | ✓ | — | — | ✓ | ✓ | — | ✓ | — | ✓ |
| Dependency structure | ✓ | — | — | ✓ | — | — | — | ✓ | ✓ |
| Data ownership | — | — | — | — | ✓ | ✓ | — | — | — |
| Latency budget | — | — | ✓ | — | — | — | ✓ | ✓ | — |
| Cost of change | ✓ | ✓ | — | ✓ | — | ✓ | — | ✓ | — |
| Recovery path | — | — | ✓ | — | — | ✓ | ✓ | — | ✓ |
| User-visible behaviour | — | ✓ | ✓ | — | — | — | — | — | — |

Concerns with several ticks are where cross-discipline disagreement lives — review those jointly.

### Running the review

1. State the decision or change in one sentence.
2. Select lenses by risk and by the ranked drivers — not all of them, every time.
3. For each selected lens, ask its questions and record the evidence, or record that evidence is missing.
4. Collect concerns appearing under two or more lenses; discuss those jointly.
5. Record findings as: accepted · accepted with a risk · needs evidence · blocked.
6. Write down the skipped lenses with the trigger that would bring them back.

> **Common failure — the round-table review.** ❌ Eight people give general impressions for ninety
> minutes. *Why it fails:* without lenses, the loudest concern wins and whole categories go
> unexamined. With lenses, each participant has defined questions and a defined kind of evidence.

### ✓ Checkpoint

- Select lenses by risk rather than by habit
- Use the matrix to find concerns that need cross-discipline discussion
- Produce findings with evidence status rather than opinions
- Record which lenses were skipped and why


---
---

# PART VII — FROM PRINCIPLES TO STANDARDS

*A principle nobody can check is a preference. This part is the machinery that turns reasoning into
something a codebase actually obeys.*

---

## Chapter 32 — Principles → Standards

Each step removes ambiguity and adds enforceability.

```text
PRINCIPLE      Separation of Concerns
    ↓
INTENT         Keep business rules independently changeable from
               transport and storage
    ↓
STANDARD       Business logic must not depend on transport or
               persistence mechanisms
    ↓
RULE           Domain modules must not import web framework or
               database driver packages
    ↓
PATTERN        Application → Domain → Repository abstraction;
               adapters at the edges
    ↓
GUARDRAIL      Dependency-boundary validator with an allow-list
               per module
    ↓
VALIDATION     CI architecture check; violations fail the build
               with the rule cited
```

### What each step must not do

| Step | Adds | Must not |
|---|---|---|
| Principle | Direction and reasoning | Pretend to be a law |
| Intent | The reason that survives technology change | Be phrased in terms of a tool |
| Standard | A normative, testable statement | Specify one implementation |
| Rule | Mechanical decidability | Require judgement |
| Pattern | A proven way to comply | Become mandatory by stealth |
| Guardrail | Cheap compliance, expensive violation | Be bypassable without a trace |
| Validation | Evidence the rule holds | Run only on request |

> **Why the pattern must stay optional.** The moment a pattern becomes mandatory, teams comply with
> its shape and abandon its intent — repository classes that pass raw SQL through, hexagons with the
> database in the middle. Keep the standard binding and the pattern recommended.

### Two more chains

**Explicit Data Ownership**

```text
PRINCIPLE   Exactly one component owns each entity and its rules
INTENT      Make the rules for an entity enforceable in one place
STANDARD    Each entity has exactly one owning module; others read
            through a published contract
RULE        No module may write to a table owned by another module
PATTERN     Owner exposes commands; consumers use the API or
            subscribe to published events
GUARDRAIL   Per-module database credentials with write grants only
            on owned tables
VALIDATION  Schema-ownership test plus periodic grant audit
```

**Explicit Trust Boundaries**

```text
PRINCIPLE   Name where trust changes; validate what crosses
INTENT      No component inherits trust by being inside the network
STANDARD    Every entry point authenticates the caller and
            authorises the action
RULE        No handler may execute a domain command without a
            resolved principal in context
PATTERN     Authenticate at the edge; authorise in the application
            service; scope every query by tenant
GUARDRAIL   Command bus rejects any command without an
            authorisation decision attached
VALIDATION  Contract tests calling every endpoint unauthenticated;
            audit log completeness check
```

| Good | Weak |
|---|---|
| Standards state outcomes, not tools | Standards written as tool mandates |
| Rules are checkable by a machine | Rules that need a human to interpret |
| Guardrails run in CI and locally | Checks that only run on request |
| Exceptions recorded, scoped and dated | Exceptions granted verbally and forgotten |

### ✓ Checkpoint

- Convert a principle into a standard, a rule and a guardrail
- Explain why a pattern must not be mandatory
- Design a validation that closes the loop
- Write an exception that expires

---

## Chapter 33 — Architecture Standards

A standard has four parts and fits on half a page: **statement** (what must be true), **rationale**
(which principle and driver it serves), **verification** (how compliance is checked), and
**exception path** (who may grant one, for how long).

```markdown
# ARC-004 — Single Writer per Entity
Status: Active   Since: 2026-03-01   Owner: Platform

## Statement
Each persisted entity has exactly one owning module. Other modules
must not write to it; they use the owner's API or subscribe to its
published events.

## Rationale
Principle: Explicit Data Ownership. Driver: payment correctness —
invariants must be enforceable in one place.

## Verification
- Per-module DB credentials; write grants on owned tables only
- CI check: schema-ownership map vs migration diff

## Exceptions
Granted by: Platform lead. Max duration: one quarter.
Current: EX-11 reporting read-replica writes to `report_cache`
until 2026-09-30 (ADR-014).
```

Notes on the example: standards get **identifiers**, because an unnumbered standard cannot be cited
from an ADR, a review finding or a guardrail failure. The statement constrains *writing*, not
reading — the narrowest statement that achieves the intent. Verification has two layers, a
preventive control (grants) and a detective one (CI); prefer controls that make violation
impossible. Exceptions are scoped, dated and owned — an exception without an expiry becomes a
second, undocumented standard.

### What standards can cover

| Area | A standard here typically says | Verified by |
|---|---|---|
| Project structure | Where capabilities live and how modules are named | Directory lint, scaffolding |
| Dependency boundaries | Which module may depend on which, and in which direction | Import graph check in CI |
| API conventions | Resource shape, errors, pagination, versioning, idempotency | Schema lint, contract tests |
| Data access | Who writes what; scoping; transaction rules | Grants, schema-ownership check |
| Security | Authentication, authorisation location, secrets, tenant scoping | Policy tests, secret scanning |
| Logging | Structure, correlation identifiers, what must never be logged | Log schema validation, PII scan |
| Errors | Taxonomy, machine-readable codes, transport mapping | Contract tests |
| Configuration | Declared, environment-specific, no secrets in code | Config schema check, scanning |
| Observability | Required signals per boundary | Dashboard/alert coverage check |
| Deployment | Independence, migration compatibility, rollback | Pipeline gates |
| Testing | What must be testable without infrastructure | Test layer rules in CI |
| Documentation | What must exist for a capability to be done | Docs-as-code checks |
| Naming | Domain language, consistency across API and storage | Review plus lint where feasible |
| Integration | Anti-corruption at external boundaries, retry and idempotency | Adapter structure checks |

> **Keep the set small.** Twelve standards everyone knows beat forty nobody reads. If a rule can be
> enforced by a tool without anyone learning it, prefer the tool and leave it out of the standards
> document — standards are for the things humans must hold in their heads.

---

## Chapter 34 — Patterns & Reference Architectures

| **Standard** | **Pattern** |
|---|---|
| What must be true | One way to make it true |
| Binding, outcome-shaped, survives technology change | Recommended, structure-shaped, replaceable |
| *“Business logic must not depend on transport or persistence.”* | *“Application → Domain → Repository with adapters at the edges.”* |

### Selecting a pattern

1. Name the problem the pattern claims to solve — in your words, not the pattern’s.
2. Check that you have that problem, evidenced by a driver.
3. Read the pattern’s costs, not only its benefits: operational surface, latency, cognitive load, failure modes.
4. Check the assumptions it makes about team size, traffic shape and data volume.
5. Decide what you will do if it turns out to be wrong — and how expensive that is.

| Pattern | Solves | Costs | Do not use when |
|---|---|---|---|
| Layered (app/domain/infra) | Rules independent of delivery mechanism | Indirection; can become ceremony | Thin CRUD adapter with no rules |
| Modular monolith | Boundaries without distribution | Boundaries need enforcement or they erode | Teams genuinely need independent deploy cadence |
| Service per capability | Independent deploy, scaling, ownership | Network failure, data distribution, operational surface | Fewer teams than services; no operations capacity |
| Event-driven integration | Decoupling producers from consumers | Eventual consistency, ordering, replay, debugging | A strongly consistent answer is required now |
| CQRS | Divergent read and write models | Two models, sync lag, more code | Reads and writes fit one model comfortably |
| Outbox | Atomic state change plus publication | A relay component and its operations | No cross-component publication needed |
| Saga / process manager | Multi-step workflows without distributed transactions | Compensation logic, state machine, visibility | A single transaction would do |
| Anti-corruption layer | Stops a foreign model leaking inward | Translation code to maintain | The external model is genuinely a good fit |
| Cache-aside | Reduces load and latency | Staleness, invalidation, one more failure mode | The bottleneck has not been measured |

> **Common failure — the pattern that arrived before the problem.**
> ❌ Adopting event-driven integration to “decouple”, in a system with one team and one database.
> *Why it fails:* the coupling was never the constraint; the cost is paid in full regardless. Then a
> consistency requirement arrives and is met with a synchronous call over the event bus, which has
> all the costs of both approaches.

**Reference architectures** must arrive with their drivers and constraints attached. Adopting one
means checking that yours match — and recording the differences.

---
---

# PART VIII — ARCHITECTURE INITIALIZATION

*You have a new project. This part takes you from “we have a problem” to “we have a defensible
baseline”.*

---

## Chapter 35 — Starting a New Project

```text
Understand product
       ↓
Identify drivers
       ↓
Identify constraints
       ↓
Identify principles
       ↓
Identify relevant lenses
       ↓
Establish system boundary
       ↓
Define initial architecture
```

| Step | Output | The trap |
|---|---|---|
| Understand product | Input brief (Ch. 15) | Accepting the feature list as the problem statement |
| Identify drivers | Ranked, measured drivers (Ch. 16) | Everything is a driver, so nothing is |
| Identify constraints | Register (Ch. 17) | Recording preferences as constraints to win an argument |
| Identify principles | A short list your team will use | Adopting all 37 and applying none |
| Identify lenses | Which get depth, which are skipped | Applying all of them shallowly |
| Establish boundary | Context diagram (Ch. 36) | Drawing internals before the edge is agreed |
| Define initial architecture | Containers and major components (Ch. 37) | Designing level 4 on day two |

> **Pick five to eight principles, not thirty-seven.** Choose the ones your ranked drivers demand,
> write them where engineers will see them, and make two or three enforceable.

### Farm Commerce — principles chosen and why

| Principle | Chosen because | Enforced by |
|---|---|---|
| Explicit Data Ownership | Payment correctness needs invariants in one place | Per-module DB grants + CI check |
| Separation of Concerns | Cut-off rules must be reusable by API, worker and admin | Dependency-boundary validator |
| Idempotency Where Required | Money moves on a retryable path | Idempotency key required by the command bus |
| Prefer Simplicity | Four engineers, no operations specialist | Component count is a reviewed number |
| Graceful Degradation | A weekly cut-off means downtime has a deadline | Degraded modes tested in staging |
| Observability | No operations specialist; the system must explain itself | Required signals per boundary |

---

## Chapter 36 — Establishing System Context

The context view answers one question: **what is ours, what is not, and what crosses between?** It
is the cheapest architecture artifact to produce and the most expensive one to skip.

```text
   (CUSTOMER)        (FARM STAFF)        (ADMIN)
        │ browse,          │ availability,      │ manage
        │ order, pay       │ harvest            │
        └────────────┬─────┴────────────────────┘
                     ▼
            ┌──────────────────┐
            │  FARM COMMERCE   │   the system we are building
            └───┬────────┬─────┘
    authorise/  │        │ routes (batch 06:00)   │ notify
    capture     ▼        ▼                        ▼
   ╌╌PAYMENT PROVIDER╌╌ ╌╌DELIVERY PARTNER╌╌ ╌╌EMAIL / SMS╌╌
```

### What to record for every external system

- **Ownership** — who can change it, and how much notice we get
- **Protocol and shape** — synchronous, batch, webhook, file
- **Failure behaviour** — what it does when unhealthy, and what its SLA actually promises
- **Trust** — what we must validate on the way in
- **Data** — what it holds that we depend on, and who owns the truth
- **Exit cost** — what replacing it would take

```text
EXTERNAL SYSTEM — Delivery Partner
Ownership      Partner; 30 days notice on API change (contract §7)
Protocol       SFTP route file 06:00; status poll hourly
Failure        No acknowledgement path; a rejected file is only
               discovered on the next poll
Trust          Untrusted input; status records validated on read
Data           They own delivery status; we own the route
Exit cost      High — two competitors, both batch; 3 months
```

> **Common failure — context drawn as a first draft of the internals.**
> ❌ A “context diagram” containing the API, the worker and the database.
> *Why it fails:* the conversation skips to internal structure, and the genuinely dangerous external
> facts never get examined. Keep the system a single box until the edge is agreed.

---

## Chapter 37 — Establishing the Initial Architecture

Work outside in, one level at a time, and let each level be challenged before drawing the next.
Each step below adds exactly one idea, and names the driver that forced it.

**Step 1 — the honest picture.** `CUSTOMER → SYSTEM`
Nothing has been decided yet. This is a deliberate refusal to design.

**Step 2 — separate delivery from logic.** `CUSTOMER → WEB → API`
*Driver:* three client types (customer web, farm portal, admin) need the same rules. The split is
forced by reuse, not by fashion.

**Step 3 — give truth a home.** `CUSTOMER → WEB → API → DATABASE`
*Driver:* payment correctness. Order invariants need a single owner and a single source of truth.

**Step 4 — push the external provider off the critical path.**
*Driver:* zero duplicate captures, and a provider that can be slow. The call is bounded and retried
outside the request.

**Step 5 — add a worker for everything that must not block a user.**
*Driver:* harvest substitution, payment reconciliation, route export and notifications are all slow,
retryable or scheduled. Failure isolation demands they leave the request path.

**Step 6 — the initial architecture.**

```text
 (CUSTOMER)                              (FARM STAFF)
      │                                       │
      ▼                                       │
  ┌───────┐                                   │
  │  WEB  │                                   │
  └───┬───┘                                   │
      └──────────────┐        ┌───────────────┘
                     ▼        ▼
                 ┌─────────────┐   enqueue    ┌──────────┐
                 │     API     │ ╌╌╌╌╌╌╌╌╌╌▶ │  WORKER  │
                 └──────┬──────┘              └────┬─────┘
                        │                          │
              ╭─────────▼────────╮        ╌╌╌╌╌╌╌╌▼╌╌╌╌╌╌╌╌
              │     DATABASE     │        ╎ PAYMENT PROVIDER ╎
              ╰──────────────────╯        ╌╌╌╌╌╌╌╌┬╌╌╌╌╌╌╌╌
                                                   │
                                          ╌╌╌╌╌╌╌╌▼╌╌╌╌╌╌╌╌
                                          ╎ DELIVERY PARTNER╎
                                          ╌ route file 06:00╌
```

Five runtime pieces, each with a named driver. This is where initialization stops. Module boundaries
inside the API are the next level down — Chapter 44’s business, not today’s.

> **Why each step names a driver.** Because that is the review. Any element that cannot name the
> driver it serves is a candidate for removal — and this is the only moment when removing it is cheap.

### How far down to go

- **Go deep enough** that a team can start work without inventing architecture on the fly
- **Stop** before designing the internals of a component nobody has built yet
- **Go deeper only where risk is** — payment reconciliation deserves detail now; the admin catalogue screen does not
- **Record what you deliberately did not decide**, as an open question with the trigger that will force it

---

## Chapter 38 — Architecture Baseline

### What a baseline must minimally establish

Seventeen items. Not seventeen documents — several are a paragraph and two are a name.
The test is whether the architectural contract is established, not whether the folder is full.

1. **Architecture context**
2. **Architecture overview**
3. **Major structural boundaries**
4. **Key architectural patterns**
5. **Runtime / behavioural model**
6. **Data and integration boundaries**
7. **Quality attributes with measures**
8. **Security and trust boundaries**
9. **Reliability and failure strategy**
10. **Deployment model**
11. **Key architectural decisions**
12. **Constraints**
13. **Assumptions**
14. **Open questions**
15. **Validation / evidence**
16. **Owner and reviewer**
17. **Baseline status and version**

> **Sufficient, not exhaustive.** A baseline does not require every possible diagram. It
> requires enough for a competent engineer to build against it, and enough for a reviewer to
> disagree with it specifically. Volume is not the measure; *disagreeability* is.

The baseline is the maintained answer to “what is this system, and why is it like this?”

| Part | Satisfied by | Weak version |
|---|---|---|
| Context | Context view + externals table (ownership, protocol, failure, trust, exit cost) | A diagram of internal services labelled “context” |
| Drivers | 3–7 ranked drivers, measured, each traceable to a decision | A list of adjectives, all high priority |
| Constraints | Register separating constraints, assumptions and unknowns | Preferences recorded as constraints |
| Boundaries | Each named, with what crosses and how it is enforced | Boundaries that exist only in the diagram |
| Architecture | Container structure; every element names a driver and an owner | A technology list arranged in boxes |
| Quality attributes | Targets with numbers and the workflow each applies to | “Highly available and scalable” |
| Decisions | An ADR per consequential decision, rejected alternatives preserved | Decisions recalled by whoever attended |
| Assumptions | Owner, date, impact-if-wrong, review date | Assumptions stated as facts |
| Open questions | Each names the decision it blocks, an owner, a due date | Zero open questions — which usually means nobody asked |

> **Open questions belong in the baseline.** A baseline with three open questions listed is stronger
> than one with none, because the second is almost certainly lying.

```text
BASELINE v1.2 — Farm Commerce Platform      2026-04-18

MAJOR STRUCTURE
  Web        customer + farm portal (SSR)     owner: Product eng
  API        ordering, catalogue, supply,     owner: Platform
             billing coordination
  Worker     payment capture, substitution,   owner: Platform
             route export, notifications
  Database   single primary, per-module       owner: Platform
             write grants

BOUNDARIES
  Public edge        authenticate, validate, rate limit
  Domain boundary    authorised commands only
  Data ownership     one writer per entity (ARC-004)

DECISIONS      ADR-001 modular monolith
               ADR-002 cut-off as an ordering invariant
               ADR-003 harvest confirmation is async
               ADR-004 payment capture via worker + idempotency

OPEN QUESTIONS
  Q1  Same-day delivery in year two?   blocks: ordering boundary
  Q2  Cross-border tax treatment?      blocks: pricing model
  Q3  Farm-managed pricing?            blocks: catalogue ownership
```

---

## Chapter 39 — Architecture Baseline Gate

Ten criteria to pass before substantial delivery begins. Each has evidence that satisfies it.

| # | Criterion | Evidence that satisfies it |
|---|---|---|
| 1 | System boundary is defined | A context view that a product person and an engineer describe the same way, plus an explicit out-of-scope list |
| 2 | Major actors are identified | Every actor named with what they need; no undifferentiated “users” |
| 3 | Major capabilities are understood | A capability list mapped to structure |
| 4 | Major dependencies are identified | Externals table with ownership, protocol, failure, trust, exit cost |
| 5 | Architectural shape is established | Container structure where every element names its driver |
| 6 | Drivers identified and ranked | 3–7 drivers, measured where possible, each traceable to a decision |
| 7 | Important risks are identified | A risk entry per high-impact assumption or unknown, with impact and trigger |
| 8 | Significant decisions are recorded | An ADR per expensive-to-reverse decision, rejected options preserved |
| 9 | Documentation exists and is findable | Baseline stored where engineers work, linked from the repository |
| 10 | Owner and reviewer identified | A named accountable owner and a reviewer who is not the author |

> **What a gate is not.** Not a sign-off ceremony, a date to defend, or a promise the architecture is
> correct. It is a check that *enough uncertainty has been removed to proceed safely*. Failing a gate
> is a normal, useful outcome: it names exactly what to do next.

### Failing well

| Failed item | Usual real cause | Next action |
|---|---|---|
| Boundary undefined | Product scope genuinely unsettled | Timebox a scope decision; record the assumption you proceed on |
| Drivers unranked | Nobody will say no to a stakeholder | Force a ranking in one session with the trade-off explicit |
| No decisions recorded | Decisions were made implicitly | Reverse-engineer two or three ADRs from the current design |
| Risks not identified | Assumptions never separated from facts | Run Chapter 17 on the current understanding |
| No reviewer | No second architect available | Use a senior engineer from an adjacent team; outside eyes matter more than title |

---
---

# PART IX — ARCHITECTURAL DECISION-MAKING

*Decisions are the durable part of architecture. Structures change; the reasoning is what lets the
next person change them safely.*

---

## Chapter 40 — What Is an Architectural Decision?

| | Means | Example |
|---|---|---|
| **Fact** | Verifiable and true now | The partner API accepts a batch file at 06:00 |
| **Assumption** | Believed, unverified | Under 20,000 households in year one |
| **Preference** | A taste, held by a person | “I would rather use this framework” |
| **Decision** | A commitment among options | One deployable with enforced module boundaries |
| **Constraint** | Must be true; not ours to change | Card data must never reach our systems |
| **Standard** | Normative across the organisation | Each entity has exactly one writing owner |

### The test for architectural significance

A decision is architecturally significant if any of these is true:

- It is **expensive to reverse** — measured in weeks or in data migration
- It **constrains other decisions** — removing options from people not in the room
- It **crosses a boundary** — between teams, systems, or trust levels
- It **affects a quality attribute** that appears in your drivers
- It **changes who owns what** — data, capability or operational responsibility

> **The cheapest possible test.** Ask: “if we get this wrong, what does fixing it look like?” If the
> honest answer involves a migration, a coordinated release, or a conversation with a customer, write
> it down as a decision.

---

## Chapter 41 — Decision Framework

```text
Problem
   ↓
Options        at least three, one of which is "do nothing"
   ↓
Criteria       derived from drivers, not invented here
   ↓
Evidence       proportional to consequence and uncertainty
   ↓
Trade-offs     what each option costs, stated plainly
   ↓
Decision       one option, chosen, with a date
   ↓
Consequences   what becomes easy, hard, impossible; exit cost
```

### Worked decision — ADR-001, how should the system be decomposed?

**Problem.** We need a structure that lets four engineers deliver weekly while keeping ordering
invariants enforceable and payment correct. The catalogue changes weekly; ordering rules monthly;
billing rarely.

**Drivers.** Small team, no operations specialist · payment correctness · weekly cut-off peak ·
seasonal catalogue change.

**Criteria** (derived from those drivers). Operability with 4 engineers · invariant enforceability ·
independent change · peak scalability · exit cost.

**Option A — single application, no internal boundaries.**
Fastest to start and simplest to operate. Invariants erode quickly because nothing stops any code
writing any table; within two quarters ordering rules are applied in three places. Exit cost is high
precisely because the boundaries were never there to cut along.

**Option B — modular monolith with enforced boundaries.**
Operationally simple, invariants enforceable, boundaries real enough to split later. Costs
discipline: the guardrails must exist from the start or the modules become folders. Scaling is
coarse-grained — the whole application scales together, which the cut-off peak makes acceptable but
not free.

**Option C — service per capability.**
Maximum independence and precise scaling. Buys five deployment pipelines, distributed failure modes,
cross-service data consistency and an on-call surface four engineers without an operations
specialist cannot carry. Invariant enforcement gets harder, because ordering now spans a network.

**Evidence.** A cut-off load test against a single application at 40× median write rate reached p95
210 ms with 35% headroom — the peak driver does not require per-capability scaling. A one-week spike
implemented the dependency-boundary validator and per-module grants, proving the guardrails are
cheap enough to be real.

**Decision.** Option B. Modules: identity, catalogue, ordering, supply, billing, fulfilment.
Ownership enforced by per-module database grants and a CI dependency check.

**Consequences.** *Easy:* one pipeline, one on-call surface, transactional invariants inside a
module, low-friction refactoring of boundaries while they are still cheap. *Hard:* independent
scaling per capability; independent release cadence per team. *Impossible without revisiting:* a
team that needs to deploy on its own schedule without coordination. *Exit:* moderate — because
modules own their data and boundaries are enforced, extracting one is a scoped project rather than
an excavation. *Revisit when:* a second team forms, or one capability needs a materially different
scaling profile.

> **On scoring.** If you use criterion scores, treat them as a communication device, not a
> calculation. Do not sum them, do not weight them, and never let a total pick the option. The moment
> a number decides, people tune the numbers.

**Always include “do nothing”.** Deferring is legitimate only when you can state three things: what
you are waiting for, what it costs to wait, and what triggers the decision. Otherwise “we will decide
later” is a decision to let the system decide for you.

---

## Chapter 42 — Architecture Decision Records

```text
CONTEXT → PROBLEM → OPTIONS → CRITERIA → EVIDENCE → DECISION → CONSEQUENCES
```

### ADR-004 — Payment capture occurs in a worker, keyed by idempotency

**Context.** Baskets remain editable until Thursday 18:00. Capture happens after the cut-off against
a final basket. The provider’s p99 is 1.4 s and it occasionally times out while still completing the
capture on its side. We have no operations specialist and one on-call rotation.
*What this section is for:* the situation a future reader will no longer remember.

**Problem.** Where should payment capture execute, and how do we guarantee that a network failure, a
retry or a duplicate request cannot produce two captures for one order?
*What this section is for:* one question, answerable. If it contains “and”, it is probably two ADRs.

**Drivers.** Payment correctness — zero duplicate captures (High) · weekly cut-off peak — capture
volume concentrates after 18:00 · small team — no appetite for a component needing bespoke care.

**Options considered.**
1. *Synchronous capture in the request* — simplest control flow; couples user-facing latency to provider latency; retries unsafe without keys anyway.
2. *Worker with idempotency keys* — capture leaves the request path; retry is safe; adds a worker and a reconciliation path.
3. *Provider-driven via webhooks only* — least code; depends entirely on webhook delivery, which is at-least-once and occasionally delayed by hours.

*What this section is for:* proof that alternatives existed. An ADR with one option is an announcement.

**Decision criteria.** Can a duplicate capture occur under retry, double-submit or partition? Does
provider latency reach the user? How many new runtime components and failure modes? Can we detect
and reconcile an unknown outcome?

**Evidence.** A two-day spike replayed 10,000 captures with duplicate keys against the provider
sandbox: exactly one capture per key, confirmed by provider ledger. Timeout injection at 800 ms
showed 0.4% of captures complete on the provider side after our client gives up — confirming the
“unknown outcome” state is not hypothetical and must exist in the model.

**Decision.** Capture executes in the worker. Every capture carries an idempotency key derived from
`order_id + order_version`. The order state machine includes an explicit `capture_unknown` state,
reconciled by querying the provider and by webhook, treated as two independent sources of truth.
*Status:* Accepted, 2026-03-14. *Owner:* Platform.

**Consequences.** *Easy:* safe retries; provider latency invisible to users; a single place to reason
about capture. *Hard:* no instant final confirmation; the UI must express “confirming” honestly.
*New obligations:* the worker becomes on-call surface; key lifetime must exceed the retry window;
the reconciliation job needs its own monitoring.

**Risks.** Key lifetime shorter than the provider’s retry window would silently re-enable duplicates
(*mitigation:* keys retained 30 days; a test asserts the window). Webhook signature verification
failure would strand orders in `capture_unknown` (*mitigation:* alert on state age over 15 minutes).

**Rejected alternatives.** *Synchronous capture* — couples user latency to a 1.4 s p99 dependency,
and the timeout case still requires the same reconciliation machinery, so it costs the complexity
without the benefit. *Webhook-only* — at-least-once delivery with occasional multi-hour delay cannot
meet the confirmation expectation, and leaves us unable to answer “did it work?” on demand.
*What this section is for:* stopping the same debate from restarting annually.

**Related.** ADR-001 (modular monolith) · ADR-003 (harvest confirmation async) · ARC-004 (single
writer per entity) · Risk R-02 (provider outage during the capture window).

### ADR practice

| Good | Weak |
|---|---|
| One decision per record | A record describing a design, not a decision |
| Rejected options preserved with reasons | Only the chosen option documented |
| Status and date maintained | Status “proposed” eighteen months later |
| Superseded records kept, marked, linked forward | Superseded records deleted |
| Stored in the repository, reviewed like code | Living in a wiki nobody opens |

> **Supersede, never delete.** When a decision changes, write a new ADR and mark the old one
> *Superseded by ADR-0NN*. The historical record is what lets a future team understand that the old
> choice was correct given what was known then.

---

## Chapter 43 — Evidence, Experiments & Spikes

> The more consequential and uncertain the decision, the stronger the evidence should be.

| Consequence | Uncertainty | Proportionate evidence |
|---|---|---|
| Low | Low | Decide. Record one line if it constrains anyone else |
| Low | High | Timebox a half-day spike; pick the reversible option |
| High | Low | Write the ADR; cite the existing evidence you rely on |
| High | High | Prototype, benchmark or load test before committing |
| Very high (permanent) | Any | Multiple forms of evidence plus an independent reviewer |

### Forms of evidence

- **Prototype** — can this be built the way we think? Keep it disposable and say so. A prototype that quietly becomes production is how an experiment turns into an architecture nobody decided on.
- **Benchmark** — is it fast enough, under what conditions? Always record data volume, concurrency, hardware, cache state. A benchmark without conditions is an anecdote with decimals.
- **Proof of concept** — does this integration work end to end? Especially valuable for third parties whose documentation describes an aspiration.
- **Load test** — where does it break, and how? The *how* matters more than the number: graceful rejection and catastrophic collapse have the same ceiling and different consequences.
- **Security test** — does the control hold when someone tries?
- **Vendor evaluation** — evaluate failure behaviour, support model, exit path and roadmap, not the feature grid.
- **Technical spike** — timeboxed, with a written question and a written answer. The output is a paragraph in an ADR, not a branch.

> **Every spike needs a question and an expiry.** *“Can 10,000 captures with duplicate idempotency
> keys produce more than one charge in the provider sandbox?”* is answerable in two days.
> *“Investigate payments”* is answerable in two months and answers nothing.

> **Common failure — evidence gathered after the decision.** ❌ Choosing the option, then running a
> benchmark to confirm it. *Why it fails:* the experiment is designed to pass. A useful test is one
> whose outcome could have changed the decision — if it could not, do not run it.

---
---

# PART X — SYSTEM DESIGN

*Architecture says what the system is shaped like. System design says how a particular capability
actually works — in enough detail to build safely, and no more.*

---

## Chapter 44 — From Architecture to System Design

```text
Architecture
     ↓
Capability          "adjust a weekly box"
     ↓
Use case            "customer swaps an item before cut-off"
     ↓
Workflow            the steps, including failure branches
     ↓
Component interaction   who calls whom, with what contract
     ↓
Detailed design     interfaces, data, states, errors
```

### The depth model

| Level | Question | Artifact | Decided here | Audience |
|---|---|---|---|---|
| **0** System context | What is the system, who uses it, what does it depend on? | Context diagram + externals table | The boundary | Everyone |
| **1** Major containers | What are the deployable parts, and what does each own? | Container diagram, topology, owners | Deployment independence, scaling units, operational surface | Engineering + operations |
| **2** Components | What is inside a container; which module owns which data? | Component view, module boundaries, ownership table | Dependency direction; where invariants are enforced | Implementing team |
| **3** Interactions | How does a capability execute, including every failure branch? | Sequence and state diagrams, contracts with error sets | Consistency, retry, idempotency, what the user sees | Implementing engineers |
| **4** Implementation detail | What are the classes, functions and queries? | The code and its tests | Almost nothing architectural | The person writing it |

> **Do not start at Level 4.** Detail at the bottom is fast to produce and feels like progress. It is
> also the most expensive work to throw away, and it anchors the levels above it — once twenty
> classes assume a boundary, the boundary is decided.

### How much design is enough?

Enough that a competent team can implement without inventing architecture. A design is finished when
these are answerable:

- Which component owns this behaviour, and which owns the data it touches?
- What is the contract at each boundary crossed, including errors?
- What happens on each failure branch, and who retries?
- What state exists, where does it live, and who may change it?
- What must be true before and after — the invariants?
- How will we know in production that it is working?

---

## Chapter 45 — Designing Components

A component design is seven short answers. If any is missing, the component is not designed — it is
named.

| Facet | The question | Weak answer | Strong answer |
|---|---|---|---|
| Responsibility | What is it accountable for? | “Handles orders” | “Owns the order lifecycle and enforces cut-off and basket invariants” |
| Interface | How is it used? | “It has a service class” | “Four commands and two queries, each with a defined error set” |
| Dependencies | What does it need? | “The usual” | “Catalogue read model, payment gateway port, clock” |
| State | What does it hold? | “Some caching” | “Owns order and basket tables; no in-memory state between requests” |
| Ownership | Who changes it? | “The backend team” | “Ordering team; reviewers named in CODEOWNERS” |
| Contracts | What does it promise? | “Returns an order” | “Returns the order or one of: NotFound, CutOffPassed, ItemUnavailable, Conflict” |
| Error boundary | What does it absorb? | “Errors bubble up” | “Translates gateway faults into domain outcomes; never leaks vendor errors upward” |

```typescript
// ordering/ports.ts
// Commands the ordering module accepts. Nothing else may change an order.
export type OrderingCommands = {
  createBasket(customerId: CustomerId, week: DeliveryWeek): Basket
  swapItem(basketId: BasketId, out: SkuId, in_: SkuId): Result<Basket, SwapError>
  confirmBasket(basketId: BasketId, key: IdempotencyKey): Result<Order, ConfirmError>
}

export type SwapError =
  | { kind: "CutOffPassed"; cutOff: Instant }
  | { kind: "ItemUnavailable"; sku: SkuId }
  | { kind: "NotInBasket"; sku: SkuId }

// Ports the module needs. Defined here, implemented outside.
export interface PaymentGateway {
  capture(intent: PaymentIntent, key: IdempotencyKey): Promise<CaptureOutcome>
}
```

Architectural notes: `swapItem` is **intent-shaped** — an intent-shaped operation can enforce an
invariant; a field setter cannot. The **idempotency key is in the signature**, because a required key
cannot be forgotten while a documented key will be. The **error set is part of the contract**, so
callers can handle each case distinctly. The **port is defined by the consumer**, so infrastructure
depends on the domain rather than the reverse.

> **Why error sets belong in the design.** They determine the user experience, the retry behaviour
> and the observability — three lenses at once. A design that says “returns an order” has deferred
> all three to whoever writes the code at 5pm on Friday.

---

## Chapter 46 — API & Contract Design

- **Boundary** — who may call this, from which trust zone, what is validated on entry
- **Commands vs queries** — commands change state and need idempotency; queries do not and can be cached
- **Shape** — domain language, not storage language
- **Errors** — machine-readable codes, stable, documented, deliberately mapped to transport
- **Versioning** — decided before the first consumer, never after the second
- **Idempotency** — required for every state-changing operation that may be retried
- **Authentication** — who is calling
- **Authorisation** — what they may do, enforced in one layer

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{
  "type":   "https://api.farm.example/errors/cut-off-passed",
  "title":  "The cut-off for this delivery week has passed",
  "detail": "Week 2026-W17 closed at 2026-04-23T18:00:00Z",
  "cutOff": "2026-04-23T18:00:00Z",
  "retryable": false,
  "traceId": "01HW3K9QX5"
}
```

`type` is a stable identifier — consumers branch on it, never on the message text. `cutOff` is
machine-usable, so the client renders the real deadline instead of a generic apology. `retryable`
tells callers and middleware whether retrying could ever help, removing an entire class of retry
storms. `traceId` connects a user-visible failure to telemetry.

| Versioning strategy | Good for | Costs |
|---|---|---|
| Additive only, never break | Internal APIs with cooperative consumers | Accumulating optional fields; the shape tells the history |
| Versioned path (`/v2/`) | Public APIs with independent consumers | Parallel implementations and a migration programme |
| Media-type / header versioning | Fine-grained evolution | Harder to observe, cache and debug |
| Consumer-driven contracts | Few, known consumers | Requires consumer test suites and coordination |

> **Common failure — the database shape as the public contract.** ❌ Returning rows. *Why it fails:*
> denormalising for performance, renaming for clarity, or splitting a table all become breaking API
> changes. The fix is a translation at the boundary — slightly tedious, permanently valuable.

---

## Chapter 47 — Data Design

Start from ownership, not from tables.

```text
INSIDE one transaction          OUTSIDE it
────────────────────────        ──────────────────────
Order + order lines             Sending email
Basket + basket version         Calling the payment provider
Reservation + stock counter     Writing the search index
Outbox row for the event        Building the route file

RULE  A transaction may span only data owned by the same module,
      and must never contain a network call to a system you do
      not control.
```

The outbox row makes the right column safe: the state change and the intent to publish commit
together, and a relay publishes afterwards. Without it you are choosing between lost events and
phantom events.

### Consistency per workflow

| Workflow | Consistency required | Why | Window the user may see |
|---|---|---|---|
| Basket edit | Strong | Two edits must not lose each other before cut-off | None |
| Stock reservation | Strong | Overselling a harvest is a real-world failure | None |
| Payment capture | Strong + idempotent | Money; duplicates unacceptable | None, but “confirming” is visible |
| Catalogue availability | Eventual (seconds) | Publishing is farm-driven and tolerant | Up to 30 s stale, labelled |
| Substitution notice | Eventual (< 60 s) | Driver-specified | Under one minute |
| Sales dashboard | Eventual (minutes) | Reporting, not decision-critical | Up to 5 minutes, timestamped |

### Migration in reversible steps

1. Add the new structure alongside the old — nothing reads it yet.
2. Write to both; reads still come from the old. Deployable and reversible.
3. Backfill, with a verification query that proves equivalence.
4. Switch reads to the new structure behind a flag.
5. Stop writing to the old; keep it readable for the rollback window.
6. Remove the old structure, in a separate release.

> **Rollback is why this has six steps.** A migration that changes structure and reads in one release
> converts any bug into an outage with no way back.

---

## Chapter 48 — Workflow & Sequence Design

A happy-path sequence diagram is a marketing artifact. The branches are where the architecture lives.

### Confirm basket → order → capture

| # | Step | What / why | What can fail | Boundary crossed |
|---|---|---|---|---|
| 1 | Customer → Web: confirm my box | Confirmation is an explicit act because it starts a money flow | Connection lost; nothing changed server-side | Untrusted → public edge |
| 2 | Web → API: `POST /baskets/{id}/confirm` + Idempotency-Key | The key is client-generated because the client is what retries | Timeout; retry with same key returns the original outcome | Public edge → application |
| 3 | API → Ordering: `confirmBasket(basketId, key)` | Authorisation lives here — not in transport (bypassable) nor the domain (should not know principals) | Unauthorised: rejected before any state changes, and audited | Application → domain |
| 4 | Ordering: enforce cut-off and basket invariants | Enforced by the owner of the data, so every path gets the same rule | `CutOffPassed` / `ItemUnavailable` returned as typed outcomes | None — inside the domain |
| 5 | Ordering → Database: persist order + outbox row (one transaction) | Without the outbox you either lose the event or publish a phantom | Constraint violation or store down: full rollback, no partial order | Domain → persistence (owned tables) |
| 6 | Ordering → Worker: `OrderConfirmed` via outbox relay | Capture is slow, retryable and third-party — three reasons it leaves the request path | Relay lag: order correct, capture late; alert on outbox age | Synchronous → asynchronous |
| 7 | API → Customer: 200, order confirmed, payment confirming | Returns before capture, because the message must match the mechanism | Lost response: retry with the same key returns the identical result | Application → untrusted |
| 8 | Worker → Payment: `capture(intent, key)` | Retries are safe by construction rather than by carefulness | Timeout with unknown outcome → `capture_unknown`, reconciled by query and webhook | Our system → external provider |

> **Common failure — the diagram with no branches.** ❌ Eight arrows, all of which succeed. *Why it
> fails:* every one of those arrows can time out, be rejected, arrive twice or succeed invisibly. A
> sequence without branches communicates confidence the team has not earned.

---

## Chapter 49 — State & Event Design

```text
                 ┌──────────┐
                 │  DRAFT   │  basket editable
                 └────┬─────┘
                      │ confirm (before cut-off)
                      ▼
                 ┌──────────┐
                 │CONFIRMED │  order exists, money not moved
                 └────┬─────┘
                      │ capture requested
                      ▼
              ┌───────────────┐
              │  CAPTURING    │
              └───┬───────┬───┘
       captured   │       │   timeout / no response
                  ▼       ▼
           ┌──────────┐ ┌──────────────────┐
           │   PAID   │ │ CAPTURE_UNKNOWN  │ ← the honest state
           └────┬─────┘ └────────┬─────────┘
                │                │ reconcile (query + webhook)
                │                ├──→ PAID
                │                └──→ CAPTURE_FAILED
                ▼
           ┌──────────┐
           │ PICKING  │ → DISPATCHED → DELIVERED
           └──────────┘
```

> **Why `CAPTURE_UNKNOWN` earns its place.** Because it is true. For a measured 0.4% of captures, the
> provider completed the charge after our client gave up. A model without this state forces the code
> to guess — and guessing about money produces either double charges or unpaid orders. Systems
> without an explicit unknown state invent one in production, in the form of a spreadsheet.

| Question | Decide explicitly | Consequence of not deciding |
|---|---|---|
| Who owns the event? | The module that owns the data it describes | Two producers, divergent meaning |
| Fact or command? | Facts are past tense with no intended recipient | Events become RPC with extra latency |
| Delivery semantics | At-least-once is the realistic default | Consumers written as if exactly-once; duplicates corrupt state |
| Ordering | Per-key ordering, or none | Consumers silently depend on arrival order |
| Schema evolution | Additive, with a version | A new field breaks every consumer |
| Replay | Whether consumers may be replayed | Recovery requires manual reconstruction |
| Retention | How long events are kept | Replay window discovered during an incident |

```typescript
// worker/handlers/order-confirmed.ts
export async function onOrderConfirmed(e: OrderConfirmed) {
  // At-least-once delivery: this handler WILL run twice.
  const claimed = await claims.tryClaim(e.eventId, handlerName)
  if (!claimed) return                       // already handled

  const key = idempotencyKey(e.orderId, e.version)   // derived, not random
  const outcome = await gateway.capture(e.intent, key)

  if (outcome.kind === "unknown") {
    await orders.markCaptureUnknown(e.orderId)       // reconciler owns it
    return
  }
  await orders.applyCaptureOutcome(e.orderId, outcome)
}
```

---

## Chapter 50 — Security Design

```text
Customer session ──▶ API
                     │ resolve principal
                     ▼
              Principal{ id, tenant, roles }
                     │
        ┌────────────┴─────────────┐
        ▼                          ▼
  Domain command            Published event
  carries authz decision    carries actor id
        │                          │
        ▼                          ▼
    Audit log                 Worker handler
                              acts as SERVICE identity,
                              with actor recorded for audit

RULE  A worker never inherits user authority. It has its own identity
      with its own least-privilege grants, and records on whose
      behalf it acted.
```

> **The classic background-job hole.** A job that runs “as the system” with full privileges,
> triggered by an event whose payload came from user input. Authorisation was performed on the
> request that created the event — and never again. Re-authorise at the point of effect.

### Threat modelling that fits in an afternoon

1. Draw the trust boundaries.
2. For each boundary, list what crosses it and in which direction.
3. For each crossing ask: spoofed? tampered? replayed? disclosed? denied? elevated?
4. For each plausible answer, name the control and where it lives.
5. For each control, ask what happens when it fails — and confirm it fails closed.
6. Record what you decided *not* to defend against, and why.

| Abuse case | Control | Fails how? |
|---|---|---|
| Farm staff view another farm’s orders | Tenant scoping in the data access layer | Closed — query without scope is not expressible |
| Forged payment webhook marks an order paid | Signature verification + provider-side confirmation | Closed — unverified webhooks dropped and alerted |
| Replayed confirm request to double-charge | Idempotency key with stored outcome | Closed — returns the original result |
| Basket manipulated to alter price | Price computed server-side from catalogue at confirm time | Closed — client price never trusted |
| Admin exports all customer data | Least privilege + audited export with approval | Detective — logged, alerted, reviewed |

Not every control can be preventive. What matters is knowing which are preventive and which are
detective, and never mistaking one for the other in a review.

---

## Chapter 51 — Runtime & Deployment Design

```text
┌─ REGION — EU-WEST ───────────────────────────────────────────┐
│                      ┌───────────┐                           │
│                      │ CDN /EDGE │  static, TLS, rate limit  │
│                      └─┬───────┬─┘                           │
│            ┌───────────┘       └────────────┐                │
│       ┌────▼────┐          ┌────────┐   ┌───▼──────┐         │
│       │   WEB   │─────────▶│  API   │   │  WORKER  │         │
│       │  2–6    │          │ 3–12   │╌╌▶│   2–8    │         │
│       └─────────┘          └───┬────┘   └────┬─────┘         │
│    ╭──────────────╮      ╭─────▼──────╮  ╭───▼──────╮        │
│    │ OBJECT STORE │◀─────│  DATABASE  │  │  QUEUE   │        │
│    ╰──────────────╯      │ primary +  │  ╰──────────╯        │
│                          │  replica   │                      │
│                          ╰────────────╯                      │
└──────────────────────────────────────────────────────────────┘
```

| Property | Decision for this system | Why |
|---|---|---|
| Independence | Web, API and worker deploy separately | Different change rates; worker deploys must not interrupt the cut-off window |
| Migration compatibility | Every migration backward compatible for one release | Rollback must remain possible |
| Deployment window | No API deploys Thursday 14:00–20:00 | The peak driver, expressed as an operational rule |
| Configuration | Declared per environment; secrets from a managed store | Repeatability; no secrets in images |
| Rollback | Previous image redeploy; data compatible by construction | Recovery is a designed path |
| Recovery objective | RPO 5 minutes, RTO 1 hour | Agreed with the business, drilled quarterly |

> **A deployment rule is an architectural decision.** “No API deploys during the Thursday peak” came
> from a driver, affects how work is planned, and will be forgotten unless written down and enforced
> by the pipeline. Operational rules deserve ADRs exactly as much as structural ones.


---
---

# PART XI — ARCHITECTURE DOCUMENTATION

*How to write and draw architecture: document types, drafting procedures, diagram selection, and
what separates a diagram that teaches from one that decorates.*

---

## Chapter 52 — Documentation as a System

Treat documentation as a system with inputs, owners, update triggers and validation. The failure is
never “we did not write anything”. It is that what was written had no owner, no trigger to update
it, and no way to detect that it had gone stale.

| Property | As a system | As an artifact pile |
|---|---|---|
| Ownership | Every document has a named owner | Written by whoever had time |
| Update trigger | Defined: which events force a revision | Updated when someone notices |
| Location | Where engineers already work | Wherever it was first uploaded |
| Validation | Reviewed at gates; drift is detectable | Trusted until proven wrong in an incident |
| Lifecycle | Superseded and archived deliberately | Grows forever; nothing is wrong, only old |
| Audience | Stated per document | Assumed to be “everyone” |

> **The staleness rule.** Documentation that is wrong is worse than documentation that is missing,
> because it is trusted. If you cannot commit to maintaining a document, write a shorter one you can
> maintain — or write down the date and the fact that it is a snapshot.

**Three update triggers worth automating**
- An ADR is accepted → the baseline must be revisited in the same change
- A new external dependency appears → context view and externals table must change
- A module is added, removed or renamed → container view and ownership table must change

Each can be a pull-request checklist item or a CI warning. Documentation drift is mostly a workflow
problem wearing a discipline costume.

---

## Chapter 53 — Architecture Document Types

| Type | Purpose | Created when | Owner | Reviewer |
|---|---|---|---|---|
| Architecture overview | Orient a reader in ten minutes | System exists or is being established | Architect | Engineering lead |
| System context | Agree the boundary and externals | Initialization; integration change | Architect | Product + Engineering |
| Architecture baseline | The agreed current model | End of initialization; every architectural change | Architect | Independent reviewer |
| Detailed design | Enough to implement a capability safely | Before building a significant capability | Senior engineer | Architect |
| ADR | Record one consequential decision | A decision is architecturally significant | Decision owner | Peer or architect |
| Decision register | Index of decisions and status | Maintained continuously | Architect | — |
| Constraints register | Facts, beliefs and unknowns | Initialization; reviewed at every gate | Architect | Engineering lead |
| Risk register | Architectural risks with impact and trigger | Initialization; reviewed at every gate | Architect | Engineering lead |
| Threat model | Abuse cases and controls | Security lens applied at depth | Security-minded engineer | Security reviewer |
| Integration contract | The agreement with an external system | Before integrating | Integration owner | Both sides |
| Deployment architecture | How and where it runs | Before first production deploy | Platform engineer | Operations reviewer |
| Operational model | How it is run, watched and recovered | Before first production deploy | Platform engineer | On-call team |

### Example — Architecture Overview

```text
FARM COMMERCE — ARCHITECTURE OVERVIEW           v1.2

WHAT IT DOES
Sells farm boxes to households on a weekly cycle: customers adjust
a basket until Thursday 18:00, farms confirm harvest Friday 06:00,
routes go to the delivery partner at 06:00 Saturday.

THE SHAPE, IN THREE DECISIONS
 1  One deployable with enforced module boundaries (ADR-001)
    — four engineers, no operations specialist.
 2  Cut-off is an ordering invariant, not a UI rule (ADR-002)
    — every entry point must obey it.
 3  Payment capture runs in a worker with idempotency keys
    (ADR-004) — money must not depend on request timing.

WHAT IS DELIBERATELY NOT HERE
 · No service mesh, no per-capability services: no driver.
 · No multi-region: single market in year one (assumption A-002,
   reviewed quarterly).
```

### Example — Detailed Design

```text
DETAILED DESIGN — Harvest substitution         2026-04-02

IN SCOPE
Farm confirms actual harvest; shortfalls generate substitutions;
affected customers are notified before picking begins.

FAILURE BRANCHES
 · Farm confirms late (after 06:00): picking proceeds on forecast;
   substitution becomes a delivery-time note.
 · Substitution rule finds no acceptable alternative: item removed
   and the order total reduced; refund path ADR-009.
 · Notification provider down: substitution still applies;
   notification retried for 2h, then surfaced in the app.

OBSERVABILITY
 · substitution_latency_seconds  — driver target is 60s
 · unconfirmed_farms_at_0700     — alerts operations
 · notification_failures_total   — alerts after 2h retry
```

---

## Chapter 54 — How to Write Architecture Documents

```text
 1  State the purpose — who reads this and what they must be able
    to do afterwards
 2  Define the scope — and what is explicitly out of it
 3  State the drivers — what this must satisfy
 4  Explain the boundaries — what is inside, outside, crossing
 5  Describe the decisions — and link the ADRs
 6  Explain the relationships — how the parts interact
 7  Document the trade-offs — what this shape costs
 8  Record assumptions — with dates and owners
 9  Record open questions — with what each one blocks
10  Link supporting artifacts — diagrams, ADRs, registers
```

**Writing rules that survive review**

- Lead with the decision, not the journey.
- One idea per paragraph. If a paragraph needs “additionally”, it is two paragraphs.
- Name things exactly once. One concept, one name, everywhere — API, diagram, database, docs.
- Write dates and owners, not “recently” and “the team”.
- Say what you did not do. The absence of a component is a decision and deserves a sentence.
- Prefer a table to a list, and a diagram to a table, when the content is relational. Prose is for reasoning.

> **Common failure — the document that describes the code.** ❌ Pages of prose restating what the
> classes do. *Why it fails:* the code already says that, more accurately, and it drifts the moment
> it is written. Architecture documentation records what the code *cannot* say: why the boundary is
> there, what was rejected, what must remain true, and what we are assuming.

---

## Chapter 55 — Diagramming

| Question | Artifact | Shows | Never shows |
|---|---|---|---|
| What is the system? | Context | System, actors, external systems | Internal components |
| What are its major parts? | Container | Deployable / runnable units and responsibilities | Classes |
| What is inside this part? | Component | Components in one container and their relationships | Every class |
| How does a request work? | Sequence | Ordered interaction across boundaries, with branches | Static structure |
| How does data move? | Data flow | Stores, flows, transformations, trust crossings | Call stacks |
| How does state change? | State machine | States, transitions, guards, terminal states | Implementation |
| Where does it run? | Deployment | Nodes, regions, networks, scaling units | Business logic |
| How do systems integrate? | Integration | Protocols, direction, frequency, failure handling | Internal design |
| How does a business process work? | Workflow | Human and system steps, decisions, handoffs | Technical detail |

### One visual grammar, everywhere

```text
( HUMAN )          a person or role — always outside the system

┌─────────┐
│ SYSTEM  │        a system or container we own
└─────────┘

╌╌╌╌╌╌╌╌╌╌╌
╎ EXTERNAL ╎       depended on, not controlled (dashed)
╌╌╌╌╌╌╌╌╌╌╌

╭──────────╮
│  STORE   │       persistent state (cylinder)
╰──────────╯

┌ ─ ─ ─ ─ ─ ┐
  BOUNDARY         trust / ownership / deployment (dashed container)
└ ─ ─ ─ ─ ─ ┘
```

> **The golden rule. Every diagram should answer a question.** Write the question as the title, or
> at least as the caption. A diagram whose question cannot be written is a picture of a system, which
> is not the same thing as a communication.

---

## Chapter 56 — How to Draft a Diagram

```text
Question            what must a reader be able to answer?
    ↓
Scope               what is in, what is out
    ↓
Participants        only those needed for the question
    ↓
Relationships       direction, meaning, frequency
    ↓
Boundaries          trust, ownership, deployment
    ↓
First draft         ugly, fast, by hand
    ↓
Remove detail       anything not serving the question
    ↓
Validate            against the real system, with someone who
                    knows it better than you
    ↓
Review              with the audience it is for
    ↓
Publish             where it will be found and maintained
```

> **Common failure — the diagram that came first.** ❌ Creating diagrams before understanding the
> system. *Why it fails:* the diagram becomes an expression of assumptions rather than a
> representation of the system — and because it looks authoritative, those assumptions propagate into
> designs, estimates and decisions.

### The removal pass

**Before — 19 elements, no question**

```text
 [Browser] → [CDN] → [LB] → [API GW] → [Auth svc]
                                  ↓
     [Cache] ← [Ordering] → [Catalogue] → [Search]
        ↓           ↓            ↓
     [Redis]    [Postgres]   [Elastic]
                    ↓
     [Backup] ← [Replica] → [Reporting] → [BI tool]
                    ↓
              [Monitoring] [Logging] [Tracing]
```

**After — question: “who owns order data?”**

```text
        ┌──────────────┐
        │   ORDERING   │  owns: orders, baskets
        └──────┬───────┘
               │ writes
               ▼
        ╭──────────────╮
        │  PRIMARY DB  │  orders, order_lines, baskets
        ╰──────┬───────╯
               │ replicates
               ▼
        ╭──────────────╮
        │   REPLICA    │  read-only: reporting, BI
        ╰──────────────╯

  Catalogue and Search read orders via the ordering API.
  No other component writes these tables (ARC-004).
```

The first contains more information and communicates less. The sentence underneath the second
carries more architectural weight than nine of the removed boxes.

---

## Chapter 57 — Diagram Quality

| Quality | Check | Failure it prevents |
|---|---|---|
| Scope | One level of abstraction only | Containers and classes in the same picture |
| Legibility | Readable at the size it will actually be viewed | The screenshot in the incident channel |
| Consistency | Same shapes and arrows as every other diagram | A reader learning a new notation each chapter |
| Direction | Flow consistent — usually top-down or left-right | Arrows that cross and reverse for layout reasons |
| Labels | Every relationship says what it means | “Uses”, on all fourteen arrows |
| Boundaries | Trust, ownership and deployment edges marked | A security review with nothing to review |
| Detail | Enough to answer the question, no more | The diagram that took a day and is wrong by Friday |
| Synchronisation | A trigger exists to update it | The reorganisation that happened two years ago |

| Diagram-as-code, used well | Used badly |
|---|---|
| Source lives beside the code it describes | Generating everything, producing unreadable graphs |
| Rendered in review so changes are visible | Source in a repository nobody has checked out |
| Generated views marked as generated | Layout arguments in pull requests |
| Hand-drawn views kept deliberately small | Treating a dependency graph as an architecture diagram |

> **Generated is not the same as true.** A generated dependency graph shows what the code does. An
> architecture diagram shows what it is supposed to do. The interesting information is the
> *difference* — which is why the most valuable use of generation is drift detection.

---
---

# PART XII — ARCHITECTURE REVIEW

---

## Chapter 58 — Reviewing Architecture

```text
Requirements     does it satisfy the drivers?
     ↓
Principles       is the shape defensible?
     ↓
Lenses           what concerns have not been examined?
     ↓
Standards        does it comply, and where does it not?
     ↓
Decisions        are significant choices recorded and consistent?
     ↓
Evidence         is the evidence proportionate to the risk?
     ↓
Risks            what could go wrong, and is that acceptable?
```

| Finding type | Means | Required next step |
|---|---|---|
| Blocking | A driver is not met, or a standard violated without an exception | Change the design or record an exception with an owner |
| Needs evidence | A claim is load-bearing and unproven | A spike or test, with a date |
| Accepted risk | Known, understood, deliberately taken | Risk register entry with trigger and owner |
| Advisory | Would be better; not load-bearing | Recorded, not blocking |
| Not applicable | A lens was skipped deliberately | Record the trigger that would change this |

> **A reviewer’s obligation.** A finding must name the concern, the consequence and, where possible,
> a cheaper alternative. “I would not do it that way” is not a finding. “Confirming the basket in the
> request path couples user latency to a provider with a 1.4 s p99 — moving capture to the worker
> costs one queue and removes that coupling” is.

---

## Chapter 59 — Architecture Review Checklist

**Structure**
- [ ] Boundaries clear, named and enforced — *evidence: a list of boundaries, what crosses each, and the mechanism enforcing it. “Convention” is not a mechanism*
- [ ] Each responsibility describable in one sentence without “and” — *evidence: a responsibility statement and an owner per component*
- [ ] Coupling reasonable and intentional — *evidence: dependency graph vs intended direction, with an explanation per exception*
- [ ] Complexity proportionate to the drivers — *evidence: every structural element traced to a ranked driver*

**Data**
- [ ] Ownership explicit — exactly one writer per entity — *evidence: ownership table plus actual write grants*
- [ ] Consistency model appropriate per workflow — *evidence: per-workflow consistency statement and observable window*
- [ ] Migration path exists — *evidence: a plan deployable in reversible steps*
- [ ] Retention and deletion defined, including derived copies — *evidence: policy per entity and a deletion trace through caches, indexes, exports*

**Security**
- [ ] Trust boundaries explicit — *evidence: a diagram marking each boundary and what is validated*
- [ ] Authorisation enforced in a single consistent layer — *evidence: a named layer plus tests asserting refusal at every entry point including background work*
- [ ] Identity flows correctly through asynchronous work — *evidence: propagation design, service identity distinct from user authority*
- [ ] Abuse cases considered, controls named preventive or detective — *evidence: threat model with failure behaviour per control*

**Reliability**
- [ ] Failure modes understood per dependency — *evidence: table of dependency / slow / unavailable / expected response*
- [ ] Every resource bounded — *evidence: timeouts, pool sizes, queue limits, retry budgets with chosen values*
- [ ] Retryable operations idempotent — *evidence: key derivation, stored outcomes, a duplicate-request test*
- [ ] Degraded mode exercised — *evidence: a test or drill in which the dependency was actually disabled*

**Operations**
- [ ] Deployable — independently, or with deliberate coupling — *evidence: deployment plan naming what ships together and why*
- [ ] Observable enough to answer incident questions — *evidence: signals mapped to the last three real incidents*
- [ ] Recoverable, and recovery practised — *evidence: a drilled restore with recorded duration, and a rehearsed rollback*
- [ ] Operational surface acceptable to those carrying it — *evidence: component count, rota, and a statement from the people on it*

**UX & DX**
- [ ] User-visible consequences understood — *evidence: waiting, failing and recovering states per critical workflow*
- [ ] Asynchrony expressed honestly — *evidence: copy and states that match the mechanism*
- [ ] A new engineer can find and change the right thing — *evidence: onboarding walkthrough with measured times*
- [ ] The correct path is the convenient path — *evidence: guardrails and scaffolding making compliance the default*

---

## Chapter 60 — Architecture Gates

### The four named gates

#### Gate 1 — Architecture Initialization

*Before structural work begins.*  
**Do we understand the problem well enough to shape a system?**

- [ ] Purpose stated in business terms
- [ ] Scope, including what is out
- [ ] Actors named with needs
- [ ] System context established
- [ ] Major capabilities listed
- [ ] External dependencies identified with owners
- [ ] Architectural drivers ranked
- [ ] Initial quality attributes with measures
- [ ] Constraints recorded with sources
- [ ] Major boundaries proposed
- [ ] An architecture owner and a reviewer named

> **How this gate fails usefully.** Proceeding with an unranked driver list. Everything cannot be the priority, and if it is, structure will be decided by whoever codes first.

#### Gate 2 — Architecture Baseline

*Before the architecture is treated as agreed.*  
**Is there a coherent architecture that people can build against and argue with?**

- [ ] Context view
- [ ] Structural model to the depth the risk justifies
- [ ] Major patterns named with costs
- [ ] Important runtime behaviour described
- [ ] Data ownership and integration boundaries
- [ ] Quality attributes with measures
- [ ] Security and trust boundaries
- [ ] Reliability and failure strategy
- [ ] Deployment model
- [ ] Significant decisions recorded
- [ ] Assumptions with owners and review dates
- [ ] Open questions with what each blocks
- [ ] Validation evidence where the claim is expensive to be wrong about

> **How this gate fails usefully.** A baseline with no open questions. It means they were hidden, not answered.

#### Gate 3 — Detailed System Design

*Before implementation of a significant capability.*  
**Can this be built safely without discovering the architecture during the work?**

- [ ] Component responsibilities understood
- [ ] Interfaces and contracts defined
- [ ] Data models defined, with indexes and transaction boundaries
- [ ] Critical workflows defined step by step
- [ ] Failure behaviour defined per step
- [ ] Security behaviour defined
- [ ] Integration behaviour defined, including failure and retry
- [ ] Relevant decisions recorded

> **How this gate fails usefully.** Design that stops at the happy path. The failure branches are where the estimates were wrong.

#### Gate 4 — Architecture Change

*Before implementing a change with architectural impact.*  
**Do we know what this change costs the architecture, not just the sprint?**

- [ ] Impact assessed against each view
- [ ] Affected boundaries identified
- [ ] Affected decisions identified — superseded or still valid
- [ ] Options and trade-offs considered
- [ ] Decision recorded
- [ ] Architecture updated before, not after
- [ ] Baseline version incremented

> **How this gate fails usefully.** Assessing impact after the pull request is open. By then the decision has been made by the diff.

> **Gate 4 is the one teams skip.** Initialization, baseline and design gates happen at
> visible moments, so they get scheduled. The change gate has no moment — it belongs at the
> start of every piece of work with architectural impact, which is exactly where nobody is
> looking for a gate.

| Gate | Passes when | Fails usefully by |
|---|---|---|
| Baseline | Architecture established and documented (Ch. 39) | Naming which of the ten criteria is missing |
| Detailed design | Enough detail to implement safely (Ch. 44) | Identifying the unanswered design question |
| Change | Architectural impact understood (Ch. 61) | Showing which areas are affected and unexamined |
| Review | Relevant concerns examined through the right lenses | Listing the lens that has not been applied |
| Evolution | The baseline again describes reality (Ch. 63) | Naming the document that no longer matches the system |

> **Gates fail when they become schedule events.** The moment a gate is a date rather than a state,
> it is passed by assertion. Keep criteria objective, keep evidence attached, and make failing a gate
> a normal, low-drama outcome that produces a next action rather than a negotiation.

---
---

# PART XIII — ARCHITECTURE EVOLUTION

---

## Chapter 61 — Architecture Impact

```text
Change proposed
       ↓
Does it affect architecture?
       │
   ┌───┴────┐
   NO       YES
   │         ↓
   │    Assess impact
   │         ↓
   │      Decision
   │         ↓
   │       Design
   │         ↓
   │   Update baseline
   ↓         ↓
Continue delivery
```

### The impact questions

A change affects the architecture if any answer is yes:

- Does it add, remove or move a **boundary**?
- Does it change **who owns** data, a capability or an operational responsibility?
- Does it introduce a new **external dependency**, or change an existing one’s role?
- Does it change a **quality attribute** that appears in the drivers?
- Does it change a **trust boundary** or how identity flows?
- Does it add a **runtime component** or deployment unit?
- Does it contradict a recorded **decision** or standard?
- Would it be **expensive to reverse** once shipped?

> **“No” is a real answer and should be common.** Most changes are not architectural, and routing
> them through architecture review would destroy the credibility of the process. The value of the
> triage is that it is fast, explicit, and creates a record when the answer is yes.

---

## Chapter 62 — Architecture Debt

### The eleven kinds

Architecture debt is not one thing. Naming the kind matters, because the repayment differs
completely: a stale diagram is an afternoon, an eroded boundary is a quarter, and a duplicated
architectural approach is a decision nobody wants to make.

| Kind | What it is | How you notice |
|---|---|---|
| Accidental complexity | Structure that solves no current problem. | Nobody can explain why the layer exists. |
| Boundary erosion | A boundary that is crossed so often it no longer exists. | The import rule has six exceptions. |
| Inappropriate coupling | Two things that must change together but were designed not to. | Every change to one module ships with a change to another. |
| Undocumented dependencies | Dependencies acquired accidentally, usually through shared utilities. | Removing a "helper" breaks four modules. |
| Obsolete patterns | A pattern kept after the problem it solved disappeared. | "We do it this way because of the old queue." |
| Stale diagrams | Views that describe a system that no longer exists. | New joiners are told which diagrams to ignore. |
| Architecture / documentation drift | The code and the record diverged and nobody noticed. | The baseline version has not moved in a year of change. |
| Deprecated decisions | ADRs that are still cited though their context is gone. | A decision justified by a constraint that was lifted. |
| Temporary shortcuts made permanent | The thing that was going to be fixed next quarter. | A comment with a date in it, two years old. |
| Inconsistent implementations | The same problem solved three ways in three modules. | Three retry implementations with three behaviours. |
| Duplicated architectural approaches | Two competing structures for the same concern. | Two event buses. There is always a reason, and it is never a good one. |

> Architecture debt is not simply “old code.”

Old code that is well bounded, well understood and cheap to change is an asset. New code that has
eroded a boundary is debt on the day it merges.

| Kind | Looks like | Detect by | Interest it charges |
|---|---|---|---|
| Intentional shortcut | A decision deferred deliberately under time pressure | The ADR that recorded it — if one exists | Grows quietly until the deferral is forgotten |
| Accidental complexity | Structure nobody chose, from accumulated convention | Elements that cannot name a driver | Every change costs more than it should |
| Documentation drift | The baseline no longer describes reality | Comparing generated graphs with documented intent | Wrong decisions made from trusted documents |
| Boundary erosion | Cross-boundary calls that were once forbidden | Dependency checks, or their absence | Modules become folders; extraction becomes excavation |
| Coupling creep | Shared tables, shared libraries, shared release trains | Change-impact walkthroughs; coordinated releases | Independent delivery stops being possible |
| Deprecated decisions | A recorded decision whose drivers no longer hold | Reviewing ADRs against current drivers | The team follows reasoning that has expired |

### Deciding what to pay

1. Name the debt as a statement about change cost, not a complaint about code.
2. Identify which driver it obstructs — if none, it may be acceptable forever.
3. Estimate the interest: cost per change, per incident, per onboarding.
4. Estimate the principal: cost to correct, including migration.
5. Decide — pay, contain, or accept — and record the decision as an ADR.
6. If accepting, set a trigger that would force a revisit.

> **Containment is a legitimate answer.** You do not have to fix an eroded boundary to stop it
> getting worse. Add the guardrail now, freeze the violation set as a documented exception list, and
> let the debt shrink as code changes. This turns an unbounded problem into a monotonically
> decreasing one — usually for a fraction of the cost of a migration.

---

## Chapter 63 — Evolving the Baseline

```text
New Work
   ↓
Architecture Impact Assessment
   ↓
No meaningful impact?
   ├── YES → Continue. Record that it was assessed.
   └── NO
        ↓
     Assess — which views, which boundaries, which decisions
        ↓
     Decide — options, trade-offs, ADR
        ↓
     Design — to the depth the risk justifies
        ↓
     Update Architecture — before implementation, not after
        ↓
     Implement
        ↓
     Validate — evidence against the claim
        ↓
     Rebaseline — version moves, open questions updated
```

> **Record the assessments that found nothing.** The "no meaningful impact" branch is the one
> that must leave a trace. Without it there is no way to distinguish work that was assessed and
> cleared from work nobody looked at — and those two look identical six months later.

**The change: “The system now needs asynchronous report generation.”** Farms want a weekly
performance report over a full season of data — a query too heavy for the request path.

**1 · Current baseline (v1.2).** Web, API, Worker, Database, plus external payment and delivery
partners. Reporting currently means a handful of synchronous queries against the read replica
(ADR-014).

**2 · Change proposed.** A report spanning a season of orders, substitutions and delivery outcomes.
Prototype query runs 40–90 seconds against the replica and returns several megabytes. The
request-path option is dead on arrival: it would hold a connection for a minute and put an unbounded
query on a shared replica.

**3 · Impact? Yes — four of the eight triage questions are positive.**
New runtime component (probably — a job runner and artifact storage) · new data owner (generated
report artifacts need an owner and retention) · quality attribute affected (a heavy query on the
shared replica threatens reporting reads and the cut-off peak) · expensive to reverse (moderately —
artifact storage and URLs become a contract with farms).

**4 · Affected areas.** Runtime (where does a 90-second job execute?) · Data (who owns artifacts;
retention; personal data?) · UX (a minute-long report must be requested, not awaited) · Operations
(a new queue, a backlog alert, storage lifecycle) · Reliability (protect the replica during the
Thursday peak).

**5 · Options.**
*A — synchronous endpoint with a long timeout.* No new components; holds connections, risks the
replica, gives farms a page that appears broken. Rejected.
*B — reuse the existing worker.* No new runtime component; but a 90-second job would sit in the same
queue as payment capture and could delay it during the peak. Violates failure isolation for the
highest-ranked driver.
*C — separate report worker on a dedicated queue*, reading a snapshot, writing artifacts to object
storage. One new component; capture is insulated; artifacts get an owner and a retention rule.

**6 · Decision — ADR-015, option C.** Report generation runs in a dedicated worker on its own queue,
reads from the replica with a statement timeout and concurrency limit of one, and writes artifacts to
object storage with a 90-day lifecycle. The API returns a report request identifier immediately; the
farm portal polls and the farm is emailed when the artifact is ready.
*Consequences.* Easy: heavy reporting without touching the request path or payment capture. Hard:
one more component to deploy and watch. New obligations: backlog alert, storage lifecycle, and a
personal-data review of report contents.

**7 · Updated baseline (v1.3).** Six runtime pieces. ADR-014 is referenced but not superseded —
reporting still reads the replica; what changed is *who* reads it and *how*. Total elapsed: one
design session, one ADR, four artifact updates.

### Updating the artifacts

| Artifact | Update | Trigger that forced it |
|---|---|---|
| Container diagram | Add the report worker and object store path | A new runtime component |
| Baseline | New component, owner, and the driver it serves | Structure changed |
| ADR | ADR-015 accepted; ADR-004 referenced, not superseded | A new decision was made |
| Ownership table | Report artifacts owned by reporting; source data read-only | New data with a new owner |
| Standards | No change — existing ownership standard covers it | Checked and recorded as unchanged |
| Risk register | Add: report generation could saturate the replica | New failure mode |
| Runbook | Add: report backlog alert and its first action | New operational surface |

### Supersede, deprecate, migrate

- **Superseding an ADR** — write the new one, mark the old *Superseded by ADR-0NN*, and keep it.
- **Deprecating a pattern** — state what replaces it, whether existing usage must migrate, and the date the guardrail starts rejecting new usage.
- **Recording a migration path** — from state, to state, reversible steps, and who owns each. A migration without an owner is a wish.
- **Keeping history** — version the baseline. “Why is it like this?” is usually answered by a version from two years ago.

---
---

# PART XIV — COMPLETE WORKED EXAMPLE

## Chapter 64 — Farm Commerce Platform, End to End

| # | Artifact | Chapter | What it produced |
|---|---|---|---|
| 01 | Problem | 4 | Business, user and system problem separated. The system problem is the gap between a final basket and a known harvest |
| 02 | Requirements | 4 | Functional, quality, operational and regulatory requirements in the Architecture Input Brief |
| 03 | Drivers | 5 | Six drivers ranked; cut-off peak, harvest variability, payment correctness, team size at the top |
| 04 | Constraints | 6 | Card data out of scope; batch-only partner; four engineers. Two high-impact unknowns recorded |
| 05 | Principles | 24 | Six principles chosen from the drivers, three made enforceable |
| 06 | Lenses | 9 | Security, Data, Reliability, Operations given depth. Compliance limited to payment scope; skip recorded |
| 07 | Context | 25 | Boundary agreed. Three actors, three external systems, each with failure behaviour and exit cost |
| 08 | Initial architecture | 26 | Six progressive steps from “user and system” to five runtime pieces, each naming its driver |
| 09 | Options | 30 | Three decomposition options against criteria derived from the ranked drivers |
| 10 | ADRs | 31 | ADR-001 to ADR-004, with rejected alternatives and reasons preserved |
| 11 | Baseline | 27 | Baseline v1.0 published, with three open questions and two load-bearing assumptions |
| 12 | Baseline gate | 28 | Ten criteria checked. One failure — drivers unranked — fixed in a single session |
| 13 | Container design | 40 | Runtime topology with scaling, deployment windows, recovery objectives |
| 14 | Component design | 34 | Ordering module: responsibility, commands, ports, error set, error boundary |
| 15 | API design | 35 | Commands and queries, idempotency keys, machine-readable error contract with retryable flag |
| 16 | Data design | 36 | Ownership table, transaction boundaries, per-workflow consistency, six-step migration |
| 17 | Workflow | 37 | Confirm → order → capture, with every failure branch and boundary crossing named |
| 18 | State & events | 38 | Order state machine including CAPTURE_UNKNOWN; at-least-once consumers made idempotent |
| 19 | Security | 39 | Trust boundaries, identity into async work, five abuse cases with controls |
| 20 | Review | 48 | Cross-lens review across six groups; findings typed blocking / needs-evidence / accepted risk |
| 21 | Implementation | 22 | Seven standards with guardrails: dependency validator, per-module grants, idempotency in the command bus |
| 22 | Change request | 52 | “The system now needs asynchronous report generation” |
| 23 | Architecture impact | 50 | Four of eight triage questions positive. Affected: runtime, data, UX, operations, reliability |
| 24 | New ADR & updated baseline | 52 | ADR-015 accepted; baseline v1.3 published; four artifacts updated |

> **What to notice on a second reading.** Every structural element traces to a ranked driver. Every
> significant decision has rejected alternatives recorded. The hardest properties of the system — the
> cut-off, the unknown capture state, the batch-only partner — were all discovered in Parts IV and
> VIII, before any technology was chosen. That ordering is the entire method.

---
---

# PART XV — THE PRACTITIONER TOOLKIT

---

## Chapter 65 — Templates

Fifteen templates. Adapt the sections to your organisation once, then keep them stable — a template
that changes every quarter cannot be reviewed against, and comparison across projects is most of the
value.

| Template | Purpose | Created when | Output |
|---|---|---|---|
| Architecture Input Brief (Ch. 15) | Capture everything the architecture must respond to | Start of a new system or major capability | 2–4 pages |
| Architecture Baseline (Ch. 38) | The agreed current architectural model | End of initialization; every architectural change | Living document |
| Architecture Overview (Ch. 53) | Orient a newcomer in ten minutes | Once a baseline exists | 2–5 pages, diagram-led |
| Architecture Decision Record (Ch. 42) | Record one consequential decision | A decision passes the significance test | One page |
| Constraints Register (Ch. 17) | Keep constraints distinct from assumptions | Initialization; reviewed at gates | Table |
| Assumptions Register (Ch. 17) | Stop beliefs becoming facts | Initialization; reviewed quarterly | Table |
| Architecture Risk Register (Ch. 58) | Track architectural risk with triggers | Initialization; every review | Table |
| System Context (Ch. 36) | Agree the boundary | First artifact; on any integration change | Diagram + externals table |
| Container Architecture (Ch. 51) | Describe the runnable parts | After context; before first deploy | Diagram + table |
| Component Design (Ch. 45) | Design one component properly | Before building a significant component | 1–3 pages |
| Sequence / Workflow (Ch. 48) | Show how a capability executes, including failure | Any workflow crossing boundaries | Diagram + step table |
| Data Design (Ch. 47) | Model entities, ownership and consistency | Any new entity or ownership change | 2–4 pages |
| Integration Design (Ch. 36) | Define the agreement with an external system | Before integrating | 1–3 pages |
| Security Design (Ch. 50) | Make security structural | Security lens applied at depth | 2–5 pages |
| Deployment Design (Ch. 51) | Describe how and where it runs | Before first production deploy | Diagram + table |

### Required sections

**Architecture Input Brief** — problem (business / user / system) · actors and external systems ·
goals and non-goals · capabilities in scope · quality requirements with measures · operational
requirements · regulatory requirements · constraints · assumptions with owners and dates · open
questions and what each blocks

**Architecture Baseline** — purpose and scope · system context · major structure with owners ·
drivers ranked and measured · constraints · quality attributes with targets · boundaries and what
crosses them · significant decisions (linked) · assumptions with review dates · open questions ·
version history

**Architecture Overview** — what the system does · context diagram · container diagram with owners ·
the 3–5 decisions that explain the shape · quality attributes · what is deliberately absent · where
to go next

**Architecture Decision Record** — ID and title · status and date · context · problem · drivers ·
options considered · decision criteria · evidence · decision · consequences · risks · rejected
alternatives · related decisions

**Constraints Register** — ID · statement · source · date recorded · decisions affected · status

**Assumptions Register** — ID · statement · owner · date recorded · review date · impact if wrong ·
decisions affected · status

**Architecture Risk Register** — ID · risk statement · likelihood · impact · affected drivers ·
mitigation or containment · trigger that forces action · owner · status

**System Context** — system purpose · actors and needs · external systems (ownership, protocol,
failure, trust, data, exit cost) · context diagram · explicit out of scope · open boundary questions

**Container Architecture** — containers with responsibility and owner · communication between
containers · data stores and ownership · scaling behaviour · deployment independence · configuration
approach · failure behaviour per container

**Component Design** — responsibility in one sentence · interface (commands and queries) ·
dependencies and ports · state held and owned · ownership and reviewers · contracts including error
sets · error boundary behaviour

**Sequence / Workflow** — trigger and preconditions · steps with participants · boundary crossed per
step · failure branch per step · compensations · postconditions and invariants

**Data Design** — entities and owners · relationships · persistence choices · transaction boundaries
· consistency per workflow · caching and invalidation · retention and deletion · migration plan in
reversible steps

**Integration Design** — system and owner · protocol and direction · contract and versioning ·
authentication and trust · failure behaviour and SLA · retry, idempotency and ordering · monitoring
and escalation · exit cost and alternatives

**Security Design** — assets and classification · trust boundaries · identity and propagation ·
authorisation model and location · secrets handling · tenant isolation · abuse cases and controls ·
control failure behaviour · audit requirements

**Deployment Design** — runtime topology · environments · networking and boundaries · scaling units
and triggers · configuration and secrets · deployment process and windows · rollback including data
· recovery objectives and drills

---

## Chapter 66 — Checklists

*Checklists are for recall, not for proof. Evidence lives in your project.*

**New Project Architecture (Ch. 35)**
- [ ] Problem stated at business, user and system level
- [ ] Actors and external systems identified
- [ ] Quality requirements have measures
- [ ] Drivers identified and ranked
- [ ] Constraints separated from assumptions and unknowns
- [ ] Principle set chosen — small, and tied to drivers
- [ ] Lenses selected by risk; skips recorded
- [ ] System boundary agreed and drawn
- [ ] Initial architecture elaborated level by level
- [ ] Every structural element traces to a driver

**Baseline Gate (Ch. 39)**
- [ ] System boundary defined
- [ ] Major actors identified
- [ ] Major capabilities understood
- [ ] Major dependencies identified
- [ ] Architectural shape established
- [ ] Drivers identified and ranked
- [ ] Important risks identified
- [ ] Significant decisions recorded
- [ ] Documentation exists and is findable
- [ ] Owner and reviewer identified

**System Design (Ch. 44)**
- [ ] Component owns a clear responsibility
- [ ] Contracts defined including error sets
- [ ] Dependencies and ports explicit
- [ ] State and ownership defined
- [ ] Consistency stated per workflow
- [ ] Failure branches designed, not assumed
- [ ] Idempotency where retries can occur
- [ ] Security crossings identified
- [ ] Observability signals chosen
- [ ] Migration path is reversible

**Architecture Review (Ch. 59)**
- [ ] Drivers read before the design
- [ ] Boundaries clear and enforced
- [ ] Coupling intentional
- [ ] Data ownership single-writer
- [ ] Consistency appropriate per workflow
- [ ] Trust boundaries explicit
- [ ] Failure modes understood
- [ ] Resources bounded
- [ ] Deployable, observable, recoverable
- [ ] User-visible consequences understood
- [ ] Findings typed with next steps

**Security Lens (Ch. 25)**
- [ ] Trust boundaries drawn
- [ ] Authentication at every entry point
- [ ] Authorisation in one layer, enforced everywhere
- [ ] Identity flows through asynchronous work
- [ ] Secrets never in source, image or logs
- [ ] Tenant scoping enforced in data access
- [ ] Abuse cases considered
- [ ] Controls classed preventive or detective
- [ ] Controls fail closed
- [ ] Sensitive actions audited

**Reliability Lens (Ch. 27)**
- [ ] Failure behaviour defined per dependency
- [ ] Timeouts on every outbound call
- [ ] Retry budgets bounded
- [ ] Idempotency keys where retried
- [ ] Partial failure has an owner
- [ ] Degraded modes designed and tested
- [ ] Recovery path documented
- [ ] Restore practised with a recorded duration

**Operations Lens (Ch. 29)**
- [ ] Deployment independence decided
- [ ] Configuration declared and versioned
- [ ] Signals answer real incident questions
- [ ] Alerts map to user impact
- [ ] Rollback defined including data
- [ ] Runbook first step unambiguous
- [ ] On-call owner named
- [ ] Operational surface accepted by those carrying it

**UX Lens (Ch. 23)**
- [ ] Waiting state designed for each workflow
- [ ] Failure state actionable by the user
- [ ] Recovery possible without losing work
- [ ] Asynchrony expressed honestly
- [ ] Latency budget per user-visible operation
- [ ] Errors carry machine-readable meaning
- [ ] Accessibility not blocked by architecture

**DX Lens (Ch. 24)**
- [ ] Capability findable within an hour
- [ ] Local development possible, or a useful slice
- [ ] Contracts usable without reading implementations
- [ ] Boundaries documented next to the code
- [ ] Guardrails catch violations in seconds
- [ ] Correct path is the convenient path
- [ ] Debugging crosses boundaries with correlation

**Architecture Impact (Ch. 61)**
- [ ] Adds, removes or moves a boundary?
- [ ] Changes ownership of data or capability?
- [ ] Introduces or changes an external dependency?
- [ ] Changes a quality attribute in the drivers?
- [ ] Changes trust boundaries or identity flow?
- [ ] Adds a runtime component?
- [ ] Contradicts a recorded decision or standard?
- [ ] Expensive to reverse once shipped?

**Architecture Evolution (Ch. 63)**
- [ ] Impact assessed and recorded
- [ ] Affected areas identified by lens
- [ ] Options compared against existing drivers
- [ ] New ADR written; superseded ones marked
- [ ] Diagrams updated
- [ ] Baseline version incremented
- [ ] Standards checked — changed or explicitly unchanged
- [ ] Risk register updated
- [ ] Runbook updated
- [ ] Migration path owned

---

## Chapter 67 — Reference

### Principle catalog

Each principle: **intent** · good · bad · trade-off · failure mode · apply · validate.

#### Structure

**Separation of Concerns** — *Keep unrelated responsibilities in places that can change independently.*
- Good: transport, business rules and persistence in separate units; a rule exercised by HTTP, a job and an event without rewriting.
- Bad: a controller that parses the request, applies pricing, writes SQL and calls the payment provider.
- Trade-off: more units, more indirection, more names. Separation not along a real axis of change is pure overhead.
- Failure mode: layer theatre — three folders that must all be edited for every change.
- Apply: split where two responsibilities have different reasons to change, owners, or rates of change.
- Validate: name a likely change and count the units it touches.

**Modularity** — *Organise into units with meaningful, defensible boundaries.*
- Good: an “ordering” module owns its data, exposes an explicit interface, understandable without reading billing.
- Bad: twelve modules that all import each other — a distributed monolith with extra ceremony.
- Trade-off: boundaries cost coordination; cross-boundary changes are slower by design.
- Failure mode: a module for everything. Modularity is not folder count.
- Apply: create a boundary where separation improves changeability, ownership, reasoning or isolation — and you can say which.
- Validate: each module has one sentence of purpose and one accountable team.

**Cohesion** — *Things that change together should live together.*
- Good: pricing rules, discount policy and the price test in one place, because they change in the same PR.
- Bad: a “utils” package holding date maths, currency rounding and PDF rendering.
- Trade-off: high cohesion sometimes means duplicating a little rather than sharing across a boundary.
- Failure mode: grouping by technical type when the real cohesion is by capability.
- Apply: group by what changes together, not by what looks alike.
- Validate: look at the last 20 commits — do they cluster inside units or spray across them?

**Loose Coupling** — *Reduce what one unit must know about another in order to work.*
- Good: a module depends on a narrow interface it defines, not knowing which adapter satisfies it.
- Bad: two services sharing a database table, so a column rename breaks a forgotten system.
- Trade-off: indirection costs readability and debuggability. Every abstraction is a bet about what will vary.
- Failure mode: loose in code, tight in data or deployment — the coupling just moved.
- Apply: couple to contracts, not internals. Narrow, explicit, versioned interfaces.
- Validate: ask what breaks if the other side changes its internals.

**Encapsulation** — *A unit protects its own invariants.*
- Good: an Order enforces its own state transitions; no caller moves it from Cancelled to Shipped.
- Bad: an anaemic record with public fields mutated by five services.
- Trade-off: enforcement inside a unit can make bulk operations and reporting less convenient.
- Failure mode: getters and setters for every field — syntactic encapsulation with no invariant behind it.
- Apply: put the rule where the state lives; expose intent-shaped operations.
- Validate: try to produce an invalid state from outside.

**Information Hiding** — *Hide decisions likely to change behind an interface that is not.*
- Good: callers ask for “available credit” and never learn whether it is computed, cached or fetched.
- Bad: the API returns the database row shape, so storage becomes the public contract.
- Trade-off: hidden information is harder to inspect; observability must be added deliberately.
- Failure mode: hiding stable things while exposing volatile ones.
- Apply: identify what is most likely to change and put the interface there.
- Validate: list what a consumer must know; anything beyond the contract is leakage.

**Explicit Boundaries** — *Make edges visible, named and enforced.*
- Good: a request crossing into the domain is validated, authorised and translated at a named boundary.
- Bad: boundaries exist only in the architect’s head, so every new engineer erodes them by accident.
- Trade-off: explicit boundaries require translation code and ceremony at the edges.
- Failure mode: boundaries drawn in diagrams that nothing in the codebase enforces.
- Apply: name each boundary, state what crosses it, enforce mechanically where you can.
- Validate: a CI dependency check that fails when the boundary is crossed the wrong way.

**Single Responsibility** — *A unit should have one reason to change.*
- Good: the invoice renderer changes when the invoice layout changes, and for no other reason.
- Bad: a “service” class that authenticates, calculates tax, writes to the database and emails the customer.
- Trade-off: taken literally it produces a fog of tiny classes.
- Failure mode: confusing “one responsibility” with “one function”.
- Apply: ask who asks for this to change; two stakeholders suggest a split.
- Validate: describe the unit in one sentence without using “and”.

#### Dependencies

**Dependency Direction** — *Dependencies should point towards stability and meaning.*
- Good: infrastructure depends on the domain; the domain depends on nothing but itself.
- Bad: the domain imports the web framework and database driver, so it cannot be reused or tested alone.
- Trade-off: inverting direction requires interfaces and wiring.
- Failure mode: a correct diagram and an import graph that says the opposite.
- Apply: decide the direction deliberately per boundary, then enforce it.
- Validate: generate the import graph; compare with intent.

**Dependency Inversion** — *Depend on abstractions owned by the consumer.*
- Good: the application defines a PaymentGateway interface; the vendor adapter implements it.
- Bad: the vendor SDK called directly in twelve places, making the vendor an unrevisitable decision.
- Trade-off: an interface with one implementation forever is a cost with no return.
- Failure mode: wrapping a vendor in an interface that mirrors the vendor’s own shape.
- Apply: invert where the provider is likely to change, be swapped, or need faking.
- Validate: can you replace the provider with a test double without touching business code?

**Stable Dependencies** — *Depend towards things that change less often than you do.*
- Good: many modules depend on a small, slow-moving domain model.
- Bad: a core module depending on a fast-moving experimental one.
- Trade-off: stability can become ossification.
- Failure mode: treating “shared” as a synonym for “stable”.
- Apply: before adding a dependency, ask how often the target changes compared with you.
- Validate: track change frequency; look for many-dependents plus high churn.

**Minimise Dependency Surface** — *Depend on as little of another thing as possible.*
- Good: a consumer uses three fields of an event and ignores the rest.
- Bad: a consumer reading the producer’s whole schema, making every internal change breaking.
- Trade-off: narrow surfaces sometimes mean more round trips or explicit mapping.
- Failure mode: “just expose the model” — convenient today, an unremovable contract tomorrow.
- Apply: publish the smallest contract that satisfies the need.
- Validate: count fields and operations actually used versus exposed.

**Composition** — *Build capability by assembling small pieces with explicit wiring.*
- Good: a workflow composes validation, pricing and persistence steps that each stand alone.
- Bad: a deep inheritance hierarchy where behaviour is assembled by accident of ancestry.
- Trade-off: complexity moves into wiring, which must itself stay readable.
- Failure mode: composition so fine-grained that no single place describes what happens.
- Apply: prefer assembling behaviour over specialising it; keep the assembly point explicit.
- Validate: can a reader see the whole workflow in one place?

#### Change

**Localise Change** — *A typical change should touch one place.*
- Good: adding a delivery slot type changes the scheduling module and nothing else.
- Bad: adding a field requires edits in seven repositories and a coordinated release.
- Trade-off: localising one kind of change often spreads another; you are choosing which is cheap.
- Failure mode: optimising for a change that never comes.
- Apply: identify the two or three changes you expect most and make those cheap.
- Validate: trace a recent real change and count touch points.

**Minimise Accidental Coupling** — *Do not create dependencies the problem did not require.*
- Good: two capabilities that both need “a customer” keep their own view of one.
- Bad: a shared “core” library that everything imports, so every change is global.
- Trade-off: avoiding shared code can mean similar logic in two places — sometimes correct.
- Failure mode: DRY applied to code that merely looks alike rather than code that must agree.
- Apply: share only when the users must change together by definition.
- Validate: if one consumer needs a change and the other must not, the coupling was accidental.

**Prefer Simplicity** — *Choose the simplest structure that satisfies defensible drivers.*
- Good: a single well-structured deployable with clear internal boundaries, because no driver demands more.
- Bad: eleven services, a bus and a mesh for four engineers and 300 daily users.
- Trade-off: simple now can mean a migration later — often cheaper than the complexity it avoids.
- Failure mode: confusing “simple” with “easy”.
- Apply: make complexity earn its place by naming the driver it serves.
- Validate: for each structural element, name the driver.

**Avoid Speculative Complexity** — *Do not build for requirements nobody has asked for.*
- Good: a single-tenant model with an explicit note on what would change if multi-tenancy arrived.
- Bad: a plugin framework, a vendor abstraction layer and a rules engine, all unused.
- Trade-off: some speculation is prudent when reversal is very expensive — data residency, for example.
- Failure mode: “we might need it” with no probability, cost or evidence.
- Apply: prepare for change by keeping things small and reversible, not by pre-building.
- Validate: ask who requested it and what evidence supports it.

**Prefer Reversible Decisions** — *When uncertain, choose what is cheaper to undo.*
- Good: isolating a vendor behind an interface while uncertain, then simplifying once proven.
- Bad: spreading a vendor’s data model through the domain during a two-week evaluation.
- Trade-off: reversibility costs indirection now to buy optionality later.
- Failure mode: treating everything as reversible, including data models and public contracts.
- Apply: classify as reversible, expensive to reverse, or effectively permanent; spend evidence accordingly.
- Validate: state the exit cost in the ADR. If nobody can, that is the finding.

#### Reliability

**Failure Isolation** — *One failing part should not take the system with it.*
- Good: report generation runs in a worker; if it fails, checkout is unaffected.
- Bad: a slow third-party call in the request path exhausts the web pool.
- Trade-off: isolation costs runtime units, queues and operational surface.
- Failure mode: “isolated” components sharing a pool, a database or a node.
- Apply: isolate by blast radius — what must stay up when this fails?
- Validate: name the dependency, then state exactly what still works when it is down.

**Graceful Degradation** — *Lose capability, not correctness.*
- Good: recommendations disappear when the recommender is down; the catalogue still sells.
- Bad: a missing avatar service returns 500 for the entire page.
- Trade-off: degraded modes are extra paths that must be designed, built and tested.
- Failure mode: degradation that silently changes meaning — stale prices shown as current.
- Apply: decide per dependency: required, degradable or optional; design the degraded experience.
- Validate: turn the dependency off in a test environment and look.

**Explicit Failure Handling** — *Failures are part of the contract.*
- Good: the API documents its error codes; callers handle timeout, conflict and rejection distinctly.
- Bad: every failure becomes a generic 500.
- Trade-off: explicit error contracts are more work to design and version.
- Failure mode: catch-all handlers converting precise failures into vague ones.
- Apply: enumerate what can fail at each boundary and define the response.
- Validate: for each dependency, point at the code path that handles its timeout.

**Bounded Resources** — *Everything that can grow must have a limit.*
- Good: every outbound call has a timeout; every queue a maximum depth and a dead-letter path.
- Bad: an unbounded retry loop turning a brief outage into self-inflicted denial of service.
- Trade-off: limits cause rejection under load, which must be designed for.
- Failure mode: defaults nobody chose — an infinite client timeout is a decision, just not yours.
- Apply: give every resource an explicit bound and behaviour at the bound.
- Validate: list the timeouts, pool sizes and queue limits. Unknown values are the finding.

**Idempotency Where Required** — *Operations that may be retried must be safe to repeat.*
- Good: payment capture keyed by an idempotency key, so a retry does not charge twice.
- Bad: a timeout on “create order” leaving the caller unable to retry safely.
- Trade-off: keys, storage and deduplication logic with their own lifecycle.
- Failure mode: assuming at-least-once delivery is at-most-once.
- Apply: identify every retryable operation with side effects and give it a key.
- Validate: send the same request twice and inspect the state.

**Recoverability** — *The system must be able to get back to a correct state.*
- Good: restore is practised; there is a documented reconciliation for partial workflows.
- Bad: backups exist and have never been restored.
- Trade-off: recovery capability costs storage, drills and design of reconciliation paths.
- Failure mode: confusing backup with recovery. An untested restore is a hope.
- Apply: for each failure mode, define the path back and who runs it.
- Validate: run the restore; record how long it took.

#### Data

**Explicit Data Ownership** — *Exactly one component owns each piece of data and its rules.*
- Good: orders owned by ordering; billing reads a published, versioned projection.
- Bad: three services write the same table; last writer wins.
- Trade-off: single ownership means others must ask — more calls, copies or events.
- Failure mode: “shared database, shared ownership”, which is nobody’s ownership.
- Apply: write an ownership table; every entity gets exactly one owner.
- Validate: find all writers of each store. More than one owner is a finding.

**Integrity** — *Invalid data should be impossible to create.*
- Good: invariants at the owner plus constraints in the store; corrections are explicit operations.
- Bad: validation only in the browser.
- Trade-off: strict integrity makes imports, migrations and corrections harder.
- Failure mode: nightly “data fixing” scripts becoming permanent operations.
- Apply: enforce at the owner, again in the store, and design deliberate correction paths.
- Validate: attempt to write invalid data through each path that exists.

**Appropriate Consistency** — *Choose the consistency each workflow needs, and make it visible.*
- Good: stock reservation strongly consistent; the sales dashboard eventually consistent, and says so.
- Bad: everything eventually consistent, including money.
- Trade-off: strong consistency costs availability and latency; eventual costs user-visible complexity.
- Failure mode: choosing by infrastructure default rather than workflow requirement.
- Apply: per workflow, state the requirement and the window users may observe.
- Validate: for each eventually consistent path, describe what the user sees inside the window.

**Explicit Data Lifecycle** — *Every entity has a defined birth, change, archive and deletion.*
- Good: retention defined per entity; deletion propagates to derived copies and exports.
- Bad: data accumulates forever; deletion requests cannot be honoured.
- Trade-off: lifecycle rules add work everywhere data is copied.
- Failure mode: deleting in the primary store while copies persist in caches, indexes and backups.
- Apply: define retention and deletion at design time, including derived data.
- Validate: delete a record; then look for it everywhere else.

#### Security

**Least Privilege** — *Minimum access, for the minimum time.*
- Good: the worker has write access to one queue and read access to one bucket.
- Bad: one database user with full rights shared by every service and engineer.
- Trade-off: fine-grained permissions add friction and more things to get wrong.
- Failure mode: privileges broadened during an incident and never narrowed again.
- Apply: derive permissions from what each component actually does; review when it changes.
- Validate: enumerate each identity’s permissions and compare with its behaviour.

**Defence in Depth** — *No single control should be the only thing protecting the data.*
- Good: network restrictions, authenticated calls, authorisation at the domain, constraints in the store.
- Bad: a gateway that validates everything and internal services that trust every caller.
- Trade-off: redundant controls cost latency, complexity and duplicated logic.
- Failure mode: layers that all depend on the same assumption — depth in appearance only.
- Apply: for each asset, list the independent controls protecting it.
- Validate: remove one control on paper and ask what is still true.

**Secure by Design** — *Security is a property of the structure.*
- Good: tenant scoping in the data access path, so a query without a tenant is impossible to express.
- Bad: a security review scheduled for the sprint before launch.
- Trade-off: designing for security constrains some convenient shortcuts.
- Failure mode: a threat model written once and never revisited.
- Apply: include the security lens when shaping boundaries, not after.
- Validate: point at the structural element that makes the bad case impossible rather than detected.

**Explicit Trust Boundaries** — *Name where trust changes; validate what crosses.*
- Good: browsers, partner APIs and internal jobs all treated as untrusted at the boundary.
- Bad: “it is internal” as a reason to skip validation and authorisation.
- Trade-off: validation at every boundary costs performance and duplicated schema knowledge.
- Failure mode: a trust boundary in the diagram but not in the deployment.
- Apply: mark each boundary; define authentication, authorisation and validation at each.
- Validate: call an internal endpoint directly, without going through the gateway.

**Fail Securely** — *When a control fails, deny.*
- Good: if the authorisation service is unreachable, the request is rejected and recorded.
- Bad: a cached “allow” used when the policy service times out.
- Trade-off: failing closed converts a security dependency into an availability dependency.
- Failure mode: exception handlers that skip the check because the check threw.
- Apply: define the failure behaviour of each control explicitly.
- Validate: make the control fail in a test environment and observe what is permitted.

#### Operations

**Observability** — *The system should be able to explain its own behaviour.*
- Good: correlated logs, metrics and traces at every boundary; a failed order followed end to end.
- Bad: debugging by adding print statements and redeploying.
- Trade-off: telemetry costs money, performance and privacy review.
- Failure mode: dashboards full of infrastructure metrics that answer no question a user would ask.
- Apply: decide what questions you must answer in an incident, then instrument for those.
- Validate: pick a real incident and answer its questions from telemetry alone.

**Automation** — *Anything done repeatedly and correctly should be executed by a machine.*
- Good: environments, migrations and deployments scripted and version controlled.
- Bad: a wiki page of manual steps only one person performs correctly.
- Trade-off: automation is code — it has bugs and fails in new ways.
- Failure mode: automating a broken process, so it fails faster and more often.
- Apply: automate steps whose correctness matters and whose repetition is frequent.
- Validate: can a second person produce the same environment without asking anyone?

**Repeatability** — *The same inputs should produce the same system.*
- Good: environments built from declared configuration; builds reproducible from a commit.
- Bad: a production server nobody can rebuild because of changes made during an incident.
- Trade-off: reproducibility constrains ad-hoc fixes — the point, and occasionally painful.
- Failure mode: reproducible infrastructure with hand-edited configuration inside it.
- Apply: treat environment and configuration as declared artifacts.
- Validate: rebuild an environment from scratch and compare.

**Operational Recoverability** — *Getting back to healthy is designed and practised.*
- Good: rollback defined including data; restore drilled; the runbook names the first action.
- Bad: rollback means redeploying and hoping the migration was backward compatible.
- Trade-off: backward-compatible change is slower to write.
- Failure mode: a rollback plan that cannot run because the schema moved forward.
- Apply: design forward and backward paths together; practise them.
- Validate: roll back a real deployment in a non-production environment and time it.

### Lens catalog

| Lens | Chapter | Focus | Evidence it needs |
|---|---|---|---|
| Engineering | 10 | Structure, cohesion, coupling, dependency direction, maintainability, testability, complexity | Module/dependency graph · change-impact walkthrough · test pyramid |
| Product & Business | 11 | Capabilities, product evolution, domain boundaries, critical workflows, value vs complexity | Capability map · roadmap over boundaries · risk annotation on critical workflows |
| UX | 12 | Workflows, latency, state, failure experiences, interruptions, accessibility, recovery | Latency budget per step · failure-state wireframes · interruption walkthrough |
| Developer Experience | 13 | Discoverability, local development, contracts, tooling, debugging, safe change | Onboarding walkthrough with timings · local-dev setup · contract artifacts |
| Security | 14 | Identity, authn/authz, trust boundaries, secrets, tenant isolation, threats, auditability | Trust-boundary diagram · threat model · authorisation matrix · audit sample |
| Data | 15 | Ownership, source of truth, lifecycle, consistency, integrity, migration, retention, privacy | Ownership table · consistency per workflow · retention policy · migration plan |
| Reliability | 16 | Failure modes, partial failure, retries, timeouts, idempotency, recovery, degradation | Failure-mode table · timeout/retry budget · idempotency design · recovery runbook |
| Performance | 17 | Latency, throughput, concurrency, resources, hot paths, growth, capacity, bottlenecks | Latency budget per hop · load tests at 1× and 3× · capacity model |
| Operations | 18 | Deployment, configuration, observability, incident response, rollback, capacity | Deployment topology · signals per boundary · rollback procedure · on-call runbook |
| Cost *(conditional)* | 19 | Unit economics, fixed vs variable, idle capacity, operational effort | Unit cost model · cost per environment · 10× traffic scenario |
| Compliance *(conditional)* | 19 | Obligations, residency, auditability, evidence, retention, separation of duties | Obligation-to-control mapping · residency map · audit evidence sample |
| Accessibility *(conditional)* | 19 | Whether architecture permits an accessible experience — timing, state, rendering, errors | Error contract with machine-readable codes · timing review · rendering decision |

### Diagram catalog

| Diagram | Answers | Level | Update trigger |
|---|---|---|---|
| Context | What is the system and what surrounds it? | 0 | Integration added or removed |
| Container | What are the major runnable parts? | 1 | Component added, removed or renamed |
| Component | What is inside one container? | 2 | Significant internal restructure |
| Sequence | How does this request work, including failures? | 3 | Workflow or contract change |
| Data flow | How does data move, across which trust boundaries? | 2–3 | New data path or store |
| State machine | How does this entity change state? | 3 | New state or transition |
| Deployment | Where does it run and how does it scale? | 1 | Topology or scaling change |
| Integration | How do we talk to that external system? | 1–2 | Protocol or contract change |
| Workflow | How does the business process run end to end? | 0–1 | Process change |

### ADR catalog — worked example

| ID | Title | Status | Drivers | Related |
|---|---|---|---|---|
| ADR-001 | Modular monolith with enforced boundaries | Accepted | Small team; payment correctness | ARC-001, ARC-004 |
| ADR-002 | Cut-off enforced as an ordering invariant | Accepted | Payment correctness; cut-off peak | ADR-001 |
| ADR-003 | Harvest confirmation is asynchronous | Accepted | Harvest variability | ADR-004 |
| ADR-004 | Payment capture in worker with idempotency keys | Accepted | Payment correctness | ADR-001, R-02 |
| ADR-009 | Refunds for removed items automatic under a threshold | Accepted | Harvest variability; support load | ADR-003 |
| ADR-014 | Reporting reads from a replica | Accepted | Operational simplicity | ARC-004, EX-11 |
| ADR-015 | Report generation is an async job with stored artifacts | Accepted | Farm autonomy; operational safety | ADR-014, ADR-004 |

### Standards examples

| ID | Statement | Verified by |
|---|---|---|
| ARC-001 | Domain modules must not import transport or persistence packages | CI dependency-boundary validator |
| ARC-002 | Every state-changing endpoint accepts and honours an idempotency key | Contract tests |
| ARC-003 | Every outbound call has an explicit timeout and retry budget | Static check on the HTTP client wrapper |
| ARC-004 | Each entity has exactly one writing owner | Per-module grants; schema-ownership CI check |
| ARC-005 | Errors expose a stable machine-readable code and a retryable flag | Schema lint on the error contract |
| ARC-006 | No secret may appear in source, image or log output | Secret scanning; log schema validation |
| ARC-007 | Every migration must be backward compatible for one release | Pipeline gate comparing migration to deployed version |

### Terminology

| Term | Means |
|---|---|
| Abuse case | A way the system could be deliberately misused, used to derive controls |
| ADR | Architecture Decision Record — a dated record of one consequential decision and its reasoning |
| Anti-corruption layer | A translation boundary stopping an external model leaking into your domain |
| Architectural driver | A requirement or quality attribute that materially shapes structure |
| Architectural significance | The property of being expensive to reverse or constraining to others |
| Assumption | Believed true, not yet verified; needs an owner, a date and an impact-if-wrong |
| Baseline | The agreed current architectural model of a system |
| Boundary | A named edge where responsibility, trust, ownership or deployment changes |
| Component | A unit with a responsibility and an explicit interface |
| Constraint | Must be true; not negotiable by this team |
| Container | An independently deployable or runnable unit |
| Consistency window | The period during which a reader may observe stale data |
| Degraded mode | A designed reduced-capability state used when a dependency is unavailable |
| Dependency direction | Which way dependencies point — a decision, not an accident |
| Evidence | Observation that could have changed the decision it supports |
| Gate | An objective check that enough uncertainty has been removed to proceed |
| Guardrail | A mechanism that makes a rule cheap to follow and expensive to violate |
| Idempotency key | A caller-supplied identifier that makes a repeated operation safe |
| Invariant | Something that must always be true of a piece of state |
| Lens | A discipline-specific set of questions applied to an architecture |
| Outbox | A table written in the same transaction as a state change, relayed as an event afterwards |
| Pattern | One proven way to satisfy a standard; recommended, never mandatory |
| Principle | A reasoning guide for shaping structure, with an intent and a trade-off |
| Quality attribute | A measurable property of the system, such as latency or availability |
| Reversibility | How expensive a decision is to undo; determines how much evidence it deserves |
| Source of truth | The single place where a piece of data is authoritative |
| Standard | A normative, testable statement of what must be true |
| Trust boundary | A place where the level of trust changes and validation is required |
| Unknown | An open question whose answer would change a decision |

---

## One final structural principle

Do not make the handbook’s primary hierarchy *architecture → diagrams → ADRs → patterns →
technologies*. That is the wrong learning order.

Make it:

> **Problem → Drivers → Principles → Lenses → Decisions → Architecture → Baseline → System Design →
> Evidence → Review → Evolution.**

Then diagrams, ADRs, standards, patterns and templates become **tools used by the process**, rather
than the process itself.

---

*Architecture &amp; System Design Handbook — text edition. The interactive edition is
`architecture-handbook.html`: same content, with interactive diagrams, a principle explorer, a lens
selector and matrix, progressive decomposition, a workflow player, a failure simulator, an ADR
viewer, gates, and an architecture evolution simulation.*
