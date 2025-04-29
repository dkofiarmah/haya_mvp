#!/bin/sh
echo "Removing canvas from node_modules..."
rm -rf node_modules/canvas
rm -rf node_modules/jsdom/node_modules/canvas
find node_modules -type d -name canvas -exec rm -rf {} \; 2>/dev/null || true
rm -rf node_modules/canvas-prebuilt
find node_modules -type d -name canvas-prebuilt -exec rm -rf {} \; 2>/dev/null || true
echo "Canvas cleanup complete"
exit 0
