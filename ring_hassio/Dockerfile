ARG BUILD_FROM
FROM $BUILD_FROM

# Add env
ENV LANG C.UTF-8

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY package.json /
COPY livestream.js /
RUN apk add --no-cache \
    nodejs=12.14.0-r0 \
    npm=12.14.0-r0 \
    ffmpeg && \
    mkdir -p /public/output && \
    npm install --unsafe-perm
COPY run.sh /
RUN chmod a+x /run.sh
CMD [ "/run.sh" ]
