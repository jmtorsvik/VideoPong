from selenium import webdriver
import paho.mqtt.client as mqtt
import json
from threading import Thread

# define broker and port
broker, port = "localhost", 8080

class MQTTClient:
    def __init__(self):
        self.count = 0
        self.client = mqtt.Client(transport="websockets")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.is_active = False
        print("STARTED")

    def on_connect(self, client, userdata, flags, rc):
        # assert connection establishment
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        # assert received message on topic t
        t = msg.topic
        print("on_message(): topic: {}".format(t))
        
        
        if(t == "/ponggame/new_user" and not self.is_active):
            self.is_active = True
            chrome_options = webdriver.ChromeOptions(); 
            chrome_options.add_experimental_option("excludeSwitches", ['enable-automation']);
            chrome_options.add_argument("use-fake-device-for-media-stream"); 
            driver = webdriver.Chrome(options=chrome_options);  
            driver.get('http://localhost:3000?office=true')
            driver.fullscreen_window()


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


client = MQTTClient()
client.start()
    
