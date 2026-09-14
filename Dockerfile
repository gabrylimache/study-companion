# ---- Builder Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . ./

# Build the Vite application
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production
WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose the port the app will run on
EXPOSE 4173

# Command to serve the static site
CMD ["serve", "-s", "dist", "-l", "4173"]
