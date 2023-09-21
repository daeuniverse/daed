
# ATTENTION This part below is for publishing purpose only
# NOTE in the as parameter in FROM,
# the `--` between `web` and `has`, and `dokerfile` in which letter c is missing
# I do it on purpose so that it is not convenient for self build to avoid unnecessary problem

FROM golang:1.21-bookworm as build-bundle-directly-for-web--has-been-built-from-outside-of-dokerfile

RUN \
    apt-get update; apt-get install -y git make llvm-15 clang-15; \
    apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

# build bundle process
ENV CGO_ENABLED=0
ENV CLANG=clang-15
ARG DAED_VERSION=self-build

WORKDIR /build

COPY ./dist/ ./web/
COPY ./wing/ ./wing/
# RUN git clone --recursive https://github.com/daeuniverse/dae-wing.git wing

WORKDIR /build/wing

RUN make APPNAME=daed VERSION=$DAED_VERSION OUTPUT=daed WEB_DIST=/build/web/ bundle



# ATTENTION This part below is for publishing purpose only
# NOTE in the from parameter in COPY,
# the `--` between `web` and `has`, and `dokerfile` in which letter c is missing
# I do it on purpose so that it is not convenient for self build to avoid unnecessary problem

FROM alpine as this-image-is-built-for-final-publish-with-support-of-multiple-platforms

LABEL org.opencontainers.image.source=https://github.com/daeuniverse/daed

RUN mkdir -p /usr/local/share/daed/
RUN mkdir -p /etc/daed/
RUN wget -O /usr/local/share/daed/geoip.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geoip.dat; \
    wget -O /usr/local/share/daed/geosite.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geosite.dat
COPY --from=build-bundle-directly-for-web--has-been-built-from-outside-of-dokerfile /build/wing/daed /usr/local/bin

EXPOSE 2023

CMD ["daed", "run", "-c", "/etc/daed"]
