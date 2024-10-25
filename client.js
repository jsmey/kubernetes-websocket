const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8080');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  ws.send('Hello, server!');
});

ws.on('message', (data) => {
  console.log('Received:', data);
});
