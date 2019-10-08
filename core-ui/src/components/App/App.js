import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotificationProvider } from '../../contexts/notifications';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';

export default function App() {
  return (
    <NotificationProvider>
      <Switch>
        <Route path="/" exact component={NamespaceList} />
        <Route path="/lambdas" exact component={Lambdas} />
      </Switch>
    </NotificationProvider>
  );
}
