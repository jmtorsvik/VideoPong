import paho.mqtt.client as mqtt
import time

client = mqtt.Client(transport="websockets")
client.connect("broker.emqx.io", 8083)

while True:
    client.publish("/ponggame/exit_video")
    time.sleep(5)