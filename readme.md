# Cryptonomicon
A little react app with a node backend. Shows and updates crypto prices from the cryptocurrency APIs. Updates every 10 seconds.


## Setup

### Configuration:

By default, there is a `config/settings.js` file where the app is configured. You setup the IPs you are using (docker vs kubernetes vs PROD, etc). Local npm start uses localhost, docker-compose uses localhost and 0.0.0.0, while kubernetes uses
an IP that is created upon startup (run: `minikube ip`).

You can set the IP, the port, etc.

You can also set which Crypto Symbols the app spins up with.

#### Config File Location
If you are using anything other than Kubernetes, the file lives in this repo, under /config. If none exists, copy the default.settings.js to settings.js (in the same folder).

If you are using Kubernetes, it lives elsewhere in your system. This allows you to run both docker-compose and kubernetes, if necessary.

@TODO UPDATE this path to exclude username.
Currently, it lives at:
`/Users/bhelmer/crypto/settings.js`


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
