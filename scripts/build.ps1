# ==============================================================================
# Crypto Multi-Tool - Build Assets and Bundles (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host ">>> Building Unified Fullstack Assets with pnpm..." -ForegroundColor Cyan
Set-Location $RepoRoot
pnpm run build

Write-Host ">>> [PASS] All project builds completed successfully in dist/!" -ForegroundColor Green
