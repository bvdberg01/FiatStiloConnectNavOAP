import * as React from 'react';
import { MuiBottomNavigation } from './components/MuiBottomNavigation'
import { Routes, Route, useNavigate } from "react-router-dom";
import Tripa from './components/Tripa/Tripa';
import Tripb from './components/Tripb/Tripb';
import Settings from './components/Settings/Settings';
import './App.css';

function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/tripa');
  }, []);

  return (
    <div>
      <div class="Router">
        <Routes>
          <Route path="/tripa" element={<Tripa />} />
          <Route path="/tripb" element={<Tripb />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <div class="Menu">
        <MuiBottomNavigation />
      </div>
    </div>

  );
}

export default App;
