# Install all dependencies
FROM node:14-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Install production dependencies
FROM node:14-alpine AS production-dependencies
WORKDIR /app
ENV NODE_ENV production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Build application
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm install -g @nestjs/cli
RUN nest build


# Production container
FROM node:14-alpine AS production
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3002
