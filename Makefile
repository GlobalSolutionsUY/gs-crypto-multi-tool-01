# ==============================================================================
# Crypto Multi-Tool (Radar & Copilot) - Cross-Platform Makefile
# Automatically routes targets to PowerShell (.ps1) on Windows and Bash (.sh) on Linux
# ==============================================================================

.PHONY: help dev docker-dev docker-prod docker-down lint test build clean

ifeq ($(OS),Windows_NT)
    RUNNER := powershell -NoProfile -ExecutionPolicy Bypass -File
    EXT := .ps1
else
    RUNNER := bash
    EXT := .sh
endif

help:
	@$(RUNNER) scripts/help$(EXT)

dev:
	@$(RUNNER) scripts/dev$(EXT)

docker-dev:
	@$(RUNNER) scripts/docker-dev$(EXT)

docker-prod:
	@$(RUNNER) scripts/docker-prod$(EXT)

docker-down:
	@$(RUNNER) scripts/docker-down$(EXT)

lint:
	@$(RUNNER) scripts/lint$(EXT)

test:
	@$(RUNNER) scripts/test$(EXT)

build:
	@$(RUNNER) scripts/build$(EXT)

clean:
	@$(RUNNER) scripts/clean$(EXT)
