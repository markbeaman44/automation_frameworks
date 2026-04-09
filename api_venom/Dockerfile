FROM alpine:latest

RUN apk add --no-cache curl ca-certificates && \
    curl -L -o /usr/local/bin/venom https://github.com/ovh/venom/releases/latest/download/venom.linux-arm64 && \
    chmod +x /usr/local/bin/venom

WORKDIR /var/app
COPY . .

ENTRYPOINT ["venom"]
CMD ["run", "tests/"]
