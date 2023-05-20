var can = require("socketcan");
var moment = require("moment");
var channel = can.createRawChannel('can0', true);

var express = require('express')
var app = express();
var server = require('http').createServer(app);
var socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: '*',
    },
});


app.use(express.static(__dirname));


function onoff(value) {
    if (value == 0) {
        return "off"
    } else {
        return "on"
    }
};

dec2bcd = dec => parseInt(dec.toString(10), 16);
bcd2dec = bcd => parseInt(bcd.toString(16), 10);

var BuzzerVolumeWarningIds = {
    0: 0,
    32: 1,
    64: 2,
    96: 3,
    128: 4,
    160: 5,
    192: 6,
    224: 7,
};

var BuzzerVolumeButtonIds = {
    0: 0,
    4: 1,
    8: 2,
    12: 3,
    16: 4,
    20: 5,
    24: 6,
    28: 7,
};

var HourModeIds = {
    0: "0–24h",
    2: "0–12h ",
};

function SpeedThresholdfunc(value) {
    return value * 5
};


var map = {
    DistanceUnit: 0,
    TemperatureUnit: 0,
    LanguageSelection: null,
    ConsumptionUnit: 0,
    BuzzerVolumeWarning: 0,
    BuzzerVolumeButton: 0,
    HourMode: 0,
    SpeedThreshold: 0,
    RadioRepetition: 0,
    NavigationRepetition: 0,
    PhoneRepetition: 0,
    SpeedLockDoorEnable: 0,
    DriverDoorUnlockEnable: 0,
    TrunkUnlockEnable: 0,
    RainSensorLevel: 0,
    NITSetupACKCntrl: 0,
    RIP_B_Enable: 0,
    ExternalLightSensorLevel: 0,
    SpeedThresholdEnable: 0
}

var TripAMap = {
    IstantaneousFuelConsumption1: 0,
    IstantaneousFuelConsumption2: 0,
    IstantaneousFuelConsumption3: 0,
    AverageFuelConsumption1: 0,
    AverageFuelConsumption2: 0,
    AverageFuelConsumption3: 0,
    AutonomyDistance: 0,
    AverageSpeed_1: 0,
    TravelingTime1_Hour1: 0,
    TravelingTime1_Hour2: 0,
    TravelingTime1_Minute1: 0,
    TravelingTime1_Minute2: 0,
    PartialOdometer_1: 0
}

var TripBMap = {
    TravelingTime2_Hour1: 0,
    TravelingTime2_Hour2: 0,
    TravelingTime2_Minute1: 0,
    TravelingTime2_Minute2: 0,
    PartialOdometer_2: 0,
    AverageSpeed_2: 0,
    AutonomyDistance: 0,
    IstantaneousFuelConsumption1: 0,
    IstantaneousFuelConsumption2: 0,
    IstantaneousFuelConsumption3: 0,
    AverageFuelConsumption1: 0,
    AverageFuelConsumption2: 0,
    AverageFuelConsumption3: 0,
    AutonomyDistance: 0
}

