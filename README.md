# ws-monorepo
a repository to play around with websocket events

## First time

install and hoist the packages and create the sys links for lerna 
```sh
npm run bootstrap
```

## Run as a developer

Open two terminal windows and run the following
```sh
cd ./packages/server-ws && npm start
```

```sh
cd ./packages/client-ws && npm start
```

## Run the tests

in the base of the repo run the command
```sh
npm test
```
