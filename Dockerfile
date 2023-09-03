FROM node:alpine as build-web

WORKDIR /build

COPY . .

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm build



FROM golang:1.21-bookworm as build-bundle

# # before uncomment these, please comment next RUN!
# # install git and make
# # then install LLVM and clang from nightly package repository apt.llvm.org
# ARG LLVM_VERSION=15
#
# RUN \
#     apt-get update; \
#     apt-get install -y git make lsb-release wget software-properties-common gnupg; \
#     wget https://apt.llvm.org/llvm.sh; \
#     chmod +x llvm.sh; \
#     ./llvm.sh ${LLVM_VERSION} all; \
#     find /usr/bin/ -name clang* | sed -E 's@^(/usr/bin/.*)(\-[0-9]*)$@ln -s -v \1\2 \1@' | xargs -d '\n' -n 1 bash -c; \
#     rm llvm.sh && apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

RUN \
    apt-get update; apt-get install -y git make llvm-15 clang-15; \
    find /usr/bin/ -name clang* | sed -E 's@^(/usr/bin/.*)(\-[0-9]*)$@ln -s -v \1\2 \1@' | xargs -d '\n' -n 1 bash -c; \
    apt-get clean autoclean && apt-get autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

# build bundle process
ENV CGO_ENABLED=0

WORKDIR /build

COPY --from=build-web /build/dist web
COPY --from=build-web /build/wing wing

RUN cd wing && make APPNAME=daed OUTPUT=daed WEB_DIST=/build/web/ bundle



FROM alpine

LABEL org.opencontainers.image.source=https://github.com/daeuniverse/daed

RUN mkdir -p /usr/local/share/daed/
RUN mkdir -p /etc/daed/
RUN wget -O /usr/local/share/daed/geoip.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geoip.dat; \
    wget -O /usr/local/share/daed/geosite.dat https://github.com/v2rayA/dist-v2ray-rules-dat/raw/master/geosite.dat
COPY --from=build-bundle /build/wing/daed /usr/local/bin

EXPOSE 2023

CMD ["daed", "run", "-c", "/etc/daed"]
