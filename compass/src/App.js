import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Runtimes from './components/Runtimes/Runtimes';
import Overview from './components/Overview/Overview';
import RuntimeDetails from './components/Runtimes/RuntimeDetails/RuntimeDetails';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Overview} />
      <Route path="/runtimes" exact component={Runtimes} />
      <Route
        path="/runtime/:id"
        exact
        render={({ match }) => <RuntimeDetails runtimeId={match.params.id} />}
      />
    </Router>
  );
}

export default App;
