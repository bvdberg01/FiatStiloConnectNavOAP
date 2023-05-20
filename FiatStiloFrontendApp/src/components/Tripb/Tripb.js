import React, { useState, useEffect } from 'react';

// import styles from './Settings.module.css';
import styles from './Tripb.module.css';

//Sockets
import io from 'socket.io-client';

// Frontend
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



// Icons
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TourIcon from '@mui/icons-material/Tour';
import GasMeterIcon from '@mui/icons-material/GasMeter';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const socket = io('127.0.0.1:3005');

var map = {
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
  AverageFuelConsumption3: 0
}

const Tripb = () => {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  socket.on('connect', () => {
    setIsConnected(true);

  });

  socket.on('disconnect', () => {
    setIsConnected(false);
  });

  var loadinit = false;

  socket.on('tripb', (client) => {

    map.TravelingTime2_Hour1 = client.TravelingTime2_Hour1;
    map.TravelingTime2_Hour2 = client.TravelingTime2_Hour2;
    map.TravelingTime2_Minute1 = client.TravelingTime2_Minute1;
    map.TravelingTime2_Minute2 = client.TravelingTime2_Minute2;
    map.PartialOdometer_2 = client.PartialOdometer_2;
    map.AverageSpeed_2 = client.AverageSpeed_2;
    map.AutonomyDistance = client.AutonomyDistance;
    map.IstantaneousFuelConsumption1 = client.IstantaneousFuelConsumption1;
    map.IstantaneousFuelConsumption2 = client.IstantaneousFuelConsumption2;
    map.IstantaneousFuelConsumption3 = client.IstantaneousFuelConsumption3;
    map.AverageFuelConsumption1 = client.AverageFuelConsumption1;
    map.AverageFuelConsumption2 = client.AverageFuelConsumption2;
    map.AverageFuelConsumption3 = client.AverageFuelConsumption3;

    setTravelingTime2_Hour1(map.TravelingTime2_Hour1);
    setTravelingTime2_Hour2(map.TravelingTime2_Hour2);
    setTravelingTime2_Minute1(map.TravelingTime2_Minute1);
    setTravelingTime2_Minute2(map.TravelingTime2_Minute2);
    setPartialOdometer_2(map.PartialOdometer_2);
    setAverageSpeed_2(map.AverageSpeed_2);
    setIstantaneousFuelConsumption1(map.IstantaneousFuelConsumption1);
    setIstantaneousFuelConsumption2(map.IstantaneousFuelConsumption2);
    setIstantaneousFuelConsumption3(map.IstantaneousFuelConsumption3);
    setAverageFuelConsumption1(map.AverageFuelConsumption1);
    setAverageFuelConsumption2(map.AverageFuelConsumption2);
    setAverageFuelConsumption3(map.AverageFuelConsumption3);
    setAutonomyDistance(map.AutonomyDistance);
  });

  const [TravelingTime2_Hour1, setTravelingTime2_Hour1] = React.useState(map.TravelingTime2_Hour1);
  const [TravelingTime2_Hour2, setTravelingTime2_Hour2] = React.useState(map.TravelingTime2_Hour2);
  const [TravelingTime2_Minute1, setTravelingTime2_Minute1] = React.useState(map.TravelingTime2_Minute1);
  const [TravelingTime2_Minute2, setTravelingTime2_Minute2] = React.useState(map.TravelingTime2_Minute2);

  const [PartialOdometer_2, setPartialOdometer_2] = React.useState(map.PartialOdometer_2);
  const [AverageSpeed_2, setAverageSpeed_2] = React.useState(map.AverageSpeed_2);

  const [IstantaneousFuelConsumption1, setIstantaneousFuelConsumption1] = React.useState(map.IstantaneousFuelConsumption1);
  const [IstantaneousFuelConsumption2, setIstantaneousFuelConsumption2] = React.useState(map.IstantaneousFuelConsumption2);
  const [IstantaneousFuelConsumption3, setIstantaneousFuelConsumption3] = React.useState(map.IstantaneousFuelConsumption3);

  const [AverageFuelConsumption1, setAverageFuelConsumption1] = React.useState(map.AverageFuelConsumption1);
  const [AverageFuelConsumption2, setAverageFuelConsumption2] = React.useState(map.AverageFuelConsumption2);
  const [AverageFuelConsumption3, setAverageFuelConsumption3] = React.useState(map.AverageFuelConsumption3);

  const [AutonomyDistance, setAutonomyDistance] = React.useState(map.AutonomyDistance);

  return (
    <div className={styles.Tripb}>
      <List >
        <ListItem>
          <ListItemIcon>
            <AccessTimeIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Reistijd" />
          <a>{TravelingTime2_Hour1}</a><a>{TravelingTime2_Hour2}</a><a>:</a><a>{TravelingTime2_Minute1}</a><a>{TravelingTime2_Minute2}</a>
        </ListItem>

        <ListItem>
          <ListItemIcon >
            <TourIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Afgelegde afstand" />
          <a>{PartialOdometer_2}</a>&nbsp;<a> km</a>
        </ListItem>

        <ListItem>
          <ListItemIcon >
            <SpeedIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Gemiddelde snelheid" />
          <a>{AverageSpeed_2}</a>&nbsp;<a> km/h</a>
        </ListItem>

        <ListItem>
          <ListItemIcon >
            <GasMeterIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Gemiddelde verbruik" />
          <a>{AverageFuelConsumption1}</a><a>{AverageFuelConsumption2}</a><a>.</a><a>{AverageFuelConsumption3}</a>&nbsp;<a> km/l</a>
        </ListItem>

        <ListItem>
          <ListItemIcon >
            <GasMeterIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Onmiddellijk verbruik" />
          <a>{IstantaneousFuelConsumption1}</a><a>{IstantaneousFuelConsumption2}</a><a>.</a><a>{IstantaneousFuelConsumption3}</a>&nbsp;<a> km/l</a>
        </ListItem>

        <ListItem>
          <ListItemIcon >
            <LocalGasStationIcon sx={{ fontSize: '50px' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '30px' }} id="switch-list-label-wifi" primary="Autonomie" />
          <a>{AutonomyDistance} </a>&nbsp;<a> km</a>
        </ListItem>
      </List>
    </div>
  );
};


export default Tripb;
