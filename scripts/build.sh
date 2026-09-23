#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "\033[1;36m>>> Building Web SPA Assets with pnpm...\033[0m"
cd "$REPO_ROOT/web"
pnpm run build

echo -e "\033[1;36m>>> Building Docker Images for Production...\033[0m"
cd "$REPO_ROOT"
docker compose build

echo -e "\033[1;32m>>> [PASS] All project builds completed successfully!\033[0m"
