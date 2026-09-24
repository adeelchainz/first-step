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
Then use Part XI to evolve that architecture safely.

If you have an **existing system**, start at Chapter 2 (the two entry modes), then go to Part XI
and borrow from Parts VII and VIII as the change requires.

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
- **Part II — Drivers** · 4 Understanding the Problem · 5 Architectural Drivers · 6 Constraints, Assumptions & Unknowns
- **Part III — Universal Architecture Principles** · 7 Principles of Good Architecture · 8 Applying Principles Without Becoming Dogmatic
- **Part IV — Architecture Lenses** · 9 The Lens Model · 10 Engineering · 11 Product & Business · 12 UX · 13 Developer Experience · 14 Security · 15 Data · 16 Reliability · 17 Performance · 18 Operations · 19 Cost, Compliance & Accessibility · 20 Cross-Lens Review
- **Part V — From Principles to Standards** · 21 Principles → Standards · 22 Architecture Standards · 23 Patterns & Reference Architectures
- **Part VI — Architecture Initialization** · 24 Starting a New Project · 25 Establishing System Context · 26 Establishing the Initial Architecture · 27 Architecture Baseline · 28 Architecture Baseline Gate
- **Part VII — Architectural Decision-Making** · 29 What Is an Architectural Decision? · 30 Decision Framework · 31 Architecture Decision Records · 32 Evidence, Experiments & Spikes
- **Part VIII — System Design** · 33 From Architecture to System Design · 34 Designing Components · 35 API & Contract Design · 36 Data Design · 37 Workflow & Sequence Design · 38 State & Event Design · 39 Security Design · 40 Runtime & Deployment Design
- **Part IX — Architecture Documentation** · 41 Documentation as a System · 42 Document Types · 43 How to Write Architecture Documents · 44 Diagramming · 45 How to Draft a Diagram · 46 Diagram Quality
- **Part X — Architecture Review** · 47 Reviewing Architecture · 48 Review Checklist · 49 Architecture Gates
- **Part XI — Architecture Evolution** · 50 Architecture Impact · 51 Architecture Debt · 52 Evolving the Baseline
- **Part XII — Complete Worked Example** · 53 Farm Commerce Platform, End to End
- **Part XIII — The Practitioner Toolkit** · 54 Templates · 55 Checklists · 56 Reference

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

**Related:** Ch. 2 Lifecycle · Ch. 3 Architectural Thinking · Ch. 5 Drivers · Ch. 29 Decisions · Ch. 41 Documentation

---

## Chapter 2 — The Architecture Lifecycle

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
*Route:* Parts II → VI → VII, then the baseline gate in Chapter 28.

**B — Existing system → assess architectural impact.** A baseline exists, explicitly or implicitly.
Determine whether a proposed change alters structure, boundaries, ownership, trust or quality
attributes — and if so, run a scoped version of the same process.
*Route:* Part XI, borrowing from Parts VII and VIII as needed.

> **The most common lifecycle error.** Treating every change as mode A (re-architecting on every
> ticket), or as neither (no impact assessment at all, until the boundary has quietly disappeared).

### What happens at each stage

| Stage | You produce | You stop when |
|---|---|---|
| Initialization | Input brief, drivers, constraints, candidate principles, relevant lenses | The problem is understood well enough to shape a boundary |
| Baseline | Context, major structure, decisions, assumptions, open questions | The baseline gate passes (Ch. 28) |
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
needs a record (Chapter 31).

### ✓ Checkpoint

- State a problem without implying a solution
- Separate a constraint from an assumption from a preference
- Classify a decision by reversibility and choose evidence accordingly
- Name what a favoured design makes hard

---
---

# PART II — DRIVERS

*Architecture responds to something. This part is about finding out what, precisely — and
separating what must be true from what we merely believe.*

---

## Chapter 4 — Understanding the Problem

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

## Chapter 5 — Architectural Drivers

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

## Chapter 6 — Constraints, Assumptions & Unknowns

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

# PART III — UNIVERSAL ARCHITECTURE PRINCIPLES

*Principles are the reasoning patterns used to shape a system — and they are decision guides, not
laws. This part gives you both halves. The full 37-principle catalog is in Chapter 56.*

---

## Chapter 7 — Principles of Good Architecture

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

Every principle in this handbook carries six faces, and the full catalog in **Chapter 56** gives
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

## Chapter 8 — Applying Principles Without Becoming Dogmatic

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

# PART IV — ARCHITECTURE LENSES

*A principle tells you how architecture should be shaped. A lens tells you which concern you are
examining. Same architecture, different perspective.*

---

## Chapter 9 — The Architecture Lens Model

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
> the drivers you ranked in Chapter 5. Applying all nine at full depth to everything is how
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

## Chapter 10 — Engineering Lens

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

## Chapter 11 — Product & Business Lens

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

## Chapter 12 — UX Lens

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

## Chapter 13 — Developer Experience Lens

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

