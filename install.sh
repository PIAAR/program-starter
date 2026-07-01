#!/usr/bin/env bash
# program-starter bootstrap — macOS / Linux
#
# Installs only what's required to run the interactive CLI: Git, Node
# (via fnm), and Conda (via Miniforge), if they're missing. Anything
# beyond that (Docker, databases, GitHub Desktop) is intentionally left
# to the user — see README.md for why.
set -euo pipefail

log() { printf '\n[program-starter] %s\n' "$1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

if ! command_exists git; then
  log "Git not found. Install it from https://git-scm.com/downloads and re-run this script."
  exit 1
fi

if ! command_exists node; then
  log "Node not found. Installing fnm (Fast Node Manager)..."
  curl -fsSL https://fnm.vercel.app/install | bash
  export PATH="$HOME/.local/share/fnm:$PATH"
  eval "$(fnm env)"
  fnm install --lts
  fnm use --lts
else
  log "Node found: $(node --version)"
fi

if ! command_exists conda; then
  log "Conda not found. Installing Miniforge..."
  OS="$(uname -s)"
  ARCH="$(uname -m)"
  INSTALLER="Miniforge3-${OS}-${ARCH}.sh"
  curl -fsSL -o "/tmp/${INSTALLER}" "https://github.com/conda-forge/miniforge/releases/latest/download/${INSTALLER}"
  bash "/tmp/${INSTALLER}" -b -p "$HOME/miniforge3"
  export PATH="$HOME/miniforge3/bin:$PATH"
  "$HOME/miniforge3/bin/conda" init "$(basename "$SHELL")"
else
  log "Conda found: $(conda --version)"
fi

log "Core environment ready. Launching the project setup CLI..."
npx --yes program-starter@latest
