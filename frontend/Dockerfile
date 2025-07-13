# Stage 1: Dependency Installation
# Use a specific Node.js version for consistency. 'alpine' is a lightweight Linux distribution.
FROM node:20-alpine AS deps

# Use tini as a lightweight init system to properly manage processes and signals.
# This is a best practice for running Node.js in a container.
RUN apk add --no-cache tini

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and the lock file to leverage Docker's layer caching.
# This step will only be re-run if these files change.
COPY package.json package-lock.json* ./

# Install dependencies using 'npm ci' which is faster and more reliable for CI/CD environments.
RUN npm ci

# ---

# Stage 2: Build Stage
# This stage builds the Next.js application for production.
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

# Run the production build command
RUN npm run build

# ---

# Stage 3: Production Stage
# This is the final, lean image that will be deployed.
FROM node:20-alpine AS runner

WORKDIR /app

# **FIX**: Install tini in the final runner stage as well.
RUN apk add --no-cache tini

# Set the environment to production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add a non-root user for enhanced security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary production assets from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change ownership of the app directory to the new user
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Expose the port Next.js runs on by default
EXPOSE 3000

# The command to run the application.
# 'tini' is used as the entry point to ensure the Node.js process is managed correctly.
CMD ["tini", "--", "npm", "start"]
# Stage 1: Dependency Installation
# Use a specific Node.js version for consistency. 'alpine' is a lightweight Linux distribution.
FROM node:20-alpine AS deps

# Use tini as a lightweight init system to properly manage processes and signals.
# This is a best practice for running Node.js in a container.
RUN apk add --no-cache tini

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and the lock file to leverage Docker's layer caching.
# This step will only be re-run if these files change.
COPY package.json package-lock.json* ./

# Install dependencies using 'npm ci' which is faster and more reliable for CI/CD environments.
RUN npm ci

# ---

# Stage 2: Build Stage
# This stage builds the Next.js application for production.
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

# Run the production build command
RUN npm run build

# ---

# Stage 3: Production Stage
# This is the final, lean image that will be deployed.
FROM node:20-alpine AS runner

WORKDIR /app

# **FIX**: Install tini in the final runner stage as well.
RUN apk add --no-cache tini

# Set the environment to production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add a non-root user for enhanced security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary production assets from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change ownership of the app directory to the new user
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Expose the port Next.js runs on by default
EXPOSE 3000

# The command to run the application.
# 'tini' is used as the entry point to ensure the Node.js process is managed correctly.
CMD ["tini", "--", "npm", "start"]
