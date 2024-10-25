# Kubernetes Websocket

### Kubernetes HA websocket server example.

This example uses Redis for external websocket state management, allowing pod replacement without interuption to the client connection. When a pod goes down client will reconnect to the websocket and the server continues the session.


``` terminal
# build the image
docker build -t websocket-server:local .

# deploy
kubectl apply -f redis.yaml
kubectl apply -f websocket-server.yaml

# get services and pods
kubectl get services
kubectl get pods

# run the client in another tab
npm ci
node client-retry.js

# stop the webserver by deleting the pod
kubectl delete pod websocket-server-####

# or optionally simulate a container crash
docker container ls
docker kill <WS_CONTAINER_ID>

# verify the pod restarted
kubectl get pods

NAME                                READY   STATUS    RESTARTS      AGE
redis-585cd75979-gl6bj              1/1     Running   3 (16h ago)   17h
websocket-server-86dcb68bc8-xzr6r   1/1     Running   1 (6s ago)    9m19s


# verify the client reconnected. your should see
...
Message received from server: Hello from the client! 10
WebSocket connection closed CloseEvent
...
Connection retry #1
Connection retry #2
WebSocket connection opened Event
...
Message received from server: Hello from the client! 11
Message received from server: Hello from the client! 12

```