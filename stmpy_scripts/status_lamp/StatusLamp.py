from stmpy import Machine
from sense_hat import SenseHat

class StatusLamp:

    def __init__(self):
        self.sense = SenseHat()

    # switch lamp off
    def lamp_off(self):
        self.sense.clear()
        print("lamp turned off")

    # switch lamp to blue
    def lamp_blue(self):
        self.sense.clear((0, 0, 255))
        print("lamp turned blue")

    # switch lamp to green
    def lamp_green(self):
        self.sense.clear((0, 255, 0))
        print("lamp turned green")
      
status_lamp = StatusLamp()

# define transitions
t0 = {'source': 'initial',
      'target': 'idle'
}

t1 = {'trigger':'start_video',
      'source':'idle',
      'target':'in_video',
}

t2 = {'trigger':'stop', 
      'source':'in_video', 
      'target':'idle', 
}

t3 = {'trigger':'start_game', 
      'source':'in_video', 
      'target':'in_game', 
}

t4 = {'trigger':'stop_game', 
      'source':'in_game', 
      'target':'in_video', 
}

t5 = {'trigger':'stop', 
      'source':'in_game', 
      'target':'idle', 
}

# define states
idle = {'name': 'idle',
       'entry': 'lamp_off'
}

in_video = {'name': 'in_video',
      'entry': 'lamp_blue'
}

in_game = {'name': 'in_game',
      'entry': 'lamp_green'
}

# define state machine
stm_status_lamp = Machine(name='stm_status_lamp', transitions=[t0, t1, t2, t3, t4, t5], states=[idle, in_video, in_game], obj=status_lamp)
status_lamp.stm = stm_status_lamp
