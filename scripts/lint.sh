#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo -e "\033[1;36m>>> Validating Node.js Server Syntax...\033[0m"
node --check server.js

echo -e "\033[1;36m>>> Running Fullstack TypeScript Typecheck...\033[0m"
pnpm run typecheck

echo -e "\033[1;32m>>> [PASS] All linters and typechecks passed successfully!\033[0m"
