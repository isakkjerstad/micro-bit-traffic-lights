/** 
Written by: Isak Kjerstad
Purpose: Control traffic lights.
Date: 27.02.22

 */
//  Static configuration variables:
let GROUP = 0
let MODE = 0
let TYPE = 0
let TX_POWER = 7
let INTERVAL_MS = 20000
let RED_LIGHT_PIN = DigitalPin.P0
let YELLOW_LIGHT_PIN = DigitalPin.P1
let GREEN_LIGHT_PIN = DigitalPin.P2
let STOP_CONTROL_SIGNAL = 0
let GO_CONTROL_SIGNAL = 1
let START_DELAY_MS = 1200
let STOP_DELAY_MS = 3500
let BLINK_DELAY_MS = 2500
let SAFETY_DELAY_MS = 3000
let MILLIS_TO_MICRO = 1000
function convert_bool_to_int(bool_value: boolean): number {
    /** Converts a boolean value to an integer. */
    //  Convert input and return result.
    if (bool_value == true) {
        return 1
    } else {
        return 0
    }
    
}

function set_lights(red: boolean, yellow: boolean, green: boolean) {
    /**  Controls the traffic lights hardware directly. 
    Input: red light, yellow light, green light.
    
 */
    //  Control hardware pins connected to lights.
    pins.digitalWritePin(RED_LIGHT_PIN, convert_bool_to_int(red))
    pins.digitalWritePin(YELLOW_LIGHT_PIN, convert_bool_to_int(yellow))
    pins.digitalWritePin(GREEN_LIGHT_PIN, convert_bool_to_int(green))
}

function go() {
    /** Sets the traffic light to green. */
    //  Default, red light.
    set_lights(true, false, false)
    //  Switch to green.
    set_lights(true, true, false)
    control.waitMicros(START_DELAY_MS * MILLIS_TO_MICRO)
    set_lights(false, false, true)
}

function stop() {
    /** Sets the traffic light to red. */
    //  Default, green light.
    set_lights(false, false, true)
    //  Switch to red.
    set_lights(false, true, false)
    control.waitMicros(STOP_DELAY_MS * MILLIS_TO_MICRO)
    set_lights(true, false, false)
}

function error() {
    /** Blinks the yellow light forever, until reset. */
    //  Disable all lights.
    set_lights(false, false, false)
    //  Blink the yellow light.
    while (true) {
        set_lights(false, true, false)
        control.waitMicros(BLINK_DELAY_MS * MILLIS_TO_MICRO)
        set_lights(false, false, false)
        control.waitMicros(BLINK_DELAY_MS * MILLIS_TO_MICRO)
    }
}

function send_control(state: number) {
    /** Send control signal. */
    radio.sendNumber(state)
}

//  Initialize the traffic light.
set_lights(true, true, true)
led.setBrightness(255)
led.enable(true)
radio.setTransmitPower(TX_POWER)
//  Set mode.
while (true) {
    basic.showNumber(MODE)
    if (input.buttonIsPressed(Button.A)) {
        MODE += 1
        if (MODE > 1) {
            MODE = 0
        }
        
    }
    
    if (input.buttonIsPressed(Button.B)) {
        basic.clearScreen()
        pause(500)
        break
    }
    
}
//  Set group.
while (true) {
    basic.showNumber(GROUP)
    if (input.buttonIsPressed(Button.A)) {
        GROUP += 1
    }
    
    if (input.buttonIsPressed(Button.B)) {
        radio.setGroup(GROUP)
        basic.clearScreen()
        pause(500)
        break
    }
    
}
//  Set type.
while (true) {
    basic.showNumber(TYPE)
    if (input.buttonIsPressed(Button.A)) {
        TYPE += 1
        if (TYPE > 1) {
            TYPE = 0
        }
        
    }
    
    if (input.buttonIsPressed(Button.B)) {
        basic.clearScreen()
        pause(500)
        break
    }
    
}
set_lights(false, false, false)
//  Start processes (operate the lights).
if (MODE == 1) {
    control.inBackground(function master_controller() {
        /** Traffic light controller. */
        //  Change light status.
        while (true) {
            send_control(STOP_CONTROL_SIGNAL)
            go()
            control.waitMicros(INTERVAL_MS * MILLIS_TO_MICRO)
            send_control(GO_CONTROL_SIGNAL)
            stop()
            control.waitMicros(INTERVAL_MS * MILLIS_TO_MICRO)
        }
    })
} else {
    radio.onReceivedNumber(function on_received_number(receivedNumber: number) {
        /** Sets light based on control signal. */
        //  Matching types have same control.
        if (receivedNumber == STOP_CONTROL_SIGNAL) {
            if (TYPE == 0) {
                go()
            } else if (TYPE == 1) {
                stop()
                control.waitMicros(SAFETY_DELAY_MS * MILLIS_TO_MICRO)
            } else {
                error()
            }
            
        } else if (receivedNumber == GO_CONTROL_SIGNAL) {
            if (TYPE == 0) {
                stop()
            } else if (TYPE == 1) {
                go()
                control.waitMicros(SAFETY_DELAY_MS * MILLIS_TO_MICRO)
            } else {
                error()
            }
            
        } else {
            error()
        }
        
    })
}

