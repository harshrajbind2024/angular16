### STAGE 1: Build ### 

# We label our stage as ‘builder’ 
FROM node:16.14.0-alpine as builder

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install Git
RUN apk update && apk upgrade && \
    apk add --no-cache git openssh

# Install and cache app dependencies
COPY . .

RUN ls

# # Accept the SSH private key as a build argument
# ARG SSH_PRIVATE_KEY

# # Setup SSH with the private key
# RUN mkdir -p /root/.ssh && \
#     echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa && \
#     chmod 600 /root/.ssh/id_rsa && \
#     ssh-keyscan github.com >> /root/.ssh/known_hosts

# Use forwarded SSH key for cloning submodules
# RUN --mount=type=ssh git submodule update --init --recursive

# Change directory to the submodule and install dependencies
#WORKDIR /app/umwelt-library.Submodule
WORKDIR /app/umwelt-library
RUN pwd
RUN npm ci
RUN npm install ng-packagr --legacy-peer-deps
RUN npm run generate-env
RUN npm run build umwelt-lib

# RUN npm run generate-env

# Change directory back to the project root
WORKDIR /app

# Print current working directory
RUN ls

RUN npm ci

# Build the project
RUN npm run build

# Print a message indicating build completion
RUN echo "Build completed"

### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html
RUN ls  /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
