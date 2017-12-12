# Cryptonomicon
A little react app with a node backend. Shows and updates crypto prices from the cryptocurrency APIs. Updates every 10 seconds.


## Setup

### Local:

#### Prereqs
1. Docker for Mac / Docker Machine /etc
2. npm (Node package manager -- to install)

#### Steps using Docker-Compose
```
1. cd to the repo root.
2. cd server && npm install
3. cd ../app && npm install
4. cd ../ && docker-compose up -d && docker-compose ps
```

#### Steps using MiniKube

##### Build the Things
1. Build the server docker image locally.
```
docker build -t "crypto_server:v1" -f dockerfile-node-server .
```
2. Build the app docker image locally.
```
docker build -t "crypto_app:v1" -f dockerfile-react .
```
3. Confirm we have our images:
```
docker images | grep 'crypto'
```

##### Make them Pods
