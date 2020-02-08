ARG BUILD_FROM
FROM $BUILD_FROM

# Add env
ENV LANG C.UTF-8

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
EXPOSE 3000/tcp

RUN apk add --no-cache \
    nodejs \
    npm \
    ffmpeg \
    git && \
    cd / && \
    git clone https://github.com/jeroenterheerdt/ring-hassio && \
    cd ring-hassio/ring_hassio && \
    npm install --unsafe-perm && \
    chmod a+x run.sh

CMD [ "/ring-hassio/ring_hassio/run.sh" ]
