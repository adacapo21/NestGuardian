# Stage 1
FROM node:14 AS builder
WORKDIR /usr/src/app
COPY package*.json ./

# Install Python and bcrypt
RUN apt-get update && apt-get install -y python
RUN npm install bcrypt@5.1.0

# Install other dependencies and build
RUN npm install
RUN npm rebuild bcrypt
COPY . .
RUN npm run build

# Stage 2
FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./

# Install Python and bcrypt in the alpine image
RUN apk add --no-cache python3 make g++
RUN npm install bcrypt@5.1.0

# Remove node_modules and reinstall
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm install
RUN npm rebuild bcrypt

# Copy build files
COPY --from=builder /usr/src/app/dist ./dist

CMD ["npm", "run", "start"]
