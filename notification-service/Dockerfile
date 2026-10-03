# Base image using Node.js Alpine
FROM node:22-alpine

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package definition
COPY package.json ./

# Install project dependencies
RUN pnpm install

# Copy application source code and configuration
COPY . .

# Build TypeScript to JavaScript
RUN pnpm build

# Expose application port
EXPOSE 3000

# Set default production environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Start application
CMD ["pnpm", "start"]
