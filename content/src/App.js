import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from './components/MainPage/MainPage.container';

function App() {
  return (
    <div>
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/:type/:id" component={MainPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
