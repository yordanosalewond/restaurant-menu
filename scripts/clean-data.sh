#!/bin/bash
# Script to clean all local Durable Object data

echo "🧹 Cleaning local Durable Object storage..."

# Remove Wrangler's local storage
rm -rf .wrangler/state

echo "✅ Local data cleaned!"
echo "ℹ️  Restart your dev server to reseed with mock data"
