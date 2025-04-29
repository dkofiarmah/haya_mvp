#!/bin/bash

# This script is used for building the project on Vercel
# It sets the CANVAS_DISABLE environment variable to disable the canvas module
# and then runs the Next.js build command

# Install dependencies without using the lockfile
pnpm install --no-frozen-lockfile

# Set the CANVAS_DISABLE environment variable and build
CANVAS_DISABLE=1 next build
