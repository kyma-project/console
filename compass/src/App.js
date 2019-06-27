import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Runtimes from './components/Runtimes/Runtimes';

function App() {
  return (
    <Router>
      <Route path="/runtimes" exact component={Runtimes} />
    </Router>
  );
}

export default App;
