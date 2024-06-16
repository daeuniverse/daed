# ATTENTION This part below is for publishing purpose only

ARG DAED_VERSION

FROM golang:1.22-bookworm as build

RUN \
    apt-get update; apt-get install -y git make llvm-15 clang-15; \
    apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

# build bundle process
ENV CGO_ENABLED=0
ENV CLANG=clang-15
ARG DAED_VERSION

WORKDIR /build

COPY ./dist/ ./web/
COPY ./wing/ ./wing/

WORKDIR /build/wing

RUN make APPNAME=daed VERSION=$DAED_VERSION OUTPUT=daed WEB_DIST=/build/web/ bundle


FROM alpine as prod

LABEL org.opencontainers.image.source=https://github.com/daeuniverse/daed

RUN mkdir -p /usr/local/share/daed/
RUN mkdir -p /etc/daed/
RUN wget -O /usr/local/share/daed/geoip.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geoip.dat; \
    wget -O /usr/local/share/daed/geosite.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geosite.dat
COPY --from=build /build/wing/daed /usr/local/bin

EXPOSE 2023

CMD ["daed", "run", "-c", "/etc/daed"]
