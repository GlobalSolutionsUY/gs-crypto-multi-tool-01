<#
.SYNOPSIS
    Central cross-platform action runner for Crypto Multi-Tool on Windows PowerShell.
.EXAMPLE
    .\make.ps1 dev
    .\make.ps1 test
    .\make.ps1 lint
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Target = "help"
)

$ErrorActionPreference = "Stop"
$ScriptPath = Join-Path $PSScriptRoot "scripts\$Target.ps1"

if (Test-Path $ScriptPath) {
    & $ScriptPath
} else {
    Write-Host "Unknown target: '$Target'. Available targets are:" -ForegroundColor Red
    & (Join-Path $PSScriptRoot "scripts\help.ps1")
    exit 1
}
