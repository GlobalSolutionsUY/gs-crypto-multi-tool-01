#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "\033[1;33m>>> Cleaning Python __pycache__ and cache directories...\033[0m"
cd "$REPO_ROOT"
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true

echo -e "\033[1;33m>>> Cleaning Web Dist directory...\033[0m"
rm -rf "$REPO_ROOT/web/dist"

echo -e "\033[1;32m>>> [DONE] Project workspace cleaned.\033[0m"
