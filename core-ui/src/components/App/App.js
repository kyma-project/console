import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotificationProvider } from '../../contexts/notifications';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';
import LambdaDetails from '../Lambdas/LambdaDetails/LambdaDetails';

export default function App() {
  return (
    <NotificationProvider>
      <Switch>
        <Route path="/lambdas" exact component={Lambdas} />
        <Route path="/preload" component={() => null} />
        <Route path="/namespaces" component={NamespaceList} />
        <Route
          path="/lambdas/:id"
          exact
          render={({ match }) => <LambdaDetails lambdaId={match.params.id} />}
        />
      </Switch>
    </NotificationProvider>
  );
}
