ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY run.sh /
#COPY config.js /

#install requirements
RUN apk add --no-cache jq
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache git nodejs nodejs-npm curl wget unzip \
    && npm set unsafe-perm true \
    && npm i npm@latest -g 

RUN apk add --no-cache git
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache nodejs
RUN apk add --no-cache nodejs-npm
RUN npm set unsafe-perm true
RUN npm i npm@latest -g



RUN git clone https://github.com/jeroenterheerdt/ring-hassio . \
&& npm install --unsafe-perm


RUN chmod a+x /run.sh
CMD ["/run.sh"]