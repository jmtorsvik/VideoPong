from stmpy import Driver
from StatusLamp import stm_status_lamp
from mqtt import StatusLampMQTTClient

broker, port = "mqtt.item.ntnu.no", 1883 # might change this later

# define driver with added state machine
driver = Driver()
driver.add_machine(stm_status_lamp)

# define mqtt client with added driver
mqtt_client = StatusLampMQTTClient(driver)

# start driver and mqtt client
driver.start()
mqtt_client.start(broker, port)
