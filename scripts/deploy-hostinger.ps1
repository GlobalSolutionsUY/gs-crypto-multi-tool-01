# ==============================================================================
# Crypto Multi-Tool - Package Unified Node.js Application for Hostinger
# ==============================================================================
param(
    [string]$Domain = "palegoldenrod-locust-539183.hostingersite.com"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host ">>> [1/3] Building Fullstack Application (SPA + Server Bundle)..." -ForegroundColor Cyan
pnpm run build

Write-Host ">>> [2/3] Packaging Unified Node.js distribution archive..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "nodeapp_$timestamp.zip"
$archivePath = Join-Path $RepoRoot $archiveName

# Package dist directory, server.js, and package.json
$tempDeployDir = Join-Path $RepoRoot "deploy_temp"
if (Test-Path $tempDeployDir) { Remove-Item -Recurse -Force $tempDeployDir }
New-Item -ItemType Directory -Path $tempDeployDir | Out-Null

Copy-Item -Recurse -Path (Join-Path $RepoRoot "dist") -Destination (Join-Path $tempDeployDir "dist")
Copy-Item -Path (Join-Path $RepoRoot "server.js") -Destination (Join-Path $tempDeployDir "server.js")
Copy-Item -Path (Join-Path $RepoRoot "package.json") -Destination (Join-Path $tempDeployDir "package.json")

Compress-Archive -Path "$tempDeployDir\*" -DestinationPath $archivePath -Force
Remove-Item -Recurse -Force $tempDeployDir

Write-Host ">>> [3/3] Archive created ready for Hostinger deployment: $archivePath" -ForegroundColor Green
Write-Host ">>> Target Domain: https://$Domain" -ForegroundColor Yellow
Write-Host ">>> Entrypoint on Hostinger: server.js (Command: npm start)" -ForegroundColor Cyan

Set-Location $RepoRoot
