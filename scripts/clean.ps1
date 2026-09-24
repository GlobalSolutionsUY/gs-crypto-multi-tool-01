# ==============================================================================
# Crypto Multi-Tool - Clean Cache and Temporary Files (PowerShell)
# ==============================================================================
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> Cleaning Dist directory and deployment archives..." -ForegroundColor Yellow
$DistDir = Join-Path $RepoRoot "dist"
if (Test-Path $DistDir) {
    Remove-Item -Recurse -Force $DistDir -ErrorAction SilentlyContinue
}

Get-ChildItem -Path $RepoRoot -Filter "*.zip" | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host ">>> [DONE] Project workspace cleaned." -ForegroundColor Green
