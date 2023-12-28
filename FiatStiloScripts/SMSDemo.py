import can
import struct
import time

bus = can.interface.Bus(channel='can0', bustype='socketcan')
msg = can.Message(arbitration_id=0x5C7, data=[0, 0, 0, 0, 0, 0, 0, 0], is_extended_id=False)

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
    "char1": dictionary["8"],
    "char2": dictionary["0"],
    "char3": dictionary["0"],
    "char4": dictionary["R"],
    "char5": dictionary["P"],
    "char6": dictionary["M"],
    "char7": dictionary["1"],
    "char8": dictionary["4"],
    "char9": dictionary["V"],
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

    "SMSSts": 1,
    "RingOnSts": 0,
    "PhoneCharacterValidData": 0,
    "SMSReceivedCntrl": 1,
    "PhoneCallSts": 0,
    "PhoneSearchSts": 0
}
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

        time.sleep(0.02)
        counter += 1

while True:
    create_message(0)
    time.sleep(1)