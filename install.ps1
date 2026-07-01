# program-starter bootstrap — Windows (PowerShell)
#
# Installs only what's required to run the interactive CLI: Git, Node
# (via winget), and Conda (via Miniforge), if they're missing. Anything
# beyond that (Docker, databases, GitHub Desktop) is intentionally left
# to the user — see README.md for why.

function Test-CommandExists($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

if (-not (Test-CommandExists git)) {
    Write-Host "[program-starter] Git not found. Install it from https://git-scm.com/downloads and re-run this script."
    exit 1
}

if (-not (Test-CommandExists node)) {
    Write-Host "[program-starter] Node not found. Installing via winget..."
    winget install --id OpenJS.NodeJS.LTS -e --source winget
} else {
    Write-Host "[program-starter] Node found: $(node --version)"
}

if (-not (Test-CommandExists conda)) {
    Write-Host "[program-starter] Conda not found. Installing Miniforge via winget..."
    winget install --id CondaForge.Miniforge3 -e --source winget
} else {
    Write-Host "[program-starter] Conda found: $(conda --version)"
}

Write-Host "[program-starter] Core environment ready. Launching the project setup CLI..."
npx --yes program-starter@latest
