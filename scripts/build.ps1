# ==============================================================================
# Crypto Multi-Tool - Build Assets and Docker Images (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host ">>> Building Web SPA Assets with pnpm..." -ForegroundColor Cyan
Set-Location (Join-Path $RepoRoot "web")
pnpm run build

Write-Host ">>> Building Docker Images for Production..." -ForegroundColor Cyan
Set-Location $RepoRoot
docker compose build

Write-Host ">>> [PASS] All project builds completed successfully!" -ForegroundColor Green
