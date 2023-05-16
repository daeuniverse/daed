FROM node:alpine as builder

WORKDIR /build

COPY . .

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm build

FROM caddy:alpine

WORKDIR /srv

COPY --from=builder /build/dist/. .
COPY Caddyfile .

CMD ["caddy", "run"]
