#!/bin/bash
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# echo "$CURRENT_DIR"

if [ "$1" = "--build" ]
then
    cd "$CURRENT_DIR/lib"
    make clean
    make all
    make install
fi

cd ~/.node-red
npm install "$CURRENT_DIR"
