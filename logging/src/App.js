import React from 'react';
import Logs from './components/Logs';
import './App.scss';

import { useHttpService } from './services/httpService';

function App() {
  return (
    <useHttpService.Provider>
      <Logs />
    </useHttpService.Provider>
  );
}

export default App;
