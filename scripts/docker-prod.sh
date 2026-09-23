#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"
echo -e "\033[1;36m>>> Running Docker Compose (Production)...\033[0m"
docker compose -f docker-compose.yml up --build -d
