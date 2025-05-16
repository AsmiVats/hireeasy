# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install -g pnpm

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY apps/backend/package.json ./apps/backend/

# RUN pnpm install
# COPY apps/backend ./apps/backend
# COPY packages ./packages

# FROM node:20-alpine AS development
# WORKDIR /app
# COPY package*.json ./
# RUN npm install -g pnpm
# RUN npm install -g nodemon
# RUN pnpm install
# COPY . .
# EXPOSE 8080
# CMD ["pnpm", "dev"]

# # Production stage
# FROM node:20-alpine AS production
# RUN echo "starting production"
# WORKDIR /app
# RUN npm install -g pnpm
# # COPY --from=builder /app ./
# COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
# COPY --from=builder /app/apps/backend ./apps/backend
# COPY --from=builder /app/node_modules ./node_modules

# ENV NODE_ENV=production
# ENV PORT=8080
# EXPOSE 8080
# CMD ["node", "index.js"]


# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config and package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY index.js app.js ./
COPY scripts/ ./scripts/

# Production stagedocker build --target production -t nextedge-backend .
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY  ./.prod.env ./.env
EXPOSE 8080
CMD ["node", "index.js"]

# Development stage
FROM base AS development
COPY .env ./
RUN npm install -g nodemon
ENV NODE_ENV=development
ENV PORT=8080
EXPOSE 8080
CMD ["nodemon", "index.js"]