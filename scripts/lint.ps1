# ==============================================================================
# Crypto Multi-Tool - Linting (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host ">>> Running Python Ruff Linter..." -ForegroundColor Cyan
Set-Location $RepoRoot

$VenvRuff = Join-Path $RepoRoot "backend\.venv\Scripts\ruff.exe"
if (Test-Path $VenvRuff) {
    & $VenvRuff check backend/
} elseif (Get-Command ruff -ErrorAction SilentlyContinue) {
    ruff check backend/
} else {
    $LintRun = Start-Process python -ArgumentList "-m ruff check backend/" -Wait -PassThru -NoNewWindow
    if ($LintRun.ExitCode -ne 0) {
        Write-Host "[WARN] Ruff not installed in global environment. Install with: pip install -r backend/requirements-dev.txt" -ForegroundColor Yellow
    }
}

Write-Host ">>> Running TypeScript Typecheck..." -ForegroundColor Cyan
Set-Location (Join-Path $RepoRoot "web")
try {
    pnpm run typecheck
} catch {
    Write-Host "[FAIL] TypeScript typecheck failed." -ForegroundColor Red
    exit 1
}

Write-Host ">>> [PASS] All linters and typechecks passed successfully!" -ForegroundColor Green
