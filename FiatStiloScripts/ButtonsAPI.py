import threading
import common.Api_pb2 as oap_api
from common.Client import Client, ClientEventHandler
from RPi import GPIO
import time
import os

L1 = 5
L2 = 6
L3 = 13
L4 = 19
L5 = 26

C1 = 7
C2 = 1
C3 = 12
C4 = 16
C5 = 20
C6 = 21

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO.setup(L1, GPIO.OUT)
GPIO.setup(L2, GPIO.OUT)
GPIO.setup(L3, GPIO.OUT)
GPIO.setup(L4, GPIO.OUT)
GPIO.setup(L5, GPIO.OUT)

GPIO.setup(C1, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(C2, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(C3, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(C4, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(C5, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(C6, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

#ON&SOS button
GPIO.setup(4, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)


def readLine(line, characters, client):
    key_type = None
    GPIO.output(line, GPIO.HIGH)
    if GPIO.input(4) == GPIO.LOW:
        os.system('xset -display :0 dpms force off')

    if GPIO.input(17) == GPIO.LOW:
        print("SOS")

    if(GPIO.input(C1) == 1):
        if(characters[0] == "4"):
            print("4")
            
        if(characters[0] == "back"):
            key_type = oap_api.KeyEvent.KEY_TYPE_PREVIOUS_TRACK
            print("back")

        if(characters[0] == "13"):
            print("13")
        
        if(characters[0] == "CONNECT"):
            print("CONNECT")
        
        if(characters[0] == "10"):
            print("10")
        
    if(GPIO.input(C2) == 1):
        if(characters[1] == "2"):
            print("2")

        if(characters[1] == "AUDIO"):
            print("AUDIO")

        if(characters[1] == "SRC"):
            key_type = oap_api.KeyEvent.KEY_TYPE_MEDIA_MENU

        if(characters[1] == "NAV"):
            key_type = oap_api.KeyEvent.KEY_TYPE_NAVIGATION_MENU

        if(characters[1] == "8"):
            print("8")

    if(GPIO.input(C3) == 1):
        if(characters[2] == "5"):
            print("5")

        if(characters[2] == "pause/play"):
            key_type = oap_api.KeyEvent.KEY_TYPE_TOGGLE_PLAY
            print("play")

        if(characters[2] == "call"):
            key_type = oap_api.KeyEvent.KEY_TYPE_ANSWER_CALL

        if(characters[2] == "Esc"):
            key_type = oap_api.KeyEvent.KEY_TYPE_BACK

        if(characters[2] == "11"):
            print("11")

    if(GPIO.input(C4) == 1):
        if(characters[3] == "3"):
            print("3")

        if(characters[3] == "TRIP"):
            print("TRIP")

        if(characters[3] == "MIC"):
            key_type = oap_api.KeyEvent.KEY_TYPE_VOICE_COMMAND

        if(characters[3] == "MAP"):
            print("MAP")

        if(characters[3] == "9"):
            print("9")

    if(GPIO.input(C5) == 1):
        if(characters[4] == "6"):
            print("6")

        if(characters[4] == "foward"):
            key_type = oap_api.KeyEvent.KEY_TYPE_NEXT_TRACK
            print("foward")

        if(characters[4] == "TEL"):
            key_type = oap_api.KeyEvent.KEY_TYPE_PHONE_MENU

        if(characters[4] == "Enter"):
            key_type = oap_api.KeyEvent.KEY_TYPE_ENTER
        if(characters[4] == "12"):
            print("12")

    if(GPIO.input(C6) == 1):
        if(characters[5] == "1"):
            print("1")

        if(characters[5] == "MAIN"):
            key_type = oap_api.KeyEvent.KEY_TYPE_HOME

        if(characters[5] == "SETUP"):
            print("SETUP")

        if(characters[5] == "RPT"):
            print("RPT")

        if(characters[5] == "7"):
            print("7")

    GPIO.output(line, GPIO.LOW)
    if key_type is not None:
        key_event = oap_api.KeyEvent()
        key_event.key_type = key_type

        key_event.event_type = oap_api.KeyEvent.EVENT_TYPE_PRESS
        client.send(oap_api.MESSAGE_KEY_EVENT, 0,
                    key_event.SerializeToString())

        key_event.event_type = oap_api.KeyEvent.EVENT_TYPE_RELEASE
        client.send(oap_api.MESSAGE_KEY_EVENT, 0,
                    key_event.SerializeToString())
                            
def listen_for_key_events(client):
    
    while True:
        readLine(L1, ["4","2","5","3","6","1"], client)
        readLine(L2, ["back","AUDIO","pause/play","TRIP","foward","MAIN"], client)
        readLine(L3, ["13","SRC","call","MIC","TEL","SETUP"], client)
        readLine(L4, ["CONNECT","NAV","Esc","MAP","Enter","RPT"], client)
        readLine(L5, ["10","8","11","9","12","7"], client)
        time.sleep(0.1)
		
class EventHandler(ClientEventHandler):

    def on_hello_response(self, client, message):
        print(
            "received hello response, result: {}, oap version: {}.{}, api version: {}.{}"
            .format(message.result, message.oap_version.major,
                    message.oap_version.minor, message.api_version.major,
                    message.api_version.minor))

        threading.Thread(target=listen_for_key_events, args=(client, )).start()



def main():
    client = Client("media data example")
    event_handler = EventHandler()
    client.set_event_handler(event_handler)
    client.connect('127.0.0.1', 44405)

    active = True
    while active:
        try:
            active = client.wait_for_message()
        except KeyboardInterrupt:
            break

    client.disconnect()


if __name__ == "__main__":
    main()

