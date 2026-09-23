# ==============================================================================
# Crypto Multi-Tool - Clean Cache and Temporary Files (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Cleaning Python __pycache__ and cache directories..." -ForegroundColor Yellow
Get-ChildItem -Path $RepoRoot -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $RepoRoot -Recurse -Directory -Filter ".pytest_cache" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $RepoRoot -Recurse -Directory -Filter ".ruff_cache" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $RepoRoot -Recurse -Directory -Filter ".mypy_cache" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ">>> Cleaning Web Dist directory..." -ForegroundColor Yellow
$WebDist = Join-Path $RepoRoot "web\dist"
if (Test-Path $WebDist) {
    Remove-Item -Recurse -Force $WebDist -ErrorAction SilentlyContinue
}

Write-Host ">>> [DONE] Project workspace cleaned." -ForegroundColor Green
