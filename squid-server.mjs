#!/usr/bin/env node
/* ============================================================================
   SQUID SYNC SERVER
   ----------------------------------------------------------------------------
   One file, no dependencies, Node's own http module. It does three things:

     1. serves squid-backlog.html
     2. keeps the shared working state — ticks, assignments, execution states,
        blocked flags, the sprint configuration
     3. pushes every change to everyone else who has the page open

   WHY IT IS SHAPED LIKE THIS

   The page already worked offline with localStorage, and that is worth
   keeping: a single file you can email is a real property, not a limitation to
   be engineered away. So this is additive. Open the file directly and nothing
   changes. Open it from this server and the same page starts sharing.

   Clients send OPERATIONS, never snapshots. "Set checks/01.1.03-S2-T1-4 to 1"
   rather than "here is my entire state". Two people ticking different things
   can never clobber each other, which a last-writer-wins snapshot guarantees
   they will. Two people ticking the SAME thing is last-write-wins, which is
   correct: a tick is a claim about the world, and the later claim is the more
   current one. Every operation records who made it and when, so the page can
   say "ticked by Muhammad Salman, four minutes ago" — something localStorage
   could never do.

   Storage is one JSON file written atomically. At this volume — a few tens of
   thousands of small entries — a database would be more moving parts for no
   more safety, and a file you can open, read, diff and copy is worth a great
   deal when something goes wrong.

   WHAT THIS IS NOT

   It is not authentication. A shared token keeps out passers-by on the same
   network; it does not tell two people apart, and anyone with the token can
   act as anyone. If you need real accounts, that is the Next.js app in
   squid-app/, not this. The startup banner says so rather than letting anyone
   assume otherwise.

   Usage:
     node squid-server.mjs
     node squid-server.mjs --port 8787 --host 0.0.0.0 --token letmein
     SQUID_TOKEN=letmein node squid-server.mjs

   Defaults to 127.0.0.1, so it is not on the network until you say so.
   ========================================================================= */
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID, timingSafeEqual } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));

/* ---------------------------------------------------------------- options */
function options(argv) {
  /* PORT is how every container platform — Render, Fly, Heroku, Cloud Run
     — tells a process where to listen, and a process that ignores it is
     marked unhealthy and killed. Its presence also means we are in a
     container, where binding to loopback makes the service unreachable,
     so the default host follows it. */
  const platformPort = Number(process.env.PORT) || 0;
  const o = {
    port: platformPort || Number(process.env.SQUID_PORT) || 8787,
    host: process.env.SQUID_HOST || (platformPort ? '0.0.0.0' : '127.0.0.1'),
    token: process.env.SQUID_TOKEN || '',
    file: process.env.SQUID_PAGE || path.join(here, 'squid-backlog.html'),
    data: process.env.SQUID_DATA || path.join(here, 'squid-state.json')
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i] ?? '';
    if (a === '--port' || a === '-p') o.port = Number(next());
    else if (a === '--host' || a === '-h') o.host = next();
    else if (a === '--token' || a === '-t') o.token = next();
    else if (a === '--page') o.file = path.resolve(next());
    else if (a === '--data') o.data = path.resolve(next());
    else if (a === '--help') {
      console.log(
        'squid-server — shared state for squid-backlog.html\n\n' +
          '  --port   <n>     default 8787\n' +
          '  --host   <addr>  default 127.0.0.1; use 0.0.0.0 to reach it from the network\n' +
          '  --token  <s>     require this token; without one, anyone who can reach the port can write\n' +
          '  --page   <path>  the HTML file to serve\n' +
          '  --data   <path>  where the shared state is kept\n\n' +
          'Environment:\n' +
          '  PORT             set by Render, Fly, Heroku and the like; also flips the host to 0.0.0.0\n' +
          '  SQUID_TOKEN      required before it will listen on anything but loopback\n' +
          '  SQUID_DATA       where to keep state; point at a mounted disk in a container\n' +
          '  SQUID_ALLOW_OPEN=1  run without a token on a public address, deliberately\n'
      );
      process.exit(0);
    }
  }
  return o;
}
const opts = options(process.argv.slice(2));

/* ------------------------------------------------------------------ state */
/* One flat map, namespaced by prefix, so a single file and a single operation
   type cover every kind of shared change:

     checks/<id>    a tick: a step, a task, a criterion, a case, a gate row
     assign/<id>    who is carrying a story or a task
     stage/<id>     an execution state asserted by hand
     blocked/<id>   the blocked flag
     cfg/<name>     sprint capacity, members, first Monday

   Personal preferences — theme, which columns are shown, which filter you
   have on, which sprint you are looking at — are deliberately NOT here. They
   stay in each person's browser, because sharing them would mean one person
   changing a filter rearranges everyone else's screen. */
