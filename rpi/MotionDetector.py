import cv2
from paho.mqtt.client import Client
from mqtt_client import broker, port
from stmpy import Machine
from threading import Thread


class MotionDetector:

    def __init__(self):
        self.running = False

    def start_detecting(self):
        # set running to true and start a detection thread that runs as long as running is true
        self.running = True
        Thread(target=self.detect).start()

    def stop_detecting(self):
        # set running to false which will stop the running detection thread
        self.running = False

    def start_video(self):
        # send an mqtt message that starts an instance of the video chat on the office ocmputer
        print("Video chat started")
        mqttc = Client(transport="websockets")
        mqttc.connect(broker, port)
        mqttc.publish("ponggame/office_start")

    def detect(self):
        # Motion detection inspired by https://www.geeksforgeeks.org/webcam-motion-detector-python/
        print("Started detecting")
        back_frame = None  # background frame for comparison
        video = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # openCV video capture
        while (self.running):
            # retrieve current frame
            _, frame = video.read() 
            
            detected = False # boolean indicating observed detection

            # create a GaussianBlur image for easier comparison
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray_frame = cv2.GaussianBlur(gray_frame, (21, 21), 0)

            # set initial background frame
            if back_frame is None:
                back_frame = gray_frame
                continue
            
            # compare current frame with background frame
            diff_frame = cv2.absdiff(back_frame, gray_frame)

            # create a black-white frame showing the observed changed
            # threshold value is currently set to 60. The most suiting threshold value may vary from space to space
            thresh_frame = cv2.threshold(
                diff_frame, 60, 255, cv2.THRESH_BINARY)[1]
            thresh_frame = cv2.dilate(thresh_frame, None, iterations=2)

            # find the contours of object in motion
            cnts, _ = cv2.findContours(
                thresh_frame.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # search for observed change in contours
            for contour in cnts:
                if cv2.contourArea(contour) < 10000:
                    continue
                detected = True

            # alert detected motion
            if (detected):
                print("Motion detected!")
                self.stm.send("motion_detected")

            # end motion detection if 'q' is entered on keyboard
            key = cv2.waitKey(1)
            if key == ord('q'):
                break

            # set new background frame to current frame
            back_frame = gray_frame

            # display black-white frame
            cv2.imshow("Difference Frame", diff_frame)

        # stop motion detection
        video.release()
        cv2.destroyAllWindows()
        print("Stopped detecting")

    def test_print(self, txt):
        print(txt)

motion_detector = MotionDetector()

# define transitions
t0 = {'source': 'initial',
      'target': 'detecting',
      'effect': 'start_detecting'
      }

t1 = {'trigger': 'motion_detected',
      'source': 'detecting',
      'target': 'wait'
      }

t2 = {'trigger': 't',
      'source': 'wait',
      'target': 'detected'
      }

t3 = {'trigger': 'motion_detected',
      'source': 'detected',
      'target': 'idle',
      'effect': 'start_video'
      }

t4 = {'trigger': 't',
      'source': 'detected',
      'target': 'detecting'
      }

t5 = {'trigger': 'stopped',
      'source': 'idle',
      'target': 'detecting'
      }

t6 = {'trigger': 'video_started',
      'source': 'detecting',
      'target': 'idle'
      }

t7 = {'trigger': 'video_started',
      'source': 'wait',
      'target': 'idle'
      }

t8 = {'trigger': 'video_started',
      'source': 'detected',
      'target': 'idle'
      }


# define states
detecting = {'name': 'detecting',
             'entry': 'test_print("state: DETECTING")'
             }

wait = {'name': 'wait',
        'entry': 'start_timer("t", 15000); stop_detecting; test_print("state: WAIT")'
        }

detected = {'name': 'detected',
            'entry': 'start_timer("t", 15000); start_detecting; test_print("state: DETECTED")'
            }

idle = {'name': 'idle',
        'entry': 'stop_timer("t"); stop_detecting; test_print("state: IDLE")',
        'exit': 'start_detecting'
        }

# define state machine
stm_motion_detector = Machine(name='stm_motion_detector', transitions=[
                              t0, t1, t2, t3, t4, t5, t6], states=[detecting, wait, detected, idle], obj=motion_detector)
motion_detector.stm = stm_motion_detector
