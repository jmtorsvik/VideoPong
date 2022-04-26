import paho.mqtt.client as mqtt
import json
from threading import Thread

# define broker and port
broker, port = "broker.emqx.io", 8083

class MQTTClient:
    def __init__(self, stm_driver):
        self.count = 0
        self.client = mqtt.Client(transport="websockets")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.stm_driver = stm_driver

    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        t = msg.topic
        
        print("on_message(): topic: {}".format(t))
        """
        print(msg.payload)
        pl = json.loads(msg.payload)
        print(pl)
        """
        if True:#pl['office']:
            m = None
            pf = "/ponggame/"
            if (t == pf + "start_game"):
                m = "start_game"
            elif (t == pf + "new_user"):
                m = "start_video"
            elif (t == pf + "cancel"):
                m = "stop_game"
            elif (t == pf + "exit_video"):
                m = "stop"
            
            if (m != None):
                self.stm_driver.send(m, "stm_status_lamp")
                if (m == "start_game" or m == "stop"):
                    self.stm_driver.send(m, "stm_motion_detector")

    def start(self):
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)

        self.client.subscribe("/ponggame/#")

        try:
            # line below should not have the () after the function!
            # do not know what the comment above is about! ???
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()

