import paho.mqtt.client as mqtt
from threading import Thread

class StatusLampMQTTClient:
    def __init__(self, stm_driver):
        self.count = 0
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.stm_driver = stm_driver

    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("on_message(): topic: {}".format(msg.topic))

        # create string from message payload
        m = str(msg.payload, "UTF-8")
        
        #send message if it's valid
        valid_msg = ["start_video", "stop", "start_game", "stop_game"]
        if (m in valid_msg):
            self.stm_driver.send(m, "stm_status_lamp")

    def start(self, broker, port):

        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)

        #self.client.subscribe("ttm4115")
        self.client.subscribe("/ttm4115/team13")

        try:
            # line below should not have the () after the function!
            # do not know what the comment above is about! ???
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()
