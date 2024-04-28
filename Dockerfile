# Caddy-Image
FROM caddy:2.7.6-alpine

COPY . /srv
COPY Caddyfile /etc/caddy/Caddyfile

RUN apk add --no-cache git
RUN apk add bash

WORKDIR /srv

RUN  chmod +x ./version.sh
RUN ./version.sh

EXPOSE 80 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
