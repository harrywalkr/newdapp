# Stage 1: Base
FROM node:18-alpine AS base
LABEL maintainer="your_email@example.com"
LABEL stage="base"
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

# Stage 2: Dependencies
FROM base AS dependencies
LABEL stage="dependencies"
WORKDIR /app
RUN yarn install --frozen-lockfile --network-timeout 1000000 -ddd

# Stage 3: Build
FROM dependencies AS builder
LABEL stage="builder"
WORKDIR /app
COPY . .
RUN yarn build

# Stage 4: Production
FROM node:18-alpine AS production
LABEL maintainer="your_email@example.com"
LABEL stage="production"
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD ["yarn", "start"]

# Stage 5: Development
FROM dependencies AS dev
LABEL maintainer="your_email@example.com"
LABEL stage="development"
WORKDIR /app
ENV NODE_ENV=development
COPY . .
CMD ["yarn", "dev"]
