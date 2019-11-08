import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotificationProvider } from '../../contexts/notifications';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';
import LambdaDetailsWrapper from '../Lambdas/LambdaDetails/LambdaDetailsWrapper';

import ApiRuleCreationDraft from '../ApiRuleCreationDraft/ApiRuleCreationDraft';

export default function App() {
  return (
    <NotificationProvider>
      <Switch>
        <Route path="/lambda/:name" component={RoutedLambdaDetails} />
        <Route path="/lambdas" exact component={Lambdas} />
        <Route path="/preload" component={() => null} />
        <Route path="/namespaces" component={NamespaceList} />

        <Route path="/createApiRule" component={ApiRuleCreationDraft} />
      </Switch>
    </NotificationProvider>
  );
}

function RoutedLambdaDetails({ match }) {
  return <LambdaDetailsWrapper lambdaName={match.params.name} />;
}