## Chapter 14 — Security Lens

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

## Chapter 15 — Data Lens

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

## Chapter 16 — Reliability & Resilience Lens

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

## Chapter 17 — Performance & Scalability Lens

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

## Chapter 18 — Operations Lens

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

## Chapter 19 — Cost, Compliance & Accessibility Lenses

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

## Chapter 20 — Cross-Lens Architecture Review

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

# PART V — FROM PRINCIPLES TO STANDARDS

*A principle nobody can check is a preference. This part is the machinery that turns reasoning into
something a codebase actually obeys.*

---

## Chapter 21 — Principles → Standards

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

## Chapter 22 — Architecture Standards

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

## Chapter 23 — Patterns & Reference Architectures

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

# PART VI — ARCHITECTURE INITIALIZATION

*You have a new project. This part takes you from “we have a problem” to “we have a defensible
baseline”.*

---

## Chapter 24 — Starting a New Project

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
| Understand product | Input brief (Ch. 4) | Accepting the feature list as the problem statement |
| Identify drivers | Ranked, measured drivers (Ch. 5) | Everything is a driver, so nothing is |
| Identify constraints | Register (Ch. 6) | Recording preferences as constraints to win an argument |
| Identify principles | A short list your team will use | Adopting all 37 and applying none |
| Identify lenses | Which get depth, which are skipped | Applying all of them shallowly |
| Establish boundary | Context diagram (Ch. 25) | Drawing internals before the edge is agreed |
| Define initial architecture | Containers and major components (Ch. 26) | Designing level 4 on day two |

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

## Chapter 25 — Establishing System Context

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

## Chapter 26 — Establishing the Initial Architecture

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
inside the API are the next level down — Chapter 33’s business, not today’s.

> **Why each step names a driver.** Because that is the review. Any element that cannot name the
> driver it serves is a candidate for removal — and this is the only moment when removing it is cheap.

### How far down to go

- **Go deep enough** that a team can start work without inventing architecture on the fly
- **Stop** before designing the internals of a component nobody has built yet
- **Go deeper only where risk is** — payment reconciliation deserves detail now; the admin catalogue screen does not
- **Record what you deliberately did not decide**, as an open question with the trigger that will force it

---

## Chapter 27 — Architecture Baseline

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

## Chapter 28 — Architecture Baseline Gate

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
| Risks not identified | Assumptions never separated from facts | Run Chapter 6 on the current understanding |
| No reviewer | No second architect available | Use a senior engineer from an adjacent team; outside eyes matter more than title |

---
---

# PART VII — ARCHITECTURAL DECISION-MAKING

*Decisions are the durable part of architecture. Structures change; the reasoning is what lets the
next person change them safely.*

---

## Chapter 29 — What Is an Architectural Decision?

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

## Chapter 30 — Decision Framework

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

## Chapter 31 — Architecture Decision Records

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

## Chapter 32 — Evidence, Experiments & Spikes

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

# PART VIII — SYSTEM DESIGN

*Architecture says what the system is shaped like. System design says how a particular capability
actually works — in enough detail to build safely, and no more.*

---

## Chapter 33 — From Architecture to System Design

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

## Chapter 34 — Designing Components

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

## Chapter 35 — API & Contract Design

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

## Chapter 36 — Data Design

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

## Chapter 37 — Workflow & Sequence Design

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

## Chapter 38 — State & Event Design

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

## Chapter 39 — Security Design

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

## Chapter 40 — Runtime & Deployment Design

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

# PART IX — ARCHITECTURE DOCUMENTATION

*How to write and draw architecture: document types, drafting procedures, diagram selection, and
what separates a diagram that teaches from one that decorates.*

---

## Chapter 41 — Documentation as a System

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

## Chapter 42 — Architecture Document Types

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

## Chapter 43 — How to Write Architecture Documents

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

## Chapter 44 — Diagramming

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

## Chapter 45 — How to Draft a Diagram

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

## Chapter 46 — Diagram Quality

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

# PART X — ARCHITECTURE REVIEW

---

## Chapter 47 — Reviewing Architecture

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

## Chapter 48 — Architecture Review Checklist

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

## Chapter 49 — Architecture Gates

| Gate | Passes when | Fails usefully by |
|---|---|---|
| Baseline | Architecture established and documented (Ch. 28) | Naming which of the ten criteria is missing |
| Detailed design | Enough detail to implement safely (Ch. 33) | Identifying the unanswered design question |
| Change | Architectural impact understood (Ch. 50) | Showing which areas are affected and unexamined |
| Review | Relevant concerns examined through the right lenses | Listing the lens that has not been applied |
| Evolution | The baseline again describes reality (Ch. 52) | Naming the document that no longer matches the system |

> **Gates fail when they become schedule events.** The moment a gate is a date rather than a state,
> it is passed by assertion. Keep criteria objective, keep evidence attached, and make failing a gate
> a normal, low-drama outcome that produces a next action rather than a negotiation.

