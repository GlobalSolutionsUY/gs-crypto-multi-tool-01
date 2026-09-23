#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo -e "\033[1;36m>>> Building Unified Fullstack Assets with pnpm...\033[0m"
pnpm run build

echo -e "\033[1;32m>>> [PASS] All project builds completed successfully in dist/!\033[0m"
