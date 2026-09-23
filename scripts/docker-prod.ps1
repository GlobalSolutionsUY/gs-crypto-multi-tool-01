# ==============================================================================
# Crypto Multi-Tool - Run Production Containers (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Running Docker Compose (Production)..." -ForegroundColor Cyan
docker compose -f docker-compose.yml up --build -d
