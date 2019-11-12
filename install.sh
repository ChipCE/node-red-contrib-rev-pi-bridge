#!/bin/bash
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "$CURRENT_DIR"
cd ~/.node-red
npm install "$CURRENT_DIR"
