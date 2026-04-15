const SockJS = require('sockjs-client');
const Stomp = require('@stomp/stompjs');

const client = new Stomp.Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  debug: (str) => console.log(str),
});

client.onConnect = () => {
  console.log('Connected to WebSocket');

  // Subscribe to a test topic
  client.subscribe('/topic/test', (message) => {
    console.log('Received message:', message.body);
  });

  // Send a test message
  client.publish({
    destination: '/app/test',
    body: 'Hello from test client',
  });
};

client.onStompError = (frame) => {
  console.error('STOMP error:', frame);
};

client.onWebSocketError = (error) => {
  console.error('WebSocket error:', error);
};

client.onWebSocketClose = () => {
  console.log('WebSocket closed');
};

console.log('Attempting to connect...');
client.activate();