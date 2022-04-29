const mqtt = require("mqtt");
const client = mqtt.connect("ws://broker.hivemq.com:8000", {
  keepalive: 60,
  clean: true,
});

export default client;
