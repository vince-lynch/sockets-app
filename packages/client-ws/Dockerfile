FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm i

# Copy in the source
COPY . .

# Don't use root user
USER node

# Run the tests
ENTRYPOINT ["npm", "test"]
