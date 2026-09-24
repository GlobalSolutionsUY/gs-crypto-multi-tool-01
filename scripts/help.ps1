# ==============================================================================
# Crypto Multi-Tool - Action Help (PowerShell)
# ==============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  Crypto Multi-Tool (Radar & Copilot) - Project Actions" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usage: make <target>  or  .\make.ps1 <target>" -ForegroundColor Yellow
Write-Host ""
Write-Host "Available targets:" -ForegroundColor Yellow
Write-Host "  dev          " -ForegroundColor Green -NoNewline; Write-Host "Start backend and frontend in local development mode"
Write-Host "  docker-dev   " -ForegroundColor Green -NoNewline; Write-Host "Run development environment via Docker Compose"
Write-Host "  docker-prod  " -ForegroundColor Green -NoNewline; Write-Host "Run production containers via Docker Compose"
Write-Host "  docker-down  " -ForegroundColor Green -NoNewline; Write-Host "Stop and tear down Docker Compose containers"
Write-Host "  lint         " -ForegroundColor Green -NoNewline; Write-Host "Run Ruff linter and TypeScript typecheck"
Write-Host "  test         " -ForegroundColor Green -NoNewline; Write-Host "Run Pytest test suite and frontend verification"
Write-Host "  build        " -ForegroundColor Green -NoNewline; Write-Host "Build frontend bundle and production Docker images"
Write-Host "  clean        " -ForegroundColor Green -NoNewline; Write-Host "Clean cache artifacts, virtual files, and build outputs"
Write-Host "  help         " -ForegroundColor Green -NoNewline; Write-Host "Show this help reference"
Write-Host ""
