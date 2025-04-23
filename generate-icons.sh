#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

# Generate icons from SVG
convert -background none -size 192x192 public/logo.svg public/logo192.png
convert -background none -size 512x512 public/logo.svg public/logo512.png
convert -background none -size 64x64 public/logo.svg public/favicon.ico

echo "Icons generated successfully!" 