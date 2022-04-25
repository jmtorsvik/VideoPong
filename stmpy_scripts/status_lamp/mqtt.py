import paho.mqtt.client as mqtt
from threading import Thread

class StatusLampMQTTClient:
    def __init__(self, stm_driver):
        self.count = 0
        self.client = mqtt.Client(transport="websockets")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.stm_driver = stm_driver

    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("on_message(): topic: {}".format(msg.topic))

        t = msg.topic
        m = None
        if (t == "/ponggame/start_game"):
            m = "start_game"
        elif (t == "/ponggame/new_user"):
            m = "start_video"
        elif (t == "/ponggame/cancel"):
            m = "stop_game"
        
        if (m != None):
            self.stm_driver.send(m, "stm_status_lamp")

    def start(self, broker, port):

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
