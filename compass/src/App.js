import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Runtimes from './components/Runtimes/Runtimes';
import Overview from './components/Overview/Overview';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Overview} />
      <Route path="/runtimes" exact component={Runtimes} />
    </Router>
  );
}

export default App;
