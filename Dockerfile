# Caddy-Image
FROM caddy:2.7.6-alpine

COPY . /srv
COPY Caddyfile /etc/caddy/Caddyfile


WORKDIR /srv

RUN apk add --no-cache git
RUN apk add bash
RUN  chmod +x ./version.sh
RUN ./version.sh

EXPOSE 80 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
