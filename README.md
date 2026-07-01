# program-starter

A one-click way to get a developer's local machine ready to build — and then
start the *right* project from a modern, working baseline instead of a blank
folder.

`program-starter` is two things:

1. A **bootstrap script** that makes sure Git, Node, and Conda are on the
   machine.
2. An **interactive terminal CLI** that asks what you're building, checks
   what tooling you already have, and scaffolds a project from a
   current-best-practice template — directory structure, `.gitignore`,
   `.env.example`, and (optionally) a git repo, a GitHub repo, a linked
   Doppler secrets project, and a `docker-compose.yml` for local databases.

It's meant to run once per new project, at the very start, not as an
ongoing dependency of the project itself.

## Quick start

Run this from the directory where you want your **new project** to be
created (e.g. `~/code`), not from inside an existing project:

```bash
curl -fsSL https://raw.githubusercontent.com/PIAAR/program-starter/main/install.sh | bash
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/PIAAR/program-starter/main/install.ps1 | iex
```

This installs Git/Node/Conda if missing, clones `program-starter` into
`~/.program-starter` (reused and `git pull`-ed on future runs), then launches
the interactive CLI from *your current directory* — so the project it
scaffolds lands next to you, not inside the tool's own install folder.

> **Note:** `program-starter` isn't published to npm yet, so there's no
> `npx program-starter` shortcut yet — the installer scripts above are
> currently the only supported entry point. If you already have Git/Node/Conda
> and just want to run it directly:
> ```bash
> git clone https://github.com/PIAAR/program-starter.git ~/.program-starter
> cd ~/.program-starter && npm install
> cd /path/to/where/you/want/your/new/project
> node ~/.program-starter/bin/program-starter.js
> ```

## Walkthrough

A run looks like this:

```
$ program-starter

program-starter — spin up a new project the right way

Environment check
  git      ✔ git version 2.43.0
  node     ✔ v22.22.2
  npm      ✔ 10.9.7
  conda    ✘ not found
  python   ✔ Python 3.11.15
  gh       ✘ not found
  doppler  ✘ not found
  docker   ✔ Docker version 29.3.1

? What do you want to build?
  > SaaS / API backend (Node + Express)

? Project name: my-app

? Run setup commands now? (npm install)  Yes

? Initialize a git repository?  Yes

? Add a docker-compose.yml with Postgres + Redis for local dev?  Yes

Done. cd my-app and start building.
```

Steps that are skipped automatically (rather than shown as a question) when
the relevant tool isn't installed or authenticated: creating a GitHub repo
(needs `gh auth login`) and linking a Doppler project (needs `doppler
login`). The CLI tells you which one and where to get it — it never blocks
on a tool you don't have.

**After it finishes:** `cd` into the new project directory and follow *that
project's own* `README.md` — each template ships one with its exact next
commands (e.g. `docker compose up -d && npm run dev`).

### Troubleshooting

- `TTY initialization failed`: you're running in a non-interactive shell
  (CI, a piped command, some remote sessions). The CLI needs a real
  terminal for its interactive menu — run it in an actual terminal window.
- GitHub repo creation silently skipped: run `gh auth login` first, then
  re-run program-starter (or just `gh repo create` manually inside the
  scaffolded project).
- Doppler setup silently skipped: run `doppler login` first, then re-run
  program-starter (or `doppler setup` manually inside the project).

## What the CLI does

