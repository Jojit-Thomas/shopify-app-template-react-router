# Stage 1: Build
FROM node:22-alpine AS builder

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --prod --frozen-lockfile && pnpm store prune

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "run", "docker-start"]
