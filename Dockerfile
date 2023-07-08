FROM node:alpine as build-web

WORKDIR /build

COPY . .

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm build

FROM golang:1.20-bullseye as build-bundle

ENV CGO_ENABLED=0

WORKDIR /build

COPY --from=build-web /build/dist web
COPY --from=build-web /build/wing wing

RUN apt-get update && apt-get install -y llvm clang git make
RUN cd wing && make OUTPUT=daed WEB_DIST=/build/web/ bundle
RUN apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

FROM alpine

LABEL org.opencontainers.image.source=https://github.com/daeuniverse/daed

RUN mkdir -p /usr/local/share/daed/
RUN mkdir -p /etc/daed/
RUN wget -O /usr/local/share/daed/geoip.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geoip.dat
RUN wget -O /usr/local/share/daed/geosite.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geosite.dat

COPY --from=build-bundle /build/wing/daed /usr/local/bin

EXPOSE 2023

CMD ["daed"]
ENTRYPOINT ["daed", "run", "-c", "/etc/daed"]
