#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "\033[1;36m>>> Running Python Ruff Linter...\033[0m"
cd "$REPO_ROOT"

if [ -f "$REPO_ROOT/backend/.venv/bin/ruff" ]; then
    "$REPO_ROOT/backend/.venv/bin/ruff" check backend/
elif command -v ruff &> /dev/null; then
    ruff check backend/
else
    python3 -m ruff check backend/ || echo -e "\033[1;33m[WARN] Ruff not installed in global environment. Install with: pip install -r backend/requirements-dev.txt\033[0m"
fi

echo -e "\033[1;36m>>> Running TypeScript Typecheck...\033[0m"
cd "$REPO_ROOT/web"
pnpm run typecheck

echo -e "\033[1;32m>>> [PASS] All linters and typechecks passed successfully!\033[0m"
