# ==============================================================================
# Crypto Multi-Tool - Local Dev Environment (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Starting Local Development Environment via Docker Compose..." -ForegroundColor Cyan
Write-Host "Web Cockpit: http://localhost:3000" -ForegroundColor Green
Write-Host "FastAPI API: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "FastMCP:     http://localhost:8001" -ForegroundColor Green
Write-Host ""

docker compose -f docker-compose.dev.yml up --build
