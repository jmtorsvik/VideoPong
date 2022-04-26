from stmpy import Driver
from mqtt_client import MQTTClient
from StatusLamp import stm_status_lamp
from MotionDetector import stm_motion_detector

# define driver with added state machines
driver = Driver()
#driver.add_machine(stm_status_lamp)
driver.add_machine(stm_motion_detector)

# define mqtt client with added driver
mqtt_client = MQTTClient(driver)

# start driver and mqtt client
driver.start()
mqtt_client.start()