1. **Detects your environment** — Git, Node, npm, Conda, Python, `gh`
   (GitHub CLI), Doppler CLI, Docker. Reports what's present; never
   silently installs GUI apps or system services (see "What gets
   auto-installed" below).
2. **Asks what you're building**:
   - Website (Next.js)
   - SPA (Vite + React)
   - SaaS / API backend (Node + Express)
   - SaaS / API backend (Python + FastAPI)
   - Terminal / CLI app (Node)
3. **Asks a project name** and scaffolds that template into a new directory.
4. **Optionally**:
   - Runs the template's install step (`npm install`, `conda env create`, ...)
   - Runs `git init` and creates the initial commit
   - Creates a matching GitHub repo via `gh repo create` and pushes (only if
     `gh` is installed and authenticated)
   - Runs `doppler setup` to link a secrets project (only if the Doppler CLI
     is installed and logged in)
   - Adds a `docker-compose.yml` with Postgres + Redis for templates that
     need a database, so you never have to install a database engine
     directly on your machine

## What gets auto-installed, and what doesn't

| Tool | Behavior |
|---|---|
| Git, Node, Conda | Bootstrap script installs these if missing — small, scriptable, reversible, and required just to run the CLI itself. |
| GitHub CLI (`gh`), Doppler CLI | Detected only. If missing, the CLI tells you the install link and skips that step; it does not install them for you. |
| **GitHub Desktop** | Not offered. The whole point of this tool is a terminal-first workflow; `gh` covers repo creation without a GUI app. |
| **Docker** | Detected only, never auto-installed. Docker Desktop installers are large, and on macOS/Windows they can require a reboot or virtualization changes in BIOS — not something a script should trigger without you watching. If a template needs a database, program-starter instead generates a `docker-compose.yml` in the *project*, so "install a database" becomes "the project already has one containerized" once you do have Docker. |
| **Database software (Postgres/MySQL/etc. installed directly on the OS)** | Never auto-installed. Same reasoning as Docker — a local install-to-disk is exactly the kind of change to gate behind a visible confirmation, not bundle into a "yes to everything" flow. |

If you want a disk-space-aware pre-check before any optional download
(GitHub Desktop / Docker / DB installers, if you choose to wire those up
yourself later), keep it opt-in and off by default — see
[`src/detect.js`](src/detect.js) for the pattern to extend.

## Project layout

```
program-starter/
  install.sh / install.ps1   bootstrap: Git, Node, Conda
  bin/program-starter.js     CLI entry point
  src/
    cli.js                   interactive prompt flow
    detect.js                environment detection (read-only)
    templates.js              template registry
    scaffold.js               copies + tokenizes a template into the target dir
    github.js                  gh repo create wrapper
    doppler.js                 doppler setup wrapper
    templates/
      web-nextjs/
      spa-vite-react/
      api-node-express/
      api-python-fastapi/
      cli-node/
```

Each template directory is a real, runnable starter project. Adding a new
template means adding a directory here and one entry in `src/templates.js`.

## Development

```bash
npm install
npm start
```

## Roadmap / next steps

Status as of the last working session — pick up here:

- [ ] **Publish to npm.** The package isn't published yet, so `install.sh`/
      `install.ps1` clone the repo via git instead of using `npx
      program-starter`. Once published, swap the installers and README Quick
      Start back to the `npx` form. This is a one-way, externally-visible
      action (public package name; npm's unpublish window is only 72 hours)
      — worth a deliberate go/no-go, not a reflexive default.
- [ ] **Wire up CI.** No automated checks exist yet beyond GitHub's default
      Dependabot workflow. At minimum: `node --check` across `src/` and
      every template, plus a scripted scaffold-and-verify pass per template
      (what the manual pty-driven test session did by hand — see git log for
      `install.sh`/Postgres-identifier fixes that test caught).
- [ ] **Disk-space-aware optional downloads.** Original ask was whether to
      offer GitHub Desktop / Docker / DB installer downloads. Decision so
      far: detect-only, never auto-install GUI apps or system services (see
      "What gets auto-installed" above). If you still want an opt-in,
      off-by-default flow that checks disk space before offering those
      downloads, `src/detect.js` is the extension point.
- [ ] **Dependabot findings.** GitHub flagged ~17 vulnerabilities on push,
      traced to version *ranges* declared in template `package.json` files
      (e.g. `next@^14.2.0`), not the CLI's own installed deps (`npm audit`
      on the root package is clean). Left alone deliberately since a fresh
      `npm install` pulls current patches within range — revisit if you want
      to bump template floor versions explicitly.

## License

MIT
