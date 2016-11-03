#!/bin/bash
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CURRENT_DIR="${CURRENT_DIR}/node-red-contrib-rev-pi-dio-bridge"
echo "$CURRENT_DIR"
cd ~/.node-red
npm install "$CURRENT_DIR"
