# Use an official Ubuntu as the base image
# FROM ubuntu:20.04
FROM --platform=linux/x86-64 ubuntu:20.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies required for building and using Node.js
RUN apt-get update && \
    apt-get install -y curl build-essential python2 python3 python3-distutils python-is-python3 && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@6.14.13 && \
    npm install -g yarn@1.22.10

# Verify the installed versions
RUN node -v && npm -v && yarn -v

# Create and set the working directory
WORKDIR /app

# Copy your application to the container
COPY . /app

# Install your application dependencies
RUN yarn install

# Build the application
# RUN yarn build

# Expose the port that the app will run on
EXPOSE 8080

# Run the application with yarn serve
CMD ["yarn", "serve"]