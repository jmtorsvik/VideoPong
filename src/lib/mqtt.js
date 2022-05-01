const mqtt = require("mqtt");
const client = mqtt.connect("ws://mqtt.henriksen.cloud", {
  keepalive: 60,
});

export default client;
