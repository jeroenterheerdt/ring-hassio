ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY run.sh /
#COPY config.js /

#install requirements
RUN apk add --update --no-cache curl jq nodejs npm
# cannot install ffmpeg or git or any of the other stuff that is required for this add-on.
# maybe https://github.com/danielwelch/hassio-zigbee2mqtt/blob/master/zigbee2mqtt/Dockerfile holds the clue

#https://developers.home-assistant.io/docs/en/hassio_addon_config.html
#https://github.com/home-assistant/hassio-base
#https://github.com/home-assistant/hassio-addons-example/blob/master/coffee_maker/Dockerfile

RUN apk add --update --no-cache git
RUN apk add --update --no-cache ffmpeg
RUN npm set unsafe-perm true
RUN npm i npm@latest -g


# probably git is not available
RUN git clone https://github.com/jeroenterheerdt/ring-hassio . \
&& npm install --unsafe-perm

RUN chmod a+x /run.sh
CMD ["/run.sh"]