import can
import threading
import time
import common.Api_pb2 as oap_api
from common.Client import Client, ClientEventHandler

dictionary = {
    "0": 0b000001,
    "1": 0b000010,
    "2": 0b000011,
    "3": 0b000100,
    "4": 0b000101,
    "5": 0b000110,
    "6": 0b000111,
    "7": 0b001000,
    "8": 0b001001,
    "9": 0b001010,
    ".": 0b001011,
    "A": 0b001100,
    "B": 0b001101,
    "C": 0b001110,
    "D": 0b001111,
    "E": 0b010000,
    "F": 0b010001,
    "G": 0b010010,
    "H": 0b010011,
    "I": 0b010100,
    "J": 0b010101,
    "K": 0b010110,
    "L": 0b010111,
    "M": 0b011000,
    "N": 0b011001,
    "O": 0b011010,
    "P": 0b011011,
    "Q": 0b011100,
    "R": 0b011101,
    "S": 0b011110,
    "T": 0b011111,
    "U": 0b100000,
    "V": 0b100001,
    "W": 0b100010,
    "X": 0b100011,
    "Y": 0b100100,
    "Z": 0b100101,
    "ñ": 0b100110,
    "ç": 0b100111,
    " ": 0b101000,
    "Ğ": 0b101001,
    "i": 0b101010,
    "j": 0b101011,
    "§": 0b101100,
    "À": 0b101101,
    "Ä": 0b101110,
    "ŭ": 0b101111,
    "Ü": 0b110000,
    "_": 0b110010,
    "?": 0b110101,
    "°": 0b110110,
    "!": 0b110111,
    "+": 0b111000,
    "-": 0b111001,
    ":": 0b111010,
    "/": 0b111011,
    "#": 0b111100,
    "*": 0b111101,
    "\r": 0b000000,
    "\n": 0b111111
}


data = {
    "TotalFrameNumber": 2,
    "FrameNumber": 0,

    #FRAME1
    "char1": dictionary["\r"],
    "char2": dictionary["\r"],
    "char3": dictionary["\r"],
    "char4": dictionary["\r"],
    "char5": dictionary["\r"],
    "char6": dictionary["\r"],
    "char7": dictionary["\r"],
    "char8": dictionary["\r"],
    "char9": dictionary["\r"],
    #FRAME2
    "char10": dictionary["\r"],
    "char11": dictionary["\r"],
    "char12": dictionary["\r"],
    "char13": dictionary["\r"],
    "char14": dictionary["\r"],
    "char15": dictionary["\r"],
    "char16": dictionary["\r"],
    "char17": dictionary["\r"],
    "char18": dictionary["\r"],
    #FRAME3 
    "char19": dictionary["\r"],
    "char20": dictionary["\r"],
    "char21": dictionary["\r"],
    "char22": dictionary["\r"],
    "char23": dictionary["\r"],
    "char24": dictionary["\r"],
    "char25": dictionary["\r"],
    "char26": dictionary["\r"],
    "char27": dictionary["\r"],
    "char28": dictionary["\r"],

    "SMSSts": 0,
    "RingOnSts": 0,
    "PhoneCharacterValidData": 1,
    "SMSReceivedCntrl": 0,
    "PhoneCallSts": 0,
    "PhoneSearchSts": 0
}

def splitnameorphone(input):
    for i in range(0, len(input)):
        char_variable = "char" + str(i+1)
        
        if i <= len(input):
            char_value = dictionary[input[i].upper()]
        
        data[char_variable] = char_value

