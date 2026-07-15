#!/usr/bin/env bash

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dist="$root/dist"

rm -rf "$dist"
mkdir -p "$dist/blog"

cp "$root/index.html" "$dist/index.html"
cp -R "$root/assets" "$dist/assets"
cp "$root/favicon.svg" "$root/favicon.ico" "$root/logo.svg" "$dist/"
cp "$root/style.css" "$dist/style.css"
cp "$root/robots.txt" "$root/sitemap.xml" "$dist/"
cp "$root/cv.html" "$root/cv.css" "$root/CV_Warre_Snaet.pdf" "$dist/"
cp "$root/blog/blog.html" "$dist/blog/blog.html"
cp -R "$root/blog/images" "$dist/blog/images"

echo "Built static site in $dist"
