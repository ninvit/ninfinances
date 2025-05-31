# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files for the backend
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN npm install --prefix backend

# Copy the backend files
COPY backend ./backend

# Copy the rest of the files
COPY . .

# Expose the backend port
EXPOSE 3000

# Define the command to run the backend application
CMD ["node", "backend/server.js"]