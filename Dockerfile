# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY . .
# 针对 Docker，将 Nitro 预设改为 node 运行时
RUN NITRO_PRESET=node pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
COPY --from=build /app/.output ./.output
CMD ["node", ".output/server/index.mjs"]


