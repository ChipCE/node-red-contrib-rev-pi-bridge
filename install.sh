#!/bin/bash
CURRENT_DIR=($(pwd))
CURRENT_DIR="${CURRENT_DIR}/node-red-contrib-rev-pi-dio-bridge"
echo "$CURRENT_DIR"
cd ~/.node-red
npm install "$CURRENT_DIR"
