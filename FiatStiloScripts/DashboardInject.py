import can
import random
import threading
import time
import common.Api_pb2 as oap_api
from common.Client import Client, ClientEventHandler

injecting_active = True

bus = can.Bus(interface='socketcan',
              channel='can0',
              receive_own_messages=True)

bus.set_filters([{"can_id": 0x281, "can_mask": 0xFFF, "extended": False},{"can_id": 0x380, "can_mask": 0xFFF, "extended": False},{"can_id": 0x2a0, "can_mask": 0xFFF, "extended": False}])

def inject_obd_gauge_formula_value(client):
    obd_inject_gauge_formula_value = oap_api.ObdInjectGaugeFormulaValue()

    while injecting_active:
        for msg in bus:
            
            if(msg.arbitration_id == 0x281):

                #RPM
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(4)"
                    obd_inject_gauge_formula_value.value = (msg.data[6] & 0b11111111)*32
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

                #Water Temp
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(1)"
                    obd_inject_gauge_formula_value.value = (msg.data[3] & 0b11111111)-40
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

                #Fuel cons
                if(True):
                    byte1 = msg.data[4] 
                    byte2 = msg.data[5] 
                    val = (byte1 << 8) | byte2
                    obd_inject_gauge_formula_value.formula = "getPidValue(0)"
                    obd_inject_gauge_formula_value.value = (val & 0b1111111111111111)*0.0022
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

                #Oil pressure stat
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(3)"
                    if(msg.data[1] & 0b10000000 == 128):
                        val = 0
                    if(msg.data[1] & 0b10000000 == 0):
                        val = 1
                    obd_inject_gauge_formula_value.value = val
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

                #Cruise control light
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(7)"
                    if(msg.data[1] & 0b00000010 == 2):
                        val = 1
                    if(msg.data[1] & 0b00000010 == 0):
                        val = 0
                    obd_inject_gauge_formula_value.value = val
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

            if(msg.arbitration_id == 0x380):

                #Batt voltage
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(6)"
                    obd_inject_gauge_formula_value.value = (msg.data[3] & 0b01111111)*0.16
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

                #Fuel gauge
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(2)"
                    obd_inject_gauge_formula_value.value = (msg.data[5] & 0b01111111)
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())

            if(msg.arbitration_id == 0x2a0):
                
                #Speed
                if(True):
                    obd_inject_gauge_formula_value.formula = "getPidValue(5)"
                    byte1 = msg.data[0] 
                    byte2 = msg.data[1]
                    val = (byte1 << 8) | byte2
                    obd_inject_gauge_formula_value.value = (val & 0b0001111111111111)*0.1
                    client.send(oap_api.MESSAGE_OBD_INJECT_GAUGE_FORMULA_VALUE, 0, obd_inject_gauge_formula_value.SerializeToString())


class EventHandler(ClientEventHandler):

    def on_hello_response(self, client, message):
        print(
            "received hello response, result: {}, oap version: {}.{}, api version: {}.{}"
            .format(message.result, message.oap_version.major,
                    message.oap_version.minor, message.api_version.major,
                    message.api_version.minor))

        threading.Thread(target=inject_obd_gauge_formula_value,
                         args=(client, )).start()


def main():
    client = Client("obd inject example")
    event_handler = EventHandler()
    client.set_event_handler(event_handler)
    client.connect('127.0.0.1', 44405)

    active = True
    while active:
        try:
            active = client.wait_for_message()
        except KeyboardInterrupt:
            break

    global injecting_active
    injecting_active = False

    client.disconnect()


if __name__ == "__main__":
    main()
