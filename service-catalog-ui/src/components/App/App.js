import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ServiceClassList from '../ServiceClassList/ServiceClassList';
import { NotificationProvider } from 'react-shared';

const App = () => (
  <NotificationProvider>
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route exact path="/" component={ServiceClassList} />
    </Switch>
  </NotificationProvider>
);

export default App;