---
---

# PART XI — ARCHITECTURE EVOLUTION

---

## Chapter 50 — Architecture Impact

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

## Chapter 51 — Architecture Debt

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

## Chapter 52 — Evolving the Baseline

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

# PART XII — COMPLETE WORKED EXAMPLE

## Chapter 53 — Farm Commerce Platform, End to End

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
> cut-off, the unknown capture state, the batch-only partner — were all discovered in Parts II and
> VI, before any technology was chosen. That ordering is the entire method.

---
---

# PART XIII — THE PRACTITIONER TOOLKIT

---

## Chapter 54 — Templates

Fifteen templates. Adapt the sections to your organisation once, then keep them stable — a template
that changes every quarter cannot be reviewed against, and comparison across projects is most of the
value.

| Template | Purpose | Created when | Output |
|---|---|---|---|
| Architecture Input Brief (Ch. 4) | Capture everything the architecture must respond to | Start of a new system or major capability | 2–4 pages |
| Architecture Baseline (Ch. 27) | The agreed current architectural model | End of initialization; every architectural change | Living document |
| Architecture Overview (Ch. 42) | Orient a newcomer in ten minutes | Once a baseline exists | 2–5 pages, diagram-led |
| Architecture Decision Record (Ch. 31) | Record one consequential decision | A decision passes the significance test | One page |
| Constraints Register (Ch. 6) | Keep constraints distinct from assumptions | Initialization; reviewed at gates | Table |
| Assumptions Register (Ch. 6) | Stop beliefs becoming facts | Initialization; reviewed quarterly | Table |
| Architecture Risk Register (Ch. 47) | Track architectural risk with triggers | Initialization; every review | Table |
| System Context (Ch. 25) | Agree the boundary | First artifact; on any integration change | Diagram + externals table |
| Container Architecture (Ch. 40) | Describe the runnable parts | After context; before first deploy | Diagram + table |
| Component Design (Ch. 34) | Design one component properly | Before building a significant component | 1–3 pages |
| Sequence / Workflow (Ch. 37) | Show how a capability executes, including failure | Any workflow crossing boundaries | Diagram + step table |
| Data Design (Ch. 36) | Model entities, ownership and consistency | Any new entity or ownership change | 2–4 pages |
| Integration Design (Ch. 25) | Define the agreement with an external system | Before integrating | 1–3 pages |
| Security Design (Ch. 39) | Make security structural | Security lens applied at depth | 2–5 pages |
| Deployment Design (Ch. 40) | Describe how and where it runs | Before first production deploy | Diagram + table |

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

## Chapter 55 — Checklists

*Checklists are for recall, not for proof. Evidence lives in your project.*

**New Project Architecture (Ch. 24)**
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

**Baseline Gate (Ch. 28)**
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

**System Design (Ch. 33)**
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

**Architecture Review (Ch. 48)**
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

**Security Lens (Ch. 14)**
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

**Reliability Lens (Ch. 16)**
- [ ] Failure behaviour defined per dependency
- [ ] Timeouts on every outbound call
- [ ] Retry budgets bounded
- [ ] Idempotency keys where retried
- [ ] Partial failure has an owner
- [ ] Degraded modes designed and tested
- [ ] Recovery path documented
- [ ] Restore practised with a recorded duration

**Operations Lens (Ch. 18)**
- [ ] Deployment independence decided
- [ ] Configuration declared and versioned
- [ ] Signals answer real incident questions
- [ ] Alerts map to user impact
- [ ] Rollback defined including data
- [ ] Runbook first step unambiguous
- [ ] On-call owner named
- [ ] Operational surface accepted by those carrying it

**UX Lens (Ch. 12)**
- [ ] Waiting state designed for each workflow
- [ ] Failure state actionable by the user
- [ ] Recovery possible without losing work
- [ ] Asynchrony expressed honestly
- [ ] Latency budget per user-visible operation
- [ ] Errors carry machine-readable meaning
- [ ] Accessibility not blocked by architecture

**DX Lens (Ch. 13)**
- [ ] Capability findable within an hour
- [ ] Local development possible, or a useful slice
- [ ] Contracts usable without reading implementations
- [ ] Boundaries documented next to the code
- [ ] Guardrails catch violations in seconds
- [ ] Correct path is the convenient path
- [ ] Debugging crosses boundaries with correlation

**Architecture Impact (Ch. 50)**
- [ ] Adds, removes or moves a boundary?
- [ ] Changes ownership of data or capability?
- [ ] Introduces or changes an external dependency?
- [ ] Changes a quality attribute in the drivers?
- [ ] Changes trust boundaries or identity flow?
- [ ] Adds a runtime component?
- [ ] Contradicts a recorded decision or standard?
- [ ] Expensive to reverse once shipped?

**Architecture Evolution (Ch. 52)**
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

## Chapter 56 — Reference

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
