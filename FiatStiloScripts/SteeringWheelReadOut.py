import can
import threading
import common.Api_pb2 as oap_api
from common.Client import Client, ClientEventHandler

bus = can.Bus(interface='socketcan',
              channel='can0',
              receive_own_messages=True)

bus.set_filters([{"can_id": 0x3C4, "can_mask": 0xFFF, "extended": False}])

def listen_for_key_events(client):
    for msg in bus:
        key_type = None
        if msg.data[0] == 2 and msg.data[1] > 0:

            # menu down
            if msg.data[1] == 1:
                key_type = oap_api.KeyEvent.KEY_TYPE_SCROLL_LEFT
            # menu up
            if msg.data[1] == 2:
                key_type = oap_api.KeyEvent.KEY_TYPE_SCROLL_RIGHT
            # menu enter
            if msg.data[1] == 4:
                key_type = oap_api.KeyEvent.KEY_TYPE_ENTER
            # menu
            if msg.data[1] == 8:
                key_type = oap_api.KeyEvent.KEY_TYPE_HOME
            # mic
            if msg.data[1] == 64:
                key_type = oap_api.KeyEvent.KEY_TYPE_VOICE_COMMAND
            # tel
            if msg.data[1] == 128:
                key_type = oap_api.KeyEvent.KEY_TYPE_PHONE_MENU

        if msg.data[0] > 2 and msg.data[1] == 0:

            # src
            if msg.data[0] == 6:
                key_type = oap_api.KeyEvent.KEY_TYPE_MEDIA_MENU

            # back music
            if msg.data[0] == 10:
                key_type = oap_api.KeyEvent.KEY_TYPE_PREVIOUS_TRACK

            # forward music
            if msg.data[0] == 18:
                key_type = oap_api.KeyEvent.KEY_TYPE_NEXT_TRACK


            # volume down
            if msg.data[0] == 66:
                key_type = oap_api.KeyEvent.KEY_TYPE_VOLUME_DOWN


            # volume up
            if msg.data[0] == 130:
                key_type = oap_api.KeyEvent.KEY_TYPE_VOLUME_UP


        if key_type is not None:
            key_event = oap_api.KeyEvent()
            key_event.key_type = key_type

            key_event.event_type = oap_api.KeyEvent.EVENT_TYPE_PRESS
            client.send(oap_api.MESSAGE_KEY_EVENT, 0,
                        key_event.SerializeToString())

            key_event.event_type = oap_api.KeyEvent.EVENT_TYPE_RELEASE
            client.send(oap_api.MESSAGE_KEY_EVENT, 0,
                        key_event.SerializeToString())

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

