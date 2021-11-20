FROM node:14-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

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
