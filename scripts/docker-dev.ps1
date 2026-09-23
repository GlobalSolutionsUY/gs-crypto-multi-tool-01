# ==============================================================================
# Crypto Multi-Tool - Run Development Containers (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Running Docker Compose (Development)..." -ForegroundColor Cyan
docker compose -f docker-compose.dev.yml up --build -d
