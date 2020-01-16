ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY run.sh /
#COPY config.js /

#install requirements
RUN apk add --update --no-cache curl jq nodejs npm
# cannot install ffmpeg or git or any of the other stuff that is required for this add-on.
# maybe https://github.com/danielwelch/hassio-zigbee2mqtt/blob/master/zigbee2mqtt/Dockerfile holds the clue
RUN apk add --update --no-cache git
RUN apk add --update --no-cache ffmpeg
RUN npm set unsafe-perm true
RUN npm i npm@latest -g



RUN git clone https://github.com/jeroenterheerdt/ring-hassio . \
&& npm install --unsafe-perm


RUN chmod a+x /run.sh
CMD ["/run.sh"]