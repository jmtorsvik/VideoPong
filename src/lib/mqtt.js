const mqtt = require("mqtt");
const client = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
  keepalive: 60,
});

export default client;