const PREFIXES = ['checks/', 'assign/', 'stage/', 'blocked/', 'cfg/'];
const LOG_CAP = 4000;

const state = {
  version: 0,
  items: Object.create(null),
  /* A ring of recent operations so a client that was away for a minute can
     catch up with a delta instead of re-downloading everything. Older than
     the ring and it gets a full snapshot — correct either way, just larger. */
  log: []
};

function load() {
  try {
    const raw = fs.readFileSync(opts.data, 'utf8');
    const d = JSON.parse(raw);
    if (d && typeof d === 'object') {
      state.version = Number(d.version) || 0;
      state.items = Object.assign(Object.create(null), d.items || {});
      state.log = Array.isArray(d.log) ? d.log.slice(-LOG_CAP) : [];
    }
    console.log(
      `loaded ${Object.keys(state.items).length.toLocaleString()} entries at version ${state.version} from ${opts.data}`
    );
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(`Could not read ${opts.data}: ${e.message}`);
      console.error('Refusing to start rather than overwrite a file that may hold real work.');
      process.exit(1);
    }
    console.log(`no state file yet; one will be written to ${opts.data}`);
  }
}

/* Debounced, and atomic: write a temp file then rename, so a crash mid-write
   leaves the previous good file rather than a truncated one. */
let saveTimer = null;
let saving = false;
let dirty = false;
async function saveNow() {
  if (saving) {
    dirty = true;
    return;
  }
  saving = true;
  dirty = false;
  const tmp = opts.data + '.' + randomUUID().slice(0, 8) + '.tmp';
  try {
    const body = JSON.stringify(
      { version: state.version, updatedAt: new Date().toISOString(), items: state.items, log: state.log },
      null,
      0
    );
    await fsp.writeFile(tmp, body, 'utf8');
    await fsp.rename(tmp, opts.data);
  } catch (e) {
    console.error('could not save state:', e.message);
    await fsp.rm(tmp, { force: true }).catch(() => {});
  } finally {
    saving = false;
    if (dirty) void saveNow();
  }
}
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void saveNow();
  }, 400);
}

/* ------------------------------------------------------------- applying */
const okKey = (k) =>
  typeof k === 'string' && k.length > 0 && k.length <= 200 && PREFIXES.some((p) => k.startsWith(p));

/* A value is a tick (1), a cleared tick (null), or a short scalar. Anything
   else is refused: this map is not a place to put arbitrary documents, and
   keeping it boring is what keeps the file small and readable. */
function okValue(v) {
  if (v === null || v === true || v === false) return true;
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'string') return v.length <= 120;
  return false;
}

function apply(ops, by) {
  const applied = [];
  const at = Date.now();
  for (const op of ops) {
    if (!op || !okKey(op.k) || !okValue(op.v)) continue;
    state.version++;
    const entry = { version: state.version, k: op.k, v: op.v, by, at };
    if (op.v === null || op.v === false) delete state.items[op.k];
    else state.items[op.k] = { v: op.v, by, at };
    state.log.push(entry);
    applied.push(entry);
  }
  if (state.log.length > LOG_CAP) state.log.splice(0, state.log.length - LOG_CAP);
  if (applied.length) {
    scheduleSave();
    broadcast(applied);
  }
  return applied;
}

/* --------------------------------------------------------------- clients */
const clients = new Set();
function broadcast(ops) {
  const frame = `event: ops\ndata: ${JSON.stringify({ version: state.version, ops })}\n\n`;
  for (const c of clients) {
    try {
      c.res.write(frame);
    } catch {
      clients.delete(c);
    }
  }
}
setInterval(() => {
  /* A comment line keeps proxies and browsers from deciding the stream is
     dead. It costs two bytes a client every twenty-five seconds. */
  for (const c of clients) {
    try {
      c.res.write(': ping\n\n');
    } catch {
      clients.delete(c);
    }
  }
}, 25000).unref();

/* ------------------------------------------------------------------ http */
const json = (res, code, body, extra = {}) => {
  const s = JSON.stringify(body);
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(s),
    'cache-control': 'no-store',
    ...cors(),
    ...extra
  });
  res.end(s);
};

/* The page may be opened straight from disk, in which case its origin is the
   string "null". Allowing that is what lets a file:// copy sync, and the
   token is what stops it being an open door. */
const cors = () => ({
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, x-squid-token',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-max-age': '86400'
});

