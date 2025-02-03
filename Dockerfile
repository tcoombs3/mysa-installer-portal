# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server source
COPY server/src ./src

# Copy client build
COPY client/build ./public

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
