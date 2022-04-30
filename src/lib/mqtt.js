const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8080", {
  keepalive: 60,
});

export default client;
