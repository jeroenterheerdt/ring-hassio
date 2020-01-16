ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

#install requirements
RUN apk add -no-cache git ffmpeg nodejs nodejs-npm \
    && npm set unsafe-perm true \
    && npm i npm@latest -g

RUN apk add -no-cache jq

RUN git clone https://github.com/jeroenterheerdt/ring-hassio . \
&& npm install --unsafe-perm

COPY run.sh /
COPY config.js /
RUN chmod a+x /run.sh
CMD ["/run.sh"]