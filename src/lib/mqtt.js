const mqtt = require("mqtt");
const client = mqtt.connect("wss://mqtt.flespi.io:443", {
  keepalive: 60,
  username: "rJGaDmyOGwpZKzb0m4ILX5nqEmE6Kha1RGZkQlWlHb8hy96J1EkNzw12GvYeBW5i",
});

export default client;
