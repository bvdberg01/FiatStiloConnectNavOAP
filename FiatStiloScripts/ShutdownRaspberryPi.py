#!/usr/bin/env python

import RPi.GPIO as GPIO
import os
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)

start_time = 0

def shutdown(channel):
    global start_time
    start_time = time.time()

def check_shutdown():
    global start_time
    print(GPIO.input(24))
    if (GPIO.input(24) == 1) and (time.time() - start_time >= 5):
        print("Shutdown")
	os.system("sudo shutdown -h now");

GPIO.add_event_detect(24, GPIO.RISING, callback=shutdown, bouncetime=200)

while True:
    check_shutdown()
    time.sleep(1)

