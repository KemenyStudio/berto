#!/bin/bash

echo "=== Testing Berto Build Process ==="
echo "Node version: $(node --version)"
echo "pnpm version: $(pnpm --version)"
echo ""

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo ""
echo "=== Building static files ==="
STATIC_BUILD=true pnpm run build

echo ""
echo "=== Checking output ==="
ls -la out/ 2>/dev/null || echo "No out/ directory found"
ls -la public/ 2>/dev/null || echo "No public/ directory found"

echo ""
echo "=== Testing electron builder (dry run) ==="
pnpm run electron-builder -- --dry-run

echo "=== Build test complete ===" 