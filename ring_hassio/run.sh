echo Hello World!
CONFIG_PATH=/data/options.json
cat $CONFIG_PATH
export RING_EMAIL="$(jq --raw-output '.ring_username' $CONFIG_PATH)"
export RING_PASS="$(jq --raw-output '.ring_password' $CONFIG_PATH)"
export PORT="$(jq --raw-output '.port' $CONFIG_PATH)"
cd /ring-hassio/ring_hassio
node livestream.js
