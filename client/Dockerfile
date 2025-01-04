FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the project
RUN npm run build

# Serve the built files with a lightweight server
FROM node:18

WORKDIR /app
COPY --from=build /app/dist ./

RUN npm install -g serve

# Expose port 80
EXPOSE 80

CMD ["serve", "-s", ".", "-l", "80"]