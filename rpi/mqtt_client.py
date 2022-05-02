import paho.mqtt.client as mqtt
import json
from threading import Thread

# define broker and port
broker, port = "wss://mqtt.flespi.io", 443

class MQTTClient:
    def __init__(self, stm_driver):
        self.count = 0
        self.client = mqtt.Client(transport="websockets")
        self.client.username_pw_set("rJGaDmyOGwpZKzb0m4ILX5nqEmE6Kha1RGZkQlWlHb8hy96J1EkNzw12GvYeBW5i", "aeNg8aibai0oiloo7xiad1iaju1uch")

        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.stm_driver = stm_driver

    def on_connect(self, client, userdata, flags, rc):
        # assert connection establishment
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        # assert received message on topic t
        t = msg.topic
        print("on_message(): topic: {}".format(t))
        
        # extract payload and check if message comes from the office
        pl = str(msg.payload.decode("utf-8"))
        office = False
        try:
            pl = json.loads(pl)
            office = pl['office']
        except:
            print("payload is not a valid JSON format")

        # creates a stm message based on the topic
        if office:
            m = None
            pf = "/ponggame/"
            if (t == pf + "start_game"):
                m = "game_started"
            elif (t == pf + "new_user"):
                m = "video_started"
            elif (t == pf + "cancel"):
                m = "game_stopped"
            elif (t == pf + "exit_video"):
                m = "stopped"
            
            # send message to stms
            if (m != None):
                self.stm_driver.send(m, "stm_status_lamp")
                if (m == "video_started" or m == "stopped"):
                    self.stm_driver.send(m, "stm_motion_detector")

    def start(self):
        # connect client
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)

        # subscribe on topics
        self.client.subscribe("/ponggame/#")

        # start a thread for the mqtt client
        try:
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()
