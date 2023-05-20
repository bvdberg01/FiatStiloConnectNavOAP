import threading
import common.Api_pb2 as oap_api
from common.Client import Client, ClientEventHandler
from RPi import GPIO
from time import sleep



def listen_for_key_events(client):
    try:
        Lclk = 3
        Ldt = 2
        Rclk = 14
        Rdt = 15
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(Lclk, GPIO.IN)
        GPIO.setup(Ldt, GPIO.IN)
        GPIO.setup(Rclk, GPIO.IN)
        GPIO.setup(Rdt, GPIO.IN)
        LclkLastState = GPIO.input(Lclk)
        RclkLastState = GPIO.input(Rclk)
        while True:
            key_type = None

            LLclkState = GPIO.input(Lclk)
            LLdtState = GPIO.input(Ldt)
            if LLclkState != LclkLastState:
                if LLdtState != LLclkState:
                    key_type = oap_api.KeyEvent.KEY_TYPE_VOLUME_DOWN
                else:
                    key_type = oap_api.KeyEvent.KEY_TYPE_VOLUME_UP
            LclkLastState = LLclkState
            
            RclkState = GPIO.input(Rclk)
            RdtState = GPIO.input(Rdt)
            
            if RclkState != RclkLastState:
                if RdtState != RclkState:
                    key_type = oap_api.KeyEvent.KEY_TYPE_SCROLL_LEFT
                else:
                    key_type = oap_api.KeyEvent.KEY_TYPE_SCROLL_RIGHT
            RclkLastState = RclkState
            sleep(0.01)

            if key_type is not None:
                key_event = oap_api.KeyEvent()
                key_event.key_type = key_type

                key_event.event_type = oap_api.KeyEvent.EVENT_TYPE_PRESS
                client.send(oap_api.MESSAGE_KEY_EVENT, 0,
                            key_event.SerializeToString())

                key_event.event_type = oap_api.KeyEvent.EVENT_TYPE_RELEASE
                client.send(oap_api.MESSAGE_KEY_EVENT, 0,
                            key_event.SerializeToString())
    finally:
        GPIO.cleanup()

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

