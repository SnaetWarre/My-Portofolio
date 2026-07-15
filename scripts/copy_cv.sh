#!/usr/bin/env bash

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dist="$root/dist"

cp "$root/cv.html" "$root/cv.css" "$root/CV_Warre_Snaet.pdf" "$dist/"

echo "Copied public CV files into $dist"
