# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Serve stage - using lightweight http server
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/build ./build

# Expose port 3005
EXPOSE 3005

# Start serving the app
CMD ["serve", "-s", "build", "-l", "3005"]