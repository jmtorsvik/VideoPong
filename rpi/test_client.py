import paho.mqtt.client as mqtt

client = mqtt.Client(transport="websockets")
client.connect("broker.emqx.io", 8083)

client.publish("/ponggame/exit_video", payload='{"office": true}')

print("published")
