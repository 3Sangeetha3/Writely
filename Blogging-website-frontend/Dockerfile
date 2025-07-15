# frontend/Dockerfile

ARG NODE_VERSION=24.3.0
FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /app

# Copy package.json & install dependencies first (cache layer)
COPY package*.json ./
RUN npm install

# Then copy the rest of the files
COPY . .

# Expose frontend port
EXPOSE 5173

# Run Vite dev server on container startup
CMD ["npm", "run", "dev", "--", "--host"]
