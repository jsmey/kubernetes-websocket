
const WebSocket = require('ws');
class ReconnectingWebSocket {
  constructor(url, protocols = [], options = {}) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;
    this.reconnectInterval = options.reconnectInterval || 1000;
    this.maxRetries = options.maxRetries || Infinity;
    this.retryCount = 0;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url, this.protocols);

    this.ws.onopen = (event) => {
      console.log('WebSocket connection opened', event);
      this.retryCount = 0; // Reset retry count on successful connection
      if (this.options.onOpen) {
        this.options.onOpen(event);
      }
    };

    this.ws.onmessage = (event) => {
      console.log('Message received from server:', event.data.toString());
      if (this.options.onMessage) {
        this.options.onMessage(event);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      if (this.retryCount < this.maxRetries) {
        setTimeout(() => {
          console.log(`Connection retry #${this.retryCount + 1}`);
          this.retryCount++;
          this.connect();
        }, this.reconnectInterval);
      }
      if (this.options.onClose) {
        this.options.onClose(event);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error', error);
      if (this.options.onError) {
        this.options.onError(error);
      }
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error('WebSocket is not open. Ready state:', this.ws.readyState);
    }
  }

  close(code, reason) {
    if (this.ws) {
      this.ws.close(code, reason);
    }
  }
}

// Usage
const wsClient = new ReconnectingWebSocket('ws://127.0.0.1:8080', [], {
  reconnectInterval: 2000,
  maxRetries: 15,
});

let i = 0;
    
let intervalId = setInterval(() => {
    wsClient.send(`Hello from the client! ${i}`);
    i++;
} , 5000);


