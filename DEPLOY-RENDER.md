# Deploying to Render

The whole thing is one HTML file and one server file with no dependencies, so
there is no build step and nothing to install.

## Deploy

1. **Push this folder to a Git repository** — GitHub, GitLab or Bitbucket.
   At minimum it needs `squid-server.mjs`, `squid-backlog.html`,
   `package.json` and `render.yaml`.

2. **Render → New → Blueprint**, point it at the repository. It reads
   `render.yaml` and creates the service with the disk and the variables
   already set. You do not have to fill in a build command, a start command
   or a port.

3. **Copy the token.** `render.yaml` asks Render to generate one. Find it
   under **Environment → SQUID_TOKEN** after the first deploy, or replace it
   with your own.

4. **Open the URL** Render gives you — `https://squid-backlog.onrender.com` or
   similar. Enter the token once, pick your name from the pill in the top
   right, and you are sharing. Everyone else does the same.

Render gives you HTTPS automatically, and the server serves the page itself,
so there is no mixed content and no CORS to think about.

### Without the blueprint

If you would rather click through it: **New → Web Service**, connect the repo,
then

| | |
|---|---|
| Runtime | Node |
| Build command | *(leave empty)* |
| Start command | `node squid-server.mjs` |
| Health check path | `/healthz` |

and add `SQUID_TOKEN`, `SQUID_DATA=/var/squid/squid-state.json`,
`SQUID_DISK_MOUNT=/var/squid`, plus a disk mounted at `/var/squid`.

## The disk is the part that matters

**Render replaces a service's filesystem on every deploy.** Without a disk,
`squid-state.json` is part of the image, and each deploy silently throws away
the team's ticks, assignments and states. Nothing errors; the board is just
empty one morning.

`render.yaml` attaches a 1 GB disk at `/var/squid` and points `SQUID_DATA`
inside it, which is the fix. The disk is a paid add-on — around $0.25/GB per
month at the time of writing — and 1 GB is far more than this needs.

The server checks this for you. If it finds itself on Render with its state
somewhere the disk does not cover, it says so in the logs at startup:

```
⚠  State is at /opt/render/project/src/squid-state.json, which on this
   platform is wiped on every deploy unless it is a mounted disk.
```

If you see that line, the disk is not attached or `SQUID_DATA` is pointing at
the wrong place.

## Free plan

The free plan has **no disk**, so state lasts only until the next deploy or
restart. It also spins the service down after about 15 minutes of inactivity,
and the next request takes 30–60 seconds to wake it.

That is survivable if you back up, because `GET /api/state` is a complete
backup and there is an endpoint to put it back:

```bash
# back up — do this before every deploy
curl -H "x-squid-token: $TOKEN" \
     https://YOUR-APP.onrender.com/api/state > squid-backup.json

# restore, after a deploy has wiped it
curl -X POST -H "x-squid-token: $TOKEN" -H "content-type: application/json" \
     --data @squid-backup.json \
     https://YOUR-APP.onrender.com/api/import
```

Restoring onto a server that already holds state is refused, so you cannot
overwrite a live board by pasting yesterday's file. Add `?replace=1` when you
really mean to.

Spin-down itself is harmless in use: the page queues changes while the server
is asleep and sends them when it wakes, and the live connection re-establishes
itself. The only cost is the wait on the first page load.

**If the backlog matters, pay for the disk.** A backup you have to remember to
take before every deploy is a backup you will forget once.

## It refuses to start without a token

On a public address and with no `SQUID_TOKEN`, the server exits rather than
listening:

```
Refusing to start.

This would listen on 0.0.0.0 with no token, which means anyone who
can reach the port could read and change the backlog.
```

A Render URL is public and findable. Without this, the first scanner to reach
it could read your roadmap and empty your sprint. Set the token, or set
`SQUID_ALLOW_OPEN=1` if you genuinely want it open.

Locally, `node squid-server.mjs` still binds to `127.0.0.1` and still needs no
token, because that is your own laptop.

## What the token is and is not

It is a shared secret that keeps strangers out. It is **not** authentication:
it does not tell two people apart, and anyone holding it can act as anyone.
Names are chosen from a list, not verified.

For an internal backlog among ten people who already trust each other, that is
usually the right trade. If you need accounts that can be trusted — who may
edit what, revoking one person, an audit trail that stands up — that is the
Next.js app in [`squid-app/`](squid-app/README.md), which has real sessions and
a policy module.

## Afterwards

- **Logs**: Render's dashboard. The server logs each restore and every save
  failure.
- **Rotating the token**: change `SQUID_TOKEN` in Environment. Everyone enters
  the new one once; nothing is lost, because state lives in the disk and not
  in the session.
- **Updating the page**: rebuild `squid-backlog.html`, commit, push. Render
  redeploys. With the disk attached, state is untouched.
- **Moving off Render**: `GET /api/state` is the whole thing. Copy the JSON,
  run the server anywhere else, `POST /api/import`.
