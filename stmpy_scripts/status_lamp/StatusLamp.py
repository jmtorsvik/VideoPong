from stmpy import Machine
from sense_hat import SenseHat

class StatusLamp:

    def __init__(self):
        self.sense = SenseHat()
        self.off = (0, 0, 0)
        self.blue = (0, 0, 255)
        self.green = (0, 255, 0)
        self.pixels = 64*[self.off]

    # set pixels of sense hat
    def set_pixels(self):
        self.sense.set_pixels(self.pixels)

    # turns lamp1 off
    def lamp1_off(self):
        self.pixels = self.pixels[:40] + 24*[self.off]
        self.set_pixels()

    # turns lamp1 on
    def lamp1_on(self):
        self.pixels = self.pixels[:40] + 24*[self.blue]
        self.set_pixels()

    # turns lamp2 off
    def lamp2_off(self):
        self.pixels = 24*[self.off] + self.pixels[24:]
        self.set_pixels()

    # turns lamp2 on
    def lamp2_on(self):
        self.pixels = 24*[self.green] + self.pixels[24:]
        self.set_pixels()
      
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
       'entry': 'lamp1_off; lamp2_off'
}

in_video = {'name': 'in_video',
      'entry': 'lamp1_on; lamp2_off'
}

in_game = {'name': 'in_game',
      'entry': 'lamp2_on'
}

# define state machine
stm_status_lamp = Machine(name='stm_status_lamp', transitions=[t0, t1, t2, t3, t4, t5], states=[idle, in_video, in_game], obj=status_lamp)
status_lamp.stm = stm_status_lamp
