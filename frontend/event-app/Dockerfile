# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the default CRA development port
EXPOSE 3000

# Start the app using CRA's dev server
CMD ["npm", "start"]
