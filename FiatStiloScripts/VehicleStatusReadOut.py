import os
import can
import sys
import random
import threading
import common.Api_pb2 as oap_api
from common.Client import Client, ClientEventHandler

bus = can.Bus(interface='socketcan',
              channel='can0',
              receive_own_messages=True)

bus.set_filters([{"can_id": 0x388, "can_mask": 0xFFF, "extended": False}, {"can_id": 0x180, "can_mask": 0xFFF, "extended": False},{"can_id": 0x380, "can_mask": 0xFFF, "extended": False},])

def listen_for_events(client):
    for msg in bus:

        #Temperature from can
        if(msg.arbitration_id == 0x388):
            inject_temperature_sensor_value = oap_api.InjectTemperatureSensorValue()
            inject_temperature_sensor_value.value = int(((msg.data[0]*0.5)-40))
            client.send(oap_api.MESSAGE_INJECT_TEMPERATURE_SENSOR_VALUE, 0, inject_temperature_sensor_value.SerializeToString())

        if(msg.arbitration_id == 0x380):

            #Reverse status
            if((msg.data[1] & 0b00000001) == 1):
                _reverse_gear_engaged = True
            if((msg.data[1] & 0b00000001) == 0):
                _reverse_gear_engaged = False
                        #Reverse status
            set_reverse_gear_status = oap_api.SetReverseGearStatus()
            set_reverse_gear_status.engaged = _reverse_gear_engaged
            client.send(oap_api.MESSAGE_SET_REVERSE_GEAR_STATUS, 0, set_reverse_gear_status.SerializeToString())

        #screen dimming & reverse status
        if(msg.arbitration_id == 0x180):
            
            #screen dimming
            if((msg.data[1] & 0b00001000) == 8):
                brightness = 2
            if((msg.data[1] & 0b00001000) == 0):
                brightness = 100

            #screen dimming    
            buffer = b'\x04\xAA\x01\x00\x00\x00'+bytes([brightness])
            with open('/dev/hidraw0','wb') as hid:
                hid.write(buffer)



class EventHandler(ClientEventHandler):

    def on_hello_response(self, client, message):
        print(
            "received hello response, result: {}, oap version: {}.{}, api version: {}.{}"
            .format(message.result, message.oap_version.major,
                    message.oap_version.minor, message.api_version.major,
                    message.api_version.minor))

        threading.Thread(target=listen_for_events, args=(client, )).start()


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


