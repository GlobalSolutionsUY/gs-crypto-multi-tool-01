#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo -e "\033[1;36m>>> Running Fullstack Unit Tests via node:test...\033[0m"
pnpm test

echo -e "\033[1;36m>>> Verifying Production Build Pipeline...\033[0m"
pnpm run build

echo -e "\033[1;32m>>> [PASS] All test suites and validations passed!\033[0m"
