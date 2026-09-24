#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo -e "\033[1;33m>>> Cleaning Dist directory and deployment archives...\033[0m"
rm -rf "$REPO_ROOT/dist" "$REPO_ROOT"/*.zip

echo -e "\033[1;32m>>> [DONE] Project workspace cleaned.\033[0m"
