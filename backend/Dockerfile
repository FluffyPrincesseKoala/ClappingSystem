# Use the official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 4000
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]
