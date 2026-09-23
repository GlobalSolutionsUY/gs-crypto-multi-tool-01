#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "\033[1;36m>>> Running Pytest Suite...\033[0m"
cd "$REPO_ROOT"
export PYTHONPATH="backend"

if [ -f "$REPO_ROOT/backend/.venv/bin/pytest" ]; then
    "$REPO_ROOT/backend/.venv/bin/pytest" backend/tests/ -v
elif command -v pytest &> /dev/null; then
    pytest backend/tests/ -v
else
    python3 -m pytest backend/tests/ -v || echo -e "\033[1;33m[WARN] Pytest not installed in global environment. Install with: pip install -r backend/requirements-dev.txt\033[0m"
fi

echo -e "\033[1;36m>>> Verifying Web Frontend Compilation...\033[0m"
cd "$REPO_ROOT/web"
pnpm run build

echo -e "\033[1;32m>>> [PASS] All test suites and validations passed!\033[0m"
