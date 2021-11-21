FROM node:14-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
# Bypass https as https://swapi.dev hasn't renewed its certificate
ENV NODE_TLS_REJECT_UNAUTHORIZED 0

# Create app directory
WORKDIR /usr/src/app

# Install nodemon
RUN yarn global add nodemon

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Copy in the source
COPY . .

# Don't use root user
USER node

# Expose Port
EXPOSE 3000

# Run the app
CMD ["node", "./src/index.js"]
