#!/bin/bash
sed -e

CONFIG_PATH=/data/options.json
export RING_USERNAME=$(jq --raw-output ".ring_username" $CONFIG_PATH)
export RING_PASS=$(jw --raw-output ".ring_password" $CONFIG_PATH)

# NPM install
echo "[INFO] Running NPM install"
if npm install -unsafe-perm --silent; then
    echo "[INFO] Dependencies installation Done!"
else
    echo "[ERROR] Unable to install dependencies!"
    exit 1
fi

node livestream.js