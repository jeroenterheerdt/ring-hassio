ARG BUILD_FROM
FROM $BUILD_FROM

# Add env
ENV LANG C.UTF-8

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY package.json /
COPY livestream.js /
RUN apk add --no-cache \
    nodejs \
    npm \
    ffmpeg && \
    mkdir /public && \
    cd public && \
    mkdir output && \
    cd / && \
    npm install --unsafe-perm
COPY run.sh /
RUN chmod a+x /run.sh
CMD [ "/run.sh" ]
