import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { green } from '@mui/material/colors';


export const MuiBottomNavigation = () => {


  const [value, setValue] = useState(0);

  const navigate = useNavigate();

  return (
    <BottomNavigation
      sx={{ backgroundColor: "#323332", width: '100%', height: '100px', position: 'absolute', bottom: 0 }}
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}>
      <BottomNavigationAction sx={{ color: "#ebebeb" }} label={<span style={{ fontSize: '30px' }}>Trip A</span>} onClick={() => navigate("/tripa")} icon={<AnalyticsIcon />} />
      <BottomNavigationAction sx={{ color: "#ebebeb" }} label={<span style={{ fontSize: '30px' }}>Trip B</span>} onClick={() => navigate("/tripb")} icon={<AnalyticsIcon />} />
      <BottomNavigationAction sx={{ color: "#ebebeb" }} label={<span style={{ fontSize: '30px' }}>Settings</span>} onClick={() => navigate("/settings")} icon={<SettingsIcon />} />
    </BottomNavigation>
  )
}