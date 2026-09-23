#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

echo -e "\033[1;36m>>> Starting Local Development Environment via Docker Compose...\033[0m"
echo -e "\033[1;32mWeb Cockpit: http://localhost:3000\033[0m"
echo -e "\033[1;32mFastAPI API: http://localhost:8000/docs\033[0m"
echo -e "\033[1;32mFastMCP:     http://localhost:8001\033[0m"
echo ""

docker compose -f docker-compose.dev.yml up --build