function authorised(req, url) {
  if (!opts.token) return true;
  const given = String(req.headers['x-squid-token'] ?? url.searchParams.get('token') ?? '');
  const a = Buffer.from(given);
  const b = Buffer.from(opts.token);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function readBody(req, limit = 2 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('too large');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function snapshot() {
  return { full: true, version: state.version, items: state.items };
}
function since(v) {
  const oldest = state.log.length ? state.log[0].version : state.version;
  /* Asking for changes from before the ring starts cannot be answered as a
     delta, so answer it as a snapshot rather than silently skipping ops. */
  if (v < oldest - 1) return snapshot();
  return { full: false, version: state.version, ops: state.log.filter((e) => e.version > v) };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const p = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors());
    return res.end();
  }

  /* ---- the page itself ---- */
  if (p === '/' || p === '/squid-backlog.html') {
    try {
      const body = await fsp.readFile(opts.file);
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-length': body.length,
        /* the file changes whenever it is rebuilt, and a stale cached copy
           talking to a fresh server is a confusing way to spend an afternoon */
        'cache-control': 'no-cache'
      });
      return res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end(
        `Cannot find ${opts.file}\n\nPoint at it with:  node squid-server.mjs --page path/to/squid-backlog.html\n`
      );
    }
  }

  /* Platforms poll this to decide whether the service is alive, and they
     have no token. It says nothing a scan could use. */
  if (p === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
    return res.end('ok');
  }

  if (!p.startsWith('/api/')) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('not found');
  }

  if (!authorised(req, url)) {
    return json(res, 401, { error: 'This server needs a token. Add it in the page, under Shared state.' });
  }

  /* ---- what and who ---- */
  if (p === '/api/hello') {
    return json(res, 200, {
      ok: true,
      version: state.version,
      entries: Object.keys(state.items).length,
      clients: clients.size,
      needsToken: !!opts.token,
      startedAt: startedAt.toISOString()
    });
  }

  if (p === '/api/state') {
    const v = Number(url.searchParams.get('since'));
    return json(res, 200, Number.isFinite(v) && v > 0 ? since(v) : snapshot());
  }

  /* ---- changes ---- */
  if (p === '/api/ops' && req.method === 'POST') {
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      return json(res, 400, { error: e.message === 'too large' ? 'That batch is too large.' : 'Malformed JSON.' });
    }
    const ops = Array.isArray(body.ops) ? body.ops.slice(0, 5000) : [];
    const by = typeof body.by === 'string' ? body.by.slice(0, 60) : '';
    if (!by) return json(res, 400, { error: 'Say who you are first — every change records a person.' });
    const applied = apply(ops, by);
    return json(res, 200, { version: state.version, applied: applied.length, ops: applied });
  }

  /* ---- restore ----
     Container platforms hand you a fresh filesystem on every deploy unless
     you pay for a disk. `GET /api/state` is already a complete backup; this
     is the way back in. Refuses to run over existing state unless asked,
     because restoring onto a live board would be a quiet catastrophe. */
  if (p === '/api/import' && req.method === 'POST') {
    let body;
    try {
      body = await readBody(req, 32 * 1024 * 1024);
    } catch (e) {
      return json(res, 400, { error: e.message === 'too large' ? 'That file is too large.' : 'Malformed JSON.' });
    }
    const items = body && typeof body.items === 'object' ? body.items : null;
    if (!items) return json(res, 400, { error: 'Expected the shape of GET /api/state: { items: { ... } }' });

    const replace = url.searchParams.get('replace') === '1';
    const existing = Object.keys(state.items).length;
    if (existing && !replace) {
      return json(res, 409, {
        error: `This server already holds ${existing} entries. Add ?replace=1 if you really mean to overwrite them.`,
        entries: existing
      });
    }

    const by = typeof body.by === 'string' ? body.by.slice(0, 60) : 'restore';
    if (replace) { state.items = Object.create(null); state.log = []; }
    /* Through apply(), so a restore is broadcast like any other change and
       anyone with the page open sees it arrive rather than going stale. */
    const ops = Object.keys(items)
      .filter(okKey)
      .map((k) => ({ k, v: items[k] && typeof items[k] === 'object' ? items[k].v : items[k] }))
      .filter((op) => okValue(op.v));
    const applied = apply(ops, by);
    console.log(`restored ${applied.length} entries (${by})`);
    return json(res, 200, { restored: applied.length, skipped: Object.keys(items).length - applied.length, version: state.version });
  }

  /* ---- live updates ---- */
  if (p === '/api/stream') {
    const v = Number(url.searchParams.get('since'));
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
      ...cors()
    });
    /* Tell the browser not to hammer us if the connection drops. */
    res.write('retry: 3000\n\n');
    const client = { res, id: randomUUID() };
    clients.add(client);
    /* Catch this client up before it starts listening, so nothing that
       happened between its last poll and this connection is missed. */
    const catchUp = Number.isFinite(v) && v > 0 ? since(v) : snapshot();
    res.write(`event: sync\ndata: ${JSON.stringify(catchUp)}\n\n`);
    req.on('close', () => clients.delete(client));
    return;
  }

  return json(res, 404, { error: 'no such endpoint' });
});

/* Named so the banner can say something true about where it is running. */
function platformHint() {
  if (process.env.RENDER) return 'Render' + (process.env.RENDER_SERVICE_NAME ? ' · ' + process.env.RENDER_SERVICE_NAME : '');
  if (process.env.FLY_APP_NAME) return 'Fly · ' + process.env.FLY_APP_NAME;
  if (process.env.DYNO) return 'Heroku';
  if (process.env.K_SERVICE) return 'Cloud Run';
  return '';
}

/* The single thing most likely to lose someone's work: a container platform
   with no persistent disk resets the filesystem on every deploy. Saying so
   at boot is cheaper than finding out after a sprint. */
function ephemeralWarning() {
  if (!platformHint()) return '';
  const onDisk = path.resolve(opts.data);
  const mounted = process.env.SQUID_DISK_MOUNT || '';
  if (mounted && onDisk.startsWith(path.resolve(mounted))) return '';
  /* a path under the app directory is the giveaway: that is the image, and
     the image is replaced on every deploy */
  return 'State is at ' + onDisk + ', which on this platform is wiped on every deploy '
    + 'unless it is a mounted disk. Attach one and point SQUID_DATA at it, or back up '
    + 'GET /api/state and restore with POST /api/import.';
}

/* ------------------------------------------------------------------ boot */
const startedAt = new Date();

/* Bound to loopback, an open server is a convenience. Bound to a public
   address it is the whole backlog, world-writable, found by the first scan
   that reaches the port. Refusing to start is a worse afternoon than a
   missing token and a far better one than the alternative. */
const loopback = /^(127\.|::1|localhost)/.test(opts.host);
if(!loopback && !opts.token && process.env.SQUID_ALLOW_OPEN !== '1'){
  console.error('');
  console.error('  Refusing to start.');
  console.error('');
  console.error('  This would listen on ' + opts.host + ' with no token, which means anyone who');
  console.error('  can reach the port could read and change the backlog.');
  console.error('');
  console.error('  Set a token:      SQUID_TOKEN=something-long   (or --token)');
  console.error('  Or say you mean it: SQUID_ALLOW_OPEN=1');
  console.error('');
  process.exit(1);
}

load();

server.listen(opts.port, opts.host, () => {
  const where = opts.host === '0.0.0.0' ? 'every interface' : opts.host;
  console.log('');
  console.log(`  Squid shared state`);
  console.log(`  page    http://${opts.host === '0.0.0.0' ? 'localhost' : opts.host}:${opts.port}/`);
  console.log(`  state   ${opts.data}`);
  console.log(`  serving ${opts.file}`);
  console.log(`  bound   ${where}`);
  if (opts.token) console.log(`  token   required`);
  if (platformHint()) console.log(`  host    ${platformHint()}`);
  console.log('');
  if (!opts.token) {
    console.log('  No token is set, so anyone who can reach this port can read and change');
    console.log('  the backlog. That is fine on a laptop bound to 127.0.0.1 and a bad idea');
    console.log('  anywhere else. Start with --token <something> before using --host 0.0.0.0.');
    console.log('');
  }
  if (opts.host === '0.0.0.0' && !opts.token) {
    console.log('  ⚠  On the network with no token.');
    console.log('');
  }
  if (ephemeralWarning()) {
    console.log('  \u26a0  ' + ephemeralWarning());
    console.log('');
  }
  console.log('  This is shared state, not authentication: it records who made each');
  console.log('  change because people type their name, not because it checked. For real');
  console.log('  accounts use the Next.js app in squid-app/.');
  console.log('');
});

/* Flush before exiting, so Ctrl+C never loses the last few seconds of work. */
let closing = false;
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    if (closing) process.exit(0);
    closing = true;
    console.log('\nsaving…');
    if (saveTimer) clearTimeout(saveTimer);
    await saveNow();
    for (const c of clients) {
      try {
        c.res.end();
      } catch {
        /* the socket is already gone */
      }
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
  });
}

export { server, state, apply, opts };
