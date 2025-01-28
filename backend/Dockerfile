# Use the official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Add this to the Dockerfile in ./backend
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 4000
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start"]
