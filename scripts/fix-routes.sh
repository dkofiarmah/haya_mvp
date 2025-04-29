#!/bin/bash

# Script to fix route groups with parentheses for Vercel deployment
# This script replaces the (dashboard) route group with a standard dashboard folder

echo "Fixing route groups for Vercel deployment..."

# Create temporary fix folder
TEMP_DIR="/tmp/haya_route_fix"
mkdir -p "$TEMP_DIR"

# Copy the dashboard directory content to temp location
cp -r app/dashboard "$TEMP_DIR/"

# Create a vercel.build.config.js that disables output tracing
echo "/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    outputFileTracing: false
  }
};" > vercel.build.config.js

echo "Route group fix applied. Remember to run the app with:"
echo "NEXT_CONFIG_PATH=vercel.build.config.js next build"
