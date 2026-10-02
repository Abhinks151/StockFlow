# Base image using Node.js 22 Alpine
FROM node:22-alpine

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package definition and lockfile
COPY package.json pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Copy application source code and configuration
COPY . .

# Generate Prisma Client v7
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN pnpm build

# Expose application port
EXPOSE 3002

# Set default production environment variables
ENV PORT=3002
ENV NODE_ENV=production

# Run migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start"]
