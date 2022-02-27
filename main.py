"""
Written by: Isak Kjerstad
Purpose: Control traffic lights.
Date: 27.02.22
"""

# Static configuration variables:
GROUP = 0
MODE = 0
TYPE = 0
TX_POWER = 7
INTERVAL_MS = 20000
RED_LIGHT_PIN = DigitalPin.P0
YELLOW_LIGHT_PIN = DigitalPin.P1
GREEN_LIGHT_PIN = DigitalPin.P2
START_DELAY_MS = 1200
STOP_DELAY_MS = 3500
BLINK_DELAY_MS = 2500
MILLIS_TO_MICRO = 1000

def convert_bool_to_int(bool_value: bool):
    """ Converts a boolean value to an integer. """

    # Convert input and return result.
    if bool_value == True:
        return 1
    else:
        return 0

def set_lights(red: bool, yellow: bool, green: bool):
    """ Controls the traffic lights hardware directly. 
    Input: red light, yellow light, green light.
    """

    # Control hardware pins connected to lights.
    pins.digital_write_pin(RED_LIGHT_PIN, convert_bool_to_int(red))
    pins.digital_write_pin(YELLOW_LIGHT_PIN, convert_bool_to_int(yellow))
    pins.digital_write_pin(GREEN_LIGHT_PIN, convert_bool_to_int(green))

def go():
    """ Sets the traffic light to green. """

    # Default, red light.
    set_lights(True, False, False)

    # Switch to green.
    set_lights(True, True, False)
    control.wait_micros(START_DELAY_MS * MILLIS_TO_MICRO)
    set_lights(False, False, True)

def stop():
    """ Sets the traffic light to red. """

    # Default, green light.
    set_lights(False, False, True)

    # Switch to red.
    set_lights(False, True, False)
    control.wait_micros(STOP_DELAY_MS * MILLIS_TO_MICRO)
    set_lights(True, False, False)

def error():
    """ Blinks the yellow light forever, until reset. """

    # Disable all lights.
    set_lights(False, False, False)

    # Blink the yellow light.
    while True:
        set_lights(False, True, False)
        control.wait_micros(BLINK_DELAY_MS * MILLIS_TO_MICRO)
        set_lights(False, False, False)
        control.wait_micros(BLINK_DELAY_MS * MILLIS_TO_MICRO)

def send_control(state):
    """ Send control signal. """
    radio.send_number(state)

def on_received_number(receivedNumber):
    """ Sets light based on control signal. """

    # Matching types have same control.
    if receivedNumber == 0:
        if TYPE == 0:
            go()
        elif TYPE == 1:
            stop()
        else:
            error()
    elif receivedNumber == 1:
        if TYPE == 0:
            stop()
        elif TYPE == 1:
            go()
        else:
            error()
    else:
        error()

def slave_control():
    """ Listens for input control signals. """

    while True:
        radio.on_received_number(on_received_number)

def master_controller():
    """ Traffic light controller. """

    # Change light status.
    while True:
        send_control(0)
        go()
        control.wait_micros(INTERVAL_MS * MILLIS_TO_MICRO)
        send_control(1)
        stop()
        control.wait_micros(INTERVAL_MS * MILLIS_TO_MICRO)

# Initialize the traffic light.
set_lights(True, True, True)
led.set_brightness(255)
led.enable(True)
radio.set_transmit_power(TX_POWER)

# Set mode.
while True:
    basic.show_number(MODE)
    if input.button_is_pressed(Button.A):
        MODE += 1
        if MODE > 1:
            MODE = 0
    if input.button_is_pressed(Button.B):
        basic.clear_screen()
        pause(500)
        break

# Set group.
while True:
    basic.show_number(GROUP)
    if input.button_is_pressed(Button.A):
        GROUP += 1
    if input.button_is_pressed(Button.B):
        radio.set_group(GROUP)
        basic.clear_screen()
        pause(500)
        break

# Set type.
while True:
    basic.show_number(TYPE)
    if input.button_is_pressed(Button.A):
        TYPE += 1
        if TYPE > 1:
            TYPE = 0
    if input.button_is_pressed(Button.B):
        basic.clear_screen()
        pause(500)
        break

set_lights(False, False, False)

# Start processes (operate the lights).
if MODE == 1:
    control.in_background(master_controller)
else:
    control.in_background(slave_control)