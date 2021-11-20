FROM clonardo/socketio-backend

# Create app directory
WORKDIR /usr/src/app

RUN yarn

# Don't use root user
USER node

# Expose Port
EXPOSE 3000

# Run the app
ENTRYPOINT ["node", "./src/index.js"]