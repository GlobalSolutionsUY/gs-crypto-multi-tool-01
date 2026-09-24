# ==============================================================================
# Crypto Multi-Tool - Stop Docker Containers (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Stopping Docker Compose Dev containers..." -ForegroundColor Yellow
docker compose -f docker-compose.dev.yml down --remove-orphans

Write-Host ">>> Stopping Docker Compose Prod containers..." -ForegroundColor Yellow
docker compose -f docker-compose.yml down --remove-orphans

Write-Host ">>> [DONE] All project containers stopped." -ForegroundColor Green
