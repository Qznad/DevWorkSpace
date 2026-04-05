import { Client } from "@stomp/stompjs";

let client = null;
const subscribers = {};

const WS_URL = "ws://localhost:8080/ws"; // change if your Spring Boot WS endpoint is different

const connect = (onConnectCallback) => {
  if (client && client.connected) return;

  client = new Client({
    brokerURL: WS_URL,
    debug: (str) => console.log("[WS]", str),
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("WebSocket connected");
    if (onConnectCallback) onConnectCallback();
  };

  client.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  };

  client.activate();
};

const disconnect = () => {
  if (client) client.deactivate();
};

const subscribe = (topic, callback) => {
  if (!client || !client.connected) {
    console.error("WS not connected yet");
    return;
  }
  if (subscribers[topic]) {
    subscribers[topic].unsubscribe();
  }
  subscribers[topic] = client.subscribe(topic, (message) => {
    if (callback) callback(JSON.parse(message.body));
  });
};

const unsubscribe = (topic) => {
  if (subscribers[topic]) {
    subscribers[topic].unsubscribe();
    delete subscribers[topic];
  }
};

const send = (destination, body) => {
  if (!client || !client.connected) {
    console.error("WS not connected yet");
    return;
  }
  client.publish({
    destination,
    body: JSON.stringify(body),
  });
};

const WSService = {
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  send,
};

export default WSService;