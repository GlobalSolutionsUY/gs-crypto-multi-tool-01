# ==============================================================================
# Crypto Multi-Tool - Package and Deploy Web Client to Hostinger
# ==============================================================================
param(
    [string]$Domain = "palegoldenrod-locust-539183.hostingersite.com"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host ">>> [1/3] Building Web SPA with TypeScript and Vite..." -ForegroundColor Cyan
Set-Location (Join-Path $RepoRoot "web")
pnpm run build

Write-Host ">>> [2/3] Creating distribution archive..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "dist_$timestamp.zip"
$archivePath = Join-Path $RepoRoot $archiveName

Compress-Archive -Path (Join-Path $RepoRoot "web\dist\*") -DestinationPath $archivePath -Force

Write-Host ">>> [3/3] Archive created ready for Hostinger deployment: $archivePath" -ForegroundColor Green
Write-Host ">>> Target Domain: https://$Domain" -ForegroundColor Yellow
Write-Host ">>> Deploy using Hostinger MCP tool 'hosting_deployStaticWebsite' with archivePath: $archivePath" -ForegroundColor Cyan

Set-Location $RepoRoot
