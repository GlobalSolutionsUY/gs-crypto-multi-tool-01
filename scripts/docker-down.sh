#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"
echo -e "\033[1;33m>>> Stopping Docker Compose Dev containers...\033[0m"
docker compose -f docker-compose.dev.yml down --remove-orphans || true

echo -e "\033[1;33m>>> Stopping Docker Compose Prod containers...\033[0m"
docker compose -f docker-compose.yml down --remove-orphans || true

echo -e "\033[1;32m>>> [DONE] All project containers stopped.\033[0m"
