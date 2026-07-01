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

Write-Host "[program-starter] Core environment ready. Fetching program-starter..."
$ProjectDir = Get-Location
$InstallDir = if ($env:PROGRAM_STARTER_DIR) { $env:PROGRAM_STARTER_DIR } else { Join-Path $env:USERPROFILE ".program-starter" }
if (Test-Path (Join-Path $InstallDir ".git")) {
    git -C $InstallDir pull --ff-only
} else {
    git clone --depth 1 https://github.com/PIAAR/program-starter.git $InstallDir
}
Push-Location $InstallDir
npm install --no-audit --no-fund
Pop-Location

Write-Host "[program-starter] Launching the project setup CLI in $ProjectDir..."
Push-Location $ProjectDir
node (Join-Path $InstallDir "bin/program-starter.js")
Pop-Location
