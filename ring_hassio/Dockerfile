ARG BUILD_FROM
FROM $BUILD_FROM

# Add env
ENV LANG C.UTF-8

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

#https://github.com/home-assistant/hassio-builder
#BUILD_FROM: https://github.com/home-assistant/hassio-base

RUN apk add --no-cache \
        nodejs=12.14.0-r0 \
        npm=12.14.0-r0
#    python2 make gcc g++ linux-headers udev git python2 && \
#  curl -sL -o "/$ARCHIVE.tar.gz" \
#  "https://github.com/Koenkk/zigbee2mqtt/archive/$ZIGBEE2MQTT_VERSION.tar.gz" && \
#  tar xzvf "/$ARCHIVE.tar.gz" && \
#  cd "/$ARCHIVE" && \
#  npm install --unsafe-perm -g pm2 && \
#  npm install --unsafe-perm && \
#  apk del make gcc g++ python2 linux-headers udev && \
#  rm -rf docs test images scripts data docker LICENSE README.md update.sh

#COPY run.sh /
#RUN chmod a+x /run.sh
#CMD [ "/run.sh" ]
