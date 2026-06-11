#!/usr/bin/env bash
set -euo pipefail
if [ "${NODE_ENV:-development}" = "production" ]; then
  echo "Demo seeders cannot run in production."
  exit 1
fi
echo "Demo seeders allowed in this environment."
