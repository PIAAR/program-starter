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

```bash
curl -fsSL https://raw.githubusercontent.com/PIAAR/program-starter/main/install.sh | bash
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/PIAAR/program-starter/main/install.ps1 | iex
```

This installs Git/Node/Conda if missing, then launches the interactive CLI.
If you already have those three, you can skip straight to:

```bash
npx program-starter
```

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

## License

MIT
