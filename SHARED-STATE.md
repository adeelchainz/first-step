# Shared state for `squid-backlog.html`

Everything the page lets you tick, assign, move or block used to live in one
browser's localStorage and nowhere else. This adds a small server so the whole
team sees the same backlog.

## Start it

```bash
node squid-server.mjs
```

Then open **http://127.0.0.1:8787** and choose your name from the pill in the
top right. That is the whole setup.

For the team, put it on the network with a token:

```bash
node squid-server.mjs --host 0.0.0.0 --token pick-something
```

Everyone opens `http://<your-machine>:8787`, enters the token once, picks their
name, and the backlog is shared from then on.

| | |
|---|---|
| `--port <n>` | default `8787` |
| `--host <addr>` | default `127.0.0.1`; `0.0.0.0` puts it on the network |
| `--token <s>` | require this token |
| `--page <path>` | which HTML file to serve |
| `--data <path>` | where state is kept, default `squid-state.json` beside it |

No dependencies. Node 18 or newer. One file.

## What it does and does not do

**Nothing is taken away.** Open `squid-backlog.html` straight from disk and it
behaves exactly as before — every tick goes to localStorage, no network, no
server. Open it from the server and the same page starts sharing. A single file
you can email is a real property, not a limitation to engineer away.

**Changes travel as operations, not snapshots.** The page sends *"set this one
tick"*, never *"here is my entire state"*. Two people ticking different things
can never overwrite each other, which a snapshot guarantees they eventually
will. Two people ticking the *same* thing is last-write-wins, which is right: a
tick is a claim about the world, and the later claim is the current one.

**Every change records who made it.** That is something localStorage could never
do — the page can now say a step was ticked by Muhammad Salman, and when.

**It is not authentication.** The token keeps out passers-by on the same
network. It does not tell two people apart, and anyone holding it can act as
anyone. Names are typed, not verified. If you need accounts that can be trusted,
that is [`squid-app/`](squid-app/README.md), not this. The startup banner says so
rather than letting anyone assume otherwise.

## Shared, and not shared

| Shared with everyone | Stays in your browser |
|---|---|
| Ticks — steps, tasks, criteria, test cases, gate conditions, Definition of Done | Light or dark theme |
| Who is carrying each story and task | Which columns are shown |
| Execution state, and whether it was asserted by hand | Filters, search, the sprint you are looking at |
| Blocked flags | Which rows you have expanded |
| Sprint capacity, team size, the first Monday | |

The split matters. Sharing a filter would mean one person rearranging everyone
else's screen.

## When the connection drops

Changes queue in the browser and go up when the server returns, so a flaky
connection costs nothing. Repeated changes to one thing collapse to the last
one — ticking something on and off four times offline arrives as whatever it
ended up as. The pill in the header says `Offline` and how many changes are
waiting.

Joining a server for the first time takes the team's state as it stands rather
than quietly merging yours into it. If you did work offline that should count,
use **Send everything in this browser** in the Shared state panel and it goes up
as ordinary changes.

## The state file

`squid-state.json`, beside the server. Plain JSON you can read, diff, copy and
back up:

```json
{ "version": 412,
  "items": {
    "checks/01.1.03-S2-T1-4": { "v": 1, "by": "Muhammad Salman", "at": 1761… },
    "assign/01.1.03-S2":      { "v": "E10", "by": "Adeel", "at": 1761… },
    "stage/01.1.03-S2":       { "v": "merged", "by": "Adeel", "at": 1761… },
    "cfg/capacity":           { "v": 15, "by": "Adeel", "at": 1761… } } }
```

Written atomically — a temp file, then a rename — so a crash mid-write leaves
the last good file rather than a truncated one. Backing it up is `cp`.

At this volume a database would be more moving parts for no more safety, and a
file you can open when something goes wrong is worth a lot.

## Verifying it

```bash
node ssmoke9.js     # 45 checks, from the scratchpad
```

It starts a real server, opens **two** browsers against it, and checks the claim
the whole feature rests on: a tick in one appears in the other, two people
changing different things lose nothing, the queue survives the server going away
and drains when it returns, and a token is actually enforced.
