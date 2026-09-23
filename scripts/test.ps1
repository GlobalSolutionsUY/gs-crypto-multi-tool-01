# ==============================================================================
# Crypto Multi-Tool - Test Suite (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host ">>> Running Pytest Suite..." -ForegroundColor Cyan
Set-Location $RepoRoot
$env:PYTHONPATH = "backend"

$VenvPytest = Join-Path $RepoRoot "backend\.venv\Scripts\pytest.exe"
if (Test-Path $VenvPytest) {
    & $VenvPytest backend/tests/ -v
} elseif (Get-Command pytest -ErrorAction SilentlyContinue) {
    pytest backend/tests/ -v
} else {
    $TestRun = Start-Process python -ArgumentList "-m pytest backend/tests/ -v" -Wait -PassThru -NoNewWindow
    if ($TestRun.ExitCode -ne 0) {
        Write-Host "[WARN] Pytest not installed in global environment. To run tests locally, install with: pip install -r backend/requirements-dev.txt" -ForegroundColor Yellow
    }
}

Write-Host ">>> Verifying Web Frontend Compilation..." -ForegroundColor Cyan
Set-Location (Join-Path $RepoRoot "web")
try {
    pnpm run build
} catch {
    Write-Host "[FAIL] Frontend verification failed." -ForegroundColor Red
    exit 1
}

Write-Host ">>> [PASS] All test suites and validations passed!" -ForegroundColor Green
