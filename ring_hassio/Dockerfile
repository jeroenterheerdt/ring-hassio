ARG BUILD_FROM
FROM $BUILD_FROM

# Add env
ENV LANG C.UTF-8

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
EXPOSE 3000/tcp

RUN apk add --no-cache \
    nodejs=12.14.0-r0 \
    npm=12.14.0-r0 \
    ffmpeg \
    git && \
    cd / && \
    git clone https://github.com/jeroenterheerdt/ring-hassio && \
    cd ring-hassio/ring_hassio && \
    mkdir -p public/output && \
    npm install --unsafe-perm && \
    chmod a+x run.sh

CMD [ "/ring-hassio/ring_hassio/run.sh" ]
