import cv2
from paho.mqtt.client import Client
from mqtt_client import broker, port
from stmpy import Machine
from threading import Thread

class MotionDetector:

    def __init__(self):
        self.running = False

    def start_detecting(self):
        self.running = True
        Thread(target=self.detect).start()

    def stop_detecting(self):
        self.running = False

    def start_video(self):
        print("Video chat started")
        mqttc = Client(transport="websockets")
        mqttc.connect(broker, port)
        mqttc.publish("ponggame/office_start")

    def detect(self):
        print("Started detecting")
        # Motion detection inspired by https://www.geeksforgeeks.org/webcam-motion-detector-python/
        back_frame = None
        video = cv2.VideoCapture(0)
        while (self.running):
            _, frame = video.read()
            detected = False

            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray_frame = cv2.GaussianBlur(gray_frame, (21, 21), 0)

            if back_frame is None:
                back_frame = gray_frame
                continue
            
            diff_frame = cv2.absdiff(back_frame, gray_frame)
            # Threshold value is currently set to 30. The optimal threshold value may vary from space to space
            thresh_frame = cv2.threshold(diff_frame, 30, 255, cv2.THRESH_BINARY)[1]
            thresh_frame = cv2.dilate(thresh_frame, None, iterations = 2)

            cnts,_ = cv2.findContours(thresh_frame.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for contour in cnts:
                if cv2.contourArea(contour) < 10000:
                    continue
                detected = True

            if (detected):
                print("Motion detected!")
                self.stm.send("motion_detected")

            key = cv2.waitKey(1)
            if key == ord('q'):
                break
            
            # set new background to current frame
            back_frame = gray_frame

            cv2.imshow("Difference Frame", diff_frame)

        video.release()
        print("Stopped detecting")                 
      
motion_detector = MotionDetector()

# define transitions
t0 = {'source': 'initial',
      'target': 'detecting',
}

t1 = {'trigger':'motion_detected',
      'source':'detecting',
      'target':'wait',
}

t2 = {'trigger':'t', 
      'source':'wait', 
      'target':'detected', 
}

t3 = {'trigger':'motion_detected', 
      'source':'detected', 
      'target':'idle', 
      'effect': 'start_video; stop_timer("t")'
}

t4 = {'trigger':'t', 
      'source':'detected', 
      'target':'detecting',
      'effect': 'stop_detecting'
}

t5 = {'trigger':'stop', 
      'source':'idle', 
      'target':'detecting', 
}

t6 = {'trigger':'start_video', 
      'source':'detecting', 
      'target':'idle', 
}

# define states
detecting = {'name': 'detecting',
    'entry': 'start_detecting'
}

wait = {'name': 'wait',
    'entry': 'stop_detecting; start_timer("t", 5000)'
}

detected = {'name': 'detected',
    'entry': 'start_detecting; start_timer("t", 5000)'
}

idle = {'name': 'idle',
    'entry': 'stop_detecting'
}

# define state machine
stm_motion_detector = Machine(name='stm_motion_detector', transitions=[t0, t1, t2, t3, t4, t5, t6], states=[detecting, wait, detected, idle], obj=motion_detector)
motion_detector.stm = stm_motion_detector