channel.addListener("onMessage", function (msg) {

    if (msg.id == 0x6E3) {
        var databit4 = msg.data.readUIntBE(4, 1)
        var databit3 = msg.data.readUIntBE(3, 1)
        var databit2 = msg.data.readUIntBE(2, 1)
        var databit1 = msg.data.readUIntBE(1, 1)
        var databit0 = msg.data.readUIntBE(0, 1)

        map.DistanceUnit = databit0 & 0b10000000;
        map.TemperatureUnit = databit0 & 0b01000000;
        map.LanguageSelection = databit0 & 0b00111000;
        map.ConsumptionUnit = databit0 & 0b00000111;

        map.BuzzerVolumeWarning = databit1 & 0b11100000;
        map.BuzzerVolumeButton = databit1 & 0b00011100;
        map.HourMode = databit1 & 0b00000010;

        map.SpeedThreshold = SpeedThresholdfunc(databit2 & 0b00111111);

        map.RadioRepetition = databit3 & 0b10000000;
        map.NavigationRepetition = databit3 & 0b01000000;
        map.PhoneRepetition = databit3 & 0b00100000;
        map.SpeedLockDoorEnable = databit3 & 0b00010000;
        map.DriverDoorUnlockEnable = databit3 & 0b00001000;
        map.TrunkUnlockEnable = databit3 & 0b00000100;

        map.RainSensorLevel = databit4 & 0b11000000;
        map.NITSetupACKCntrl = databit4 & 0b00110000;
        map.TRIP_B_Enable = databit4 & 0b00001000;
        map.ExternalLightSensorLevel = databit4 & 0b00000110;
        map.SpeedThresholdEnable = databit4 & 0b00000001;

        io.emit('settings', map)
    }

    if (msg.id == 0x6C3) {

        var databit7 = msg.data.readUIntBE(7, 1)
        var databit6 = msg.data.readUIntBE(6, 1)
        var databit5 = msg.data.readUIntBE(5, 1)
        var databit3_4 = msg.data.readUIntBE(3, 2)
        var databit3 = msg.data.readUIntBE(3, 1)
        var databit2 = msg.data.readUIntBE(2, 1)
        var databit1 = msg.data.readUIntBE(1, 1)
        var databit0 = msg.data.readUIntBE(0, 1)

        TripAMap.IstantaneousFuelConsumption1 = bcd2dec(databit0 & 0b11110000) / 10;
        TripAMap.IstantaneousFuelConsumption2 = bcd2dec(databit0 & 0b00001111);
        TripBMap.IstantaneousFuelConsumption1 = bcd2dec(databit0 & 0b11110000) / 10;
        TripBMap.IstantaneousFuelConsumption2 = bcd2dec(databit0 & 0b00001111);

        TripAMap.IstantaneousFuelConsumption3 = bcd2dec(databit1 & 0b11110000) / 10;
        TripBMap.IstantaneousFuelConsumption3 = bcd2dec(databit1 & 0b11110000) / 10;
        TripAMap.AverageFuelConsumption1 = bcd2dec(databit1 & 0b00001111);

        TripAMap.AverageFuelConsumption2 = bcd2dec(databit2 & 0b11110000) / 10;
        TripAMap.AverageFuelConsumption3 = bcd2dec(databit2 & 0b00001111);

        TripAMap.AutonomyDistance = databit3_4 & 0b0000011111111111;
        TripBMap.AutonomyDistance = databit3_4 & 0b0000011111111111;

        TripAMap.AverageSpeed_1 = databit5 & 0b11111111

        TripAMap.TravelingTime1_Hour1 = bcd2dec(databit6 & 0b11110000) / 10;
        TripAMap.TravelingTime1_Hour2 = bcd2dec(databit6 & 0b00001111);
        TripAMap.TravelingTime1_Minute1 = bcd2dec(databit7 & 0b11110000) / 10;
        TripAMap.TravelingTime1_Minute2 = bcd2dec(databit7 & 0b00001111);

        io.emit('tripa', TripAMap)
        io.emit('tripb', TripBMap)
    }

    if (msg.id == 0x6A3) {

        var databit6 = msg.data.readUIntBE(6, 1)
        var databit4_5 = msg.data.readUIntBE(4, 2)
        var databit2_3 = msg.data.readUIntBE(2, 2)
        var databit1 = msg.data.readUIntBE(1, 1)
        var databit0 = msg.data.readUIntBE(0, 1)

        TripBMap.TravelingTime2_Hour1 = bcd2dec(databit0 & 0b11110000) / 10;
        TripBMap.TravelingTime2_Hour2 = bcd2dec(databit0 & 0b00001111);

        TripBMap.TravelingTime2_Minute1 = bcd2dec(databit1 & 0b11110000) / 10;
        TripBMap.TravelingTime2_Minute2 = bcd2dec(databit1 & 0b00001111);

        TripBMap.PartialOdometer_2 = (databit2_3 & 0b1111111111111111) / 10;

        TripAMap.PartialOdometer_1 = (databit4_5 & 0b1111111111111111) / 10;

        TripBMap.AverageSpeed_2 = databit6 & 0b11111111;

        io.emit('tripa', TripAMap)
        io.emit('tripb', TripBMap)
    }

    if (msg.id == 0x6D3) {
        var databit7 = msg.data.readUIntBE(7, 1)
        var databit6 = msg.data.readUIntBE(6, 1)

        TripBMap.AverageFuelConsumption1 = databit6 & 0b00001111;
        TripBMap.AverageFuelConsumption2 = databit7 & 0b11110000 / 10;
        TripBMap.AverageFuelConsumption3 = databit7 & 0b00001111;

        io.emit('tripb', TripBMap)
    }


})

var msg2 = {
    'id': 0x6E7,
    data: [0, 0, 0, 0, 0]
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

io.on('connection', function (socket) {
    console.log("client connected");

    socket.on("message", (msg) => {
        var sumbyte1 = 0;
        var sumbyte2 = 0;
        var sumbyte3 = 0;
        var sumbyte4 = 0;
        var sumbyte5 = 0;

        sumbyte1 += msg.DistanceUnit + msg.TemperatureUnit + msg.LanguageSelection + msg.ConsumptionUnit;

        sumbyte2 += msg.BuzzerVolumeWarning + msg.BuzzerVolumeButton + msg.HourMode;

        sumbyte3 += msg.SpeedThreshold / 5;

        sumbyte4 += msg.RadioRepetition + msg.NavigationRepetition + msg.PhoneRepetition + msg.SpeedLockDoorEnable + msg.DriverDoorUnlockEnable + msg.TrunkUnlockEnable;

        sumbyte5 += msg.ResetTripA + msg.ResetTripB + msg.TRIP_B_Enable + msg.SpeedThresholdEnable + msg.ExternalLightSensorLevel

        msg2.data[0] = sumbyte1
        msg2.data[1] = sumbyte2
        msg2.data[2] = sumbyte3
        msg2.data[3] = sumbyte4
        msg2.data[4] = sumbyte5

        var out = {}


        out.id = msg2.id
        out.data = Buffer.from(msg2.data)
        channel.send(out)
    });

    var msg3 = {
        'id': 0x6D7,
        data: [0, 0, 0, 0, 0, 0]
    }

    socket.on("datetime", (msg) => {
        var out = {};
        var date = new Date(msg);
        var h = pad(date.getHours()).toString();
        var min = pad(date.getMinutes()).toString();
        var d = pad(date.getDate()).toString();
        var m = pad(date.getMonth() + 1).toString();
        var y1 = date.getFullYear().toString().slice(0, 2);
        var y2 = date.getFullYear().toString().substring(2);


        msg3.data[0] = dec2bcd(h);
        msg3.data[1] = dec2bcd(min);
        msg3.data[2] = dec2bcd(d);
        msg3.data[3] = dec2bcd(m);
        msg3.data[4] = dec2bcd(y1);
        msg3.data[5] = dec2bcd(y2);

        out.id = msg3.id;
        out.data = Buffer.from(msg3.data)
        channel.send(out)
    });

    socket.on("disconnect", () => {
        console.log("client disconnected");
    });
});


function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

channel.start()

server.listen(3005)
