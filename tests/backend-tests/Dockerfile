# Use the official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /tests

# Copy the test script and test dependencies
COPY run-tests.sh ./
COPY ../.. .

# Install test dependencies
RUN npm install

# Make the test script executable
RUN chmod +x /tests/run-tests.sh
