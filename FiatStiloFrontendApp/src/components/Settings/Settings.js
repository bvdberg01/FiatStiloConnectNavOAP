import React, { useState, useEffect } from 'react';

// import styles from './Settings.module.css';
import styles from './Settings.module.css';

//Sockets
import io from 'socket.io-client';

// Frontend
import Switch from '@mui/material/Switch';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';

// import CustomSwitch from 'react-native-custom-switch';

import dayjs from 'dayjs';
import Button from '@mui/material/Button';

// Icons
import SpeedIcon from '@mui/icons-material/Speed';
import WavesIcon from '@mui/icons-material/Waves';
import LanguageIcon from '@mui/icons-material/Language';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import HttpsIcon from '@mui/icons-material/Https';
import SensorsIcon from '@mui/icons-material/Sensors';
import { color } from '@mui/system';

const socket = io('127.0.0.1:3005');

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
  SpeedThresholdEnable: 0,
  ResetTripA: 0,
  ResetTripB: 0,
  TRIP_B_Enable: 0
}

const Settings = () => {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  socket.on('connect', () => {
    setIsConnected(true);

  });

  socket.on('disconnect', () => {
    setIsConnected(false);
  });

  var loadinit = false;

  socket.on('settings', (client) => {

    map.DistanceUnit = client.DistanceUnit;
    map.TemperatureUnit = client.TemperatureUnit
    map.LanguageSelection = client.LanguageSelection
    map.ConsumptionUnit = client.ConsumptionUnit

    map.BuzzerVolumeWarning = client.BuzzerVolumeWarning
    map.BuzzerVolumeButton = client.BuzzerVolumeButton
    map.HourMode = client.HourMode

    map.SpeedThreshold = client.SpeedThreshold;

    map.RadioRepetition = client.RadioRepetition;
    map.NavigationRepetition = client.NavigationRepetition
    map.PhoneRepetition = client.PhoneRepetition
    map.SpeedLockDoorEnable = client.SpeedLockDoorEnable
    map.DriverDoorUnlockEnable = client.DriverDoorUnlockEnable
    map.TrunkUnlockEnable = client.TrunkUnlockEnable

    map.TRIP_B_Enable = client.TRIP_B_Enable

    if (client.SpeedThresholdEnable === 1) {
      map.SpeedThresholdEnable = 4
    } else {
      map.SpeedThresholdEnable = 0
    }

    if (client.ExternalLightSensorLevel === 0) {
      map.ExternalLightSensorLevel = 0
    } else if (client.ExternalLightSensorLevel === 2) {
      map.ExternalLightSensorLevel = 1
    } else if (client.ExternalLightSensorLevel === 4) {
      map.ExternalLightSensorLevel = 2
    }


    setDistanceUnit(map.DistanceUnit);
    setTemperatureUnit(map.TemperatureUnit);
    setTLanguageSelection(map.LanguageSelection);
    setConsumptionUnit(map.ConsumptionUnit);

    setBuzzerVolumeWarning(map.BuzzerVolumeWarning)
    setBuzzerVolumeButton(map.BuzzerVolumeButton)
    setHourMode(map.HourMode)

    setSpeedThreshold(map.SpeedThreshold)

    setRadioRepetition(map.RadioRepetition)
    setNavigationRepetition(map.NavigationRepetition)
    setPhoneRepetition(map.PhoneRepetition)
    setSpeedLockDoorEnable(map.SpeedLockDoorEnable)
    setDriverDoorUnlockEnable(map.DriverDoorUnlockEnable)
    setTrunkUnlockEnable(map.TrunkUnlockEnable)
    setTRIP_B_Enable(map.TRIP_B_Enable)
    setSpeedThresholdEnable(map.SpeedThresholdEnable)
    setExternalLightSensorLevel(map.ExternalLightSensorLevel)
  });




  const [DistanceUnit, setDistanceUnit] = React.useState("");
  const [TemperatureUnit, setTemperatureUnit] = React.useState("");
  const [LanguageSelection, setTLanguageSelection] = React.useState("");
  const [ConsumptionUnit, setConsumptionUnit] = React.useState("");

  const [BuzzerVolumeWarning, setBuzzerVolumeWarning] = React.useState("");
  const [BuzzerVolumeButton, setBuzzerVolumeButton] = React.useState("");
  const [HourMode, setHourMode] = React.useState("");

  const [SpeedThreshold, setSpeedThreshold] = React.useState("");

  const [RadioRepetition, setRadioRepetition] = React.useState("");
  const [NavigationRepetition, setNavigationRepetition] = React.useState("");
  const [PhoneRepetition, setPhoneRepetition] = React.useState("");
  const [SpeedLockDoorEnable, setSpeedLockDoorEnable] = React.useState("");
  const [DriverDoorUnlockEnable, setDriverDoorUnlockEnable] = React.useState("");
  const [TrunkUnlockEnable, setTrunkUnlockEnable] = React.useState("");

  const [TRIP_B_Enable, setTRIP_B_Enable] = React.useState("");
  const [SpeedThresholdEnable, setSpeedThresholdEnable] = React.useState("");
  const [ExternalLightSensorLevel, setExternalLightSensorLevel] = React.useState("");

  const handleChangeDistanceUnit = (event) => {

    map.DistanceUnit = event.target.value;
    socket.emit("message", map);
    setDistanceUnit(event.target.value);
  };

  const handleChangeTemperatureUnit = (event) => {

    map.TemperatureUnit = event.target.value;
    socket.emit("message", map);
    setTemperatureUnit(event.target.value);
  };

  const handleChangeLanguageSelection = (event) => {
    map.LanguageSelection = event.target.value;
    socket.emit("message", map);
    setTLanguageSelection(event.target.value);
  };

  const handleChangeConsumptionUnit = (event) => {

    map.ConsumptionUnit = event.target.value;
    socket.emit("message", map);
    setConsumptionUnit(event.target.value);
  };

  const handleBuzzerVolumeWarning = (event) => {

    map.BuzzerVolumeWarning = event.target.value;
    socket.emit("message", map);
    setBuzzerVolumeWarning(event.target.value);
  };

  const handleBuzzerVolumeButton = (event) => {
    map.BuzzerVolumeButton = event.target.value;
    socket.emit("message", map);
    setBuzzerVolumeButton(event.target.value);
  };

  const handleHourMode = (event) => {
    map.HourMode = event.target.value;
    socket.emit("message", map);
    setHourMode(event.target.value);
  };


  const handleSpeedThreshold = (event) => {
    console.log("stop drag")
    map.SpeedThreshold = event.target.value;
    socket.emit("message", map);
    setSpeedThreshold(event.target.value);
  };

  const handleRadioRepetition = (event) => {
    map.RadioRepetition = event.target.value;
    socket.emit("message", map);
    setRadioRepetition(event.target.value);
  };

  const handleNavigationRepetition = (event) => {
    map.NavigationRepetition = event.target.value;
    socket.emit("message", map);
    setNavigationRepetition(event.target.value);
    // let value = 0;
    // if(event.target.checked === true){
    //   value = 64;
    // }
    // map.NavigationRepetition = value;
    // socket.emit("message", map);
    // setNavigationRepetition(event.target.checked);
  };

  const handlePhoneRepetition = (event) => {
    map.PhoneRepetition = event.target.value;
    socket.emit("message", map);
    setPhoneRepetition(event.target.value);
  };

  const handleSpeedLockDoorEnable = (event) => {
    map.SpeedLockDoorEnable = event.target.value;
    socket.emit("message", map);
    setSpeedLockDoorEnable(event.target.value);
  };

  const handleDriverDoorUnlockEnable = (event) => {
    map.DriverDoorUnlockEnable = event.target.value;
    socket.emit("message", map);
    setDriverDoorUnlockEnable(event.target.value);
  };

  const handleTrunkUnlockEnable = (event) => {
    map.TrunkUnlockEnable = event.target.value;
    socket.emit("message", map);
    setTrunkUnlockEnable(event.target.value);
  };

  const handleResetTripA = (event) => {
    map.ResetTripA = 32;
    socket.emit("message", map);
    map.ResetTripA = 0;
  };

  const handleResetTripB = (event) => {
    map.ResetTripB = 16;
    socket.emit("message", map);
    map.ResetTripB = 0;
  };

  const handleTRIP_B_Enable = (event) => {
    map.TRIP_B_Enable = event.target.value;
    socket.emit("message", map);
    setTRIP_B_Enable(event.target.value);
  };

  const handleSpeedThresholdEnable = (event) => {
    map.SpeedThresholdEnable = event.target.value;
    socket.emit("message", map);
    setSpeedThresholdEnable(event.target.value);
  };

  const handleExternalLightSensorLevel = (event) => {
    map.ExternalLightSensorLevel = event.target.value;
    socket.emit("message", map);
    setExternalLightSensorLevel(event.target.value);
  };

  const [value, setValue] = React.useState(new Date());
  const handleChange = (newValue) => {
    setValue(newValue);
    socket.emit("datetime", newValue);
  };

  return (
    <div className={styles.Settings}>
      <List >

        <ListItem>
          <ListItemIcon >
            <SpeedIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Meeteenheid afstand" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={DistanceUnit} onChange={handleChangeDistanceUnit}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Km</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={128}>Miles</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <DeviceThermostatIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Meeteenheid temperatuur" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={TemperatureUnit} onChange={handleChangeTemperatureUnit}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>°C</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={64}>°F</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <LanguageIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Taal" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={LanguageSelection} onChange={handleChangeLanguageSelection}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Italiaans</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={8}>Duits</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={16}>Engels</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={24}>Spaans</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={32}>Frans</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={40}>Portugees</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <WavesIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Meeteenheid verbruik" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={ConsumptionUnit} onChange={handleChangeConsumptionUnit}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>km/litres</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={1}>litres/100 km</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={2}>Miles/gallon UK</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <BrowseGalleryIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Waarschuwings volume" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={BuzzerVolumeWarning} onChange={handleBuzzerVolumeWarning}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Level 0</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={32}>Level 1</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={64}>Level 2</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={96}>Level 3</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={128}>Level 4</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={160}>Level 5</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={192}>Level 6</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={224}>Level 7</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <BrowseGalleryIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Knoppen volume" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={BuzzerVolumeButton} onChange={handleBuzzerVolumeButton}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Level 0</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={4}>Level 1</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={8}>Level 2</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={12}>Level 3</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={16}>Level 4</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={20}>Level 5</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={24}>Level 6</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={28}>Level 7</MenuItem>
          </Select>
        </ListItem>


        <ListItem>
          <ListItemIcon>
            <BrowseGalleryIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Meeteenheid tijd" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={HourMode} onChange={handleHourMode}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>0–24h</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={2}>0–12h</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <BrowseGalleryIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="km/h snelheidslimiet" />
          <Slider sx={{ m: 1, maxWidth: "42%", fontSize: '30px' }}
            aria-label="Temperature"
            valueLabelDisplay="auto"
            step={5}
            min={30}
            max={250}
            marks
            value={SpeedThreshold}
            onChange={handleSpeedThreshold}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <RepeatOnIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Herhaling radio info op instrumentenpaneel" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={RadioRepetition} onChange={handleRadioRepetition}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uit</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={128}>Aan</MenuItem>
          </Select>

        </ListItem>

        <ListItem>
          <ListItemIcon>
            <RepeatOnIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Herhaling navigatie info op instrumentenpaneel" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={NavigationRepetition} onChange={handleNavigationRepetition}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uit</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={64}>Aan</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <RepeatOnIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Herhaling telefoon info op instrumentenpaneel" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={PhoneRepetition} onChange={handlePhoneRepetition}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uit</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={32}>Aan</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <HttpsIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Deurenblokkering door voertuig in beweging." />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={SpeedLockDoorEnable} onChange={handleSpeedLockDoorEnable}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uit</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={16}>Aan</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <HttpsIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Alleen deblokkering portier bestuurder." />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={DriverDoorUnlockEnable} onChange={handleDriverDoorUnlockEnable}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uit</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={8}>Aan</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <HttpsIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Onafhankelijke deblokkering bagageruimte." />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={TrunkUnlockEnable} onChange={handleTrunkUnlockEnable}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uit</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={4}>Aan</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <BrowseGalleryIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Reset trip A" />
          <Button sx={{ fontSize: '30px', marginRight: '8px', minWidth: '42%' }} variant="contained" onClick={handleResetTripA}>Reset</Button>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <BrowseGalleryIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Reset trip B" />
          <Button sx={{ fontSize: '30px', marginRight: '8px', minWidth: '42%' }} variant="contained" onClick={handleResetTripB}>Reset</Button>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <SpeedIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Trip B ingeschakeld" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={TRIP_B_Enable} onChange={handleTRIP_B_Enable}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uitgeschakeld</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={8}>Ingeschakeld</MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SpeedIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Snelheidslimiet ingeschakeld" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={SpeedThresholdEnable} onChange={handleSpeedThresholdEnable}>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Uitgeschakeld</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={4}>Ingeschakeld</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <SensorsIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Gevoeligheid schermer sensor" />
          <Select sx={{ m: 1, minWidth: "42%", fontSize: '30px' }} value={ExternalLightSensorLevel} onChange={handleExternalLightSensorLevel}>
            <MenuItem sx={{ fontSize: '30px' }} value={2}>Level 1</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={1}>Level 2</MenuItem>
            <MenuItem sx={{ fontSize: '30px' }} value={0}>Level 3</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CalendarMonthIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Datum en tijd" />
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <MobileDatePicker
              inputFormat="DD/MM/YYYY"
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              ampm={false}
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </ListItem>


      </List>
    </div>
  );
};


export default Settings;
