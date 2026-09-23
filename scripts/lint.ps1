# ==============================================================================
# Crypto Multi-Tool - Linting & Typecheck (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Validating Node.js Server Syntax..." -ForegroundColor Cyan
node --check server.js

Write-Host ">>> Running Fullstack TypeScript Typecheck..." -ForegroundColor Cyan
pnpm run typecheck

Write-Host ">>> [PASS] All linters and typechecks passed successfully!" -ForegroundColor Green