class EventHandler(ClientEventHandler):
    def on_hello_response(self, client, message):
        print(
            "received hello response, result: {}, oap version: {}.{}, api version: {}.{}"
            .format(message.result, message.oap_version.major,
                    message.oap_version.minor, message.api_version.major,
                    message.api_version.minor))

        set_status_subscriptions = oap_api.SetStatusSubscriptions()
        set_status_subscriptions.subscriptions.append(
            oap_api.SetStatusSubscriptions.Subscription.PHONE)
        client.send(oap_api.MESSAGE_SET_STATUS_SUBSCRIPTIONS, 0,
                    set_status_subscriptions.SerializeToString())

    def on_phone_voice_call_status(self, client, message):
        if(message.state == 0):
            data["RingOnSts"] = 0
            data["PhoneCallSts"] = 0
            for i in range(0, 29):
                char_variable = "char" + str(i)
                char_value = dictionary["\r"]
                data[char_variable] = char_value

            data["PhoneCharacterValidData"] = 1


        if(message.state == 1):
            if(message.caller_name == "(Unknown Caller)"):
                splitnameorphone(message.caller_id)
            else:
                splitnameorphone(message.caller_name)
            data["RingOnSts"] = 1
            data["PhoneCharacterValidData"] = 0

        if(message.state == 2):
            if(message.caller_name == "(Unknown Caller)"):
                splitnameorphone(message.caller_id)
            else:
                splitnameorphone(message.caller_name)

            data["PhoneCallSts"] = 1
            data["PhoneCharacterValidData"] = 0



def run_can_communication():
    bus = can.interface.Bus(channel='can0', bustype='socketcan')
    msg = can.Message(arbitration_id=0x5C7, data=[0, 0, 0, 0, 0, 0, 0, 0], is_extended_id=False)

    def create_message(counter):
        while counter <= 2:
            bytes = 0b0000000000000000000000000000000000000000000000000000000000000000
            data["FrameNumber"] = counter

            bytes |= (data["TotalFrameNumber"] & 0b11) << 62
            bytes |= (data["FrameNumber"] & 0b11) << 60
            if(counter == 0):
                bytes |= (data["char1"] & 0b111111) << 54
                bytes |= (data["char2"] & 0b111111) << 48
                bytes |= (data["char3"] & 0b111111) << 42
                bytes |= (data["char4"] & 0b111111) << 36
                bytes |= (data["char5"] & 0b111111) << 30
                bytes |= (data["char6"] & 0b111111) << 24
                bytes |= (data["char7"] & 0b111111) << 18
                bytes |= (data["char8"] & 0b111111) << 12
                bytes |= (data["char9"] & 0b111111) << 6
            if(counter == 1):
                bytes |= (data["char10"] & 0b111111) << 54
                bytes |= (data["char11"] & 0b111111) << 48
                bytes |= (data["char12"] & 0b111111) << 42
                bytes |= (data["char13"] & 0b111111) << 36
                bytes |= (data["char14"] & 0b111111) << 30
                bytes |= (data["char15"] & 0b111111) << 24
                bytes |= (data["char16"] & 0b111111) << 18
                bytes |= (data["char17"] & 0b111111) << 12
                bytes |= (data["char18"] & 0b111111) << 6
            if(counter == 2):
                bytes |= (data["char19"] & 0b111111) << 54
                bytes |= (data["char21"] & 0b111111) << 48
                bytes |= (data["char22"] & 0b111111) << 42
                bytes |= (data["char23"] & 0b111111) << 36
                bytes |= (data["char24"] & 0b111111) << 30
                bytes |= (data["char25"] & 0b111111) << 24
                bytes |= (data["char26"] & 0b111111) << 18
                bytes |= (data["char27"] & 0b111111) << 12
                bytes |= (data["char28"] & 0b111111) << 6
            bytes |= (data["SMSSts"] & 0b1) << 5
            bytes |= (data["RingOnSts"] & 0b1) << 4
            bytes |= (data["PhoneCharacterValidData"] & 0b1) << 3
            bytes |= (data["SMSReceivedCntrl"] & 0b1) << 2
            bytes |= (data["PhoneCallSts"] & 0b1) << 1
            bytes |= (data["PhoneSearchSts"] & 0b1) << 0

            buff = bytes.to_bytes(8, 'big')
            out = can.Message(arbitration_id=msg.arbitration_id, data=buff, is_extended_id=False)
            bus.send(out)

            counter += 1

            time.sleep(0.02)

    while True:
        create_message(0)
        time.sleep(1)


def run_bluewave_client():
    client = Client("phone status example")
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
    can_thread = threading.Thread(target=run_can_communication)
    bluewave_thread = threading.Thread(target=run_bluewave_client)

    can_thread.start()
    bluewave_thread.start()

    can_thread.join()
    bluewave_thread.join()
