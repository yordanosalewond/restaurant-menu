#!/bin/bash
# Script to clean and reseed data

echo "🧹 Cleaning local data..."
rm -rf .wrangler/state

echo "🌱 Data will be reseeded on next request"
echo ""
echo "To test:"
echo "1. Start dev server: bun run dev"
echo "2. Visit http://localhost:3000"
echo "3. Menu items will be automatically seeded from shared/mock-data.ts"
