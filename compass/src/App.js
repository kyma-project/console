import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Runtimes from './components/Runtimes/Runtimes';

function App() {
  return (
    <Router>
      <Route path="/runtimes" exact component={Runtimes} />
    </Router>
  );
}

export default App;
