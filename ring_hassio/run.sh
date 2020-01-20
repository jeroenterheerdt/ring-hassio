echo Hello World!
CONFIG_PATH=/data/options.json
export RING_EMAIL="$(jq --raw-output '.ring_username' $CONFIG_PATH)"
export RING_PASS="$(jq --raw-output '.ring_password' $CONFIG_PATH)"

node livestream.js