import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import ServiceInstanceDetails from '../ServiceInstanceDetails/ServiceInstanceDetails';
import ServiceInstancesList from '../ServiceInstancesList/ServiceInstancesList';

export default function App() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`} component={ServiceInstancesList} />
      <Route
        exact
        path={`${path}/details/:name`}
        component={ServiceInstanceDetails}
      />
    </Switch>
  );
}
