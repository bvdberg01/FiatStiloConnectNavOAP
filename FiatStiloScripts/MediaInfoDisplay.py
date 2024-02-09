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


RadioData = {
    "AudioSource": 0,
    "Band": 0,
    "TapeSide": 0,
    "FreqInfoEnable": 0,
    "FrequencyMSB": "00",
    "FrequencyLSB": "00",
    "TrackNumber": 0,
    "DiscNumber": 0,
    "RadioDisplayInfoValidData": 0,
    "TapeCDCommand": 0,
    "RadioSts": 0
}

RdsData = {
    "Character1": 0,
    "Character2": 0,
    "Character3": 0,
    "Character4": 0,
    "Character5": 0,
    "Character6": 0,
    "Character7": 0,
    "Character8": 0,
    "RDSInfoValidData ": 0
}

def frequentie_naar_hex(frequentie):
    # Converteer de frequentie naar kHz
    frequentie_khz = frequentie * 10

    # Converteer de frequentie naar een hexadecimale string
    hexadecimale_frequentie = hex(int(frequentie_khz))[2:]

    # Zorg ervoor dat de hexadecimale string twee tekens heeft (bijvoorbeeld '04' in plaats van '4')
    if len(hexadecimale_frequentie) % 2 != 0:
        hexadecimale_frequentie = '0' + hexadecimale_frequentie

    # Verdeel de hexadecimale string in twee delen van twee tekens elk
    RadioData["FrequencyMSB"] = hexadecimale_frequentie[:2]
    RadioData["FrequencyLSB"] = hexadecimale_frequentie[2:]

def format_freq(frequentie):
    parts = frequentie.split()
    numeric_part = parts[0]
    return float(numeric_part)

class EventHandler(ClientEventHandler):
    def on_hello_response(self, client, message):
        print(
            "received hello response, result: {}, oap version: {}.{}, api version: {}.{}"
            .format(message.result, message.oap_version.major,
                    message.oap_version.minor, message.api_version.major,
                    message.api_version.minor))

        set_status_subscriptions = oap_api.SetStatusSubscriptions()
        set_status_subscriptions.subscriptions.append(
            oap_api.SetStatusSubscriptions.Subscription.MEDIA)
        client.send(oap_api.MESSAGE_SET_STATUS_SUBSCRIPTIONS, 0,
                    set_status_subscriptions.SerializeToString())

    def on_media_status(self, client, message):
        # message.is_playing, message.position_label, message.source
        print(message.source)
        if message.source == 5:
            RadioData["AudioSource"] = 2
        else:
            RadioData["AudioSource"] = 7

        if message.is_playing == True:
            RadioData["RadioDisplayInfoValidData"] = 0
        else:
            RadioData["RadioDisplayInfoValidData"] = 1
        

    def on_media_metadata(self, client, message):
        if RadioData["AudioSource"] == 2 and message.title.find("MHz") != -1:
            test = format_freq(message.title)
            # print(test)
            frequentie_naar_hex(test)
        # message.artist, message.title, message.album,message.duration_label



def run_can_communication():
    bus = can.interface.Bus(channel='can0', bustype='socketcan')
    msg = can.Message(arbitration_id=0x545, data=[0, 0, 0, 0, 0, 0], is_extended_id=False)

    def create_message():
        bytes = 0b000000000000000000000000000000000000000000000000

        msb = int(RadioData["FrequencyMSB"], 16)
        lsb = int(RadioData["FrequencyLSB"], 16)

        # print(RadioData["AudioSource"])
        bytes |= (RadioData["AudioSource"] & 0b111) << 45
        bytes |= (RadioData["Band"] & 0b111) << 42
        bytes |= (RadioData["TapeSide"] & 0b1) << 41
        bytes |= (RadioData["FreqInfoEnable"] & 0b1) << 40
        bytes |= (msb & 0b11111111) << 32
        bytes |= (lsb & 0b11111111) << 24
        bytes |= (RadioData["TrackNumber"] & 0b11111111) << 16
        bytes |= (RadioData["DiscNumber"] & 0b1111) << 12
        bytes |= (RadioData["RadioDisplayInfoValidData"] & 0b1) << 11
        bytes |= (RadioData["TapeCDCommand"] & 0b11) << 9
        bytes |= (RadioData["RadioSts"] & 0b1) << 8

        buff = bytes.to_bytes(6, 'big')
        out = can.Message(arbitration_id=msg.arbitration_id, data=buff, is_extended_id=False)
        # print(out)
        bus.send(out)    

    while True:
        if RadioData["AudioSource"] == 2:
            create_message()
            time.sleep(0.5)


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
