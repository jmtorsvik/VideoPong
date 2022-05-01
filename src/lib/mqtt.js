const mqtt = require("mqtt");
const client = mqtt.connect("ws://mqtt.henriksen.cloud:9001", {
  keepalive: 60,
});

export default client;
