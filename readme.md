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

1. Install Minikube, VirtualBox

2. Spin up minikube: `minikupe up`

3. Get the IP of the minikube node:
`minikube ip`

4. Copy the /config/settings.js file to:
`/Users/bhelmer/crypto`

5. Edit the file's: `react.calls.host` with the value of this minikube node ip.

6. Spin up the server:
```
kubectl apply -f k8s-server.yml
```

7. Spin up the react piece:
```
kubectl apply -f k8s-react.yml
```

8. Confirm everything is up:
```
kubectl get po
kubectl get svc
kubectl get deploy
```
Make sure all statues look good.

9. Hit the from step 3, with port 30002.
