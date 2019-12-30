import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotificationProvider } from '../../contexts/notifications';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';
import LambdaDetailsWrapper from '../Lambdas/LambdaDetails/LambdaDetailsWrapper';

import CreateApiRule from '../ApiRules/CreateApiRule/CreateApiRule';

import ApiRules from 'components/ApiRules/ApiRules';
import ApiRuleDetails from 'components/ApiRules/ApiRuleDetails/ApiRuleDetails';

export default function App() {
  return (
    <NotificationProvider>
      <Switch>
        <Route path="/lambda/:name" component={RoutedLambdaDetails} />
        <Route path="/lambdas" exact component={Lambdas} />
        <Route path="/preload" component={() => null} />
        <Route path="/namespaces" component={NamespaceList} />

        <Route exact path="/apirules" component={ApiRules} />
        <Route exact path="/apirules/create" component={CreateApiRule} />
        <Route
          exact
          path="/apirules/details/:apiName"
          component={RoutedApiDetails}
        />
      </Switch>
    </NotificationProvider>
  );
}

function RoutedLambdaDetails({ match }) {
  return <LambdaDetailsWrapper lambdaName={match.params.name} />;
}

function RoutedApiDetails({ match }) {
  return <ApiRuleDetails apiName={match.params.apiName} />;
}
