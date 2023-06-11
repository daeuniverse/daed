FROM node:alpine as build-web

WORKDIR /build

COPY . .

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm build

FROM golang:1.20-bullseye as build-bundle

WORKDIR /build

COPY --from=build-web /build/dist web

RUN apt-get update && apt-get install -y llvm clang git make
RUN git clone https://github.com/daeuniverse/dae-wing.git
RUN cd dae-wing && make OUTPUT=daed WEB_DIST=/build/web/ bundle
RUN apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

FROM alpine

RUN mkdir -p /usr/local/share/daed/
RUN mkdir -p /etc/daed/
RUN wget -O /usr/local/share/daed/geoip.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geoip.dat
RUN wget -O /usr/local/share/daed/geosite.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geosite.dat

COPY --from=build-bundle /build/dae-wing/daed /usr/local/bin

EXPOSE 2023

CMD ["daed"]
ENTRYPOINT ["daed", "run", "-c", "/etc/daed"]
