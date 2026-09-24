# ==============================================================================
# Crypto Multi-Tool - Local Dev Environment (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Starting Local Development Environment (Unified Node.js)..." -ForegroundColor Cyan
Write-Host "Web Cockpit (Vite Dev Server): http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API & Healthcheck:     http://localhost:8000/health" -ForegroundColor Green
Write-Host ""

pnpm run dev
