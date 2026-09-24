# ==============================================================================
# Crypto Multi-Tool - Test Suite (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Running Fullstack Unit Tests via node:test..." -ForegroundColor Cyan
pnpm test

Write-Host ">>> Verifying Production Build Pipeline..." -ForegroundColor Cyan
pnpm run build

Write-Host ">>> [PASS] All test suites and validations passed!" -ForegroundColor Green
