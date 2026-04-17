FROM node:20-alpine

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install build tools for native dependencies
RUN apk add --no-cache python3 make g++

# Install dependencies
RUN npm install

# Copy application source
COPY . .

EXPOSE 3000

# Start in development mode to retain hot reloading
CMD ["npm", "run", "dev"]
