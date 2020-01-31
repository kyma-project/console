import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotificationProvider } from 'react-shared';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';
import LambdaDetailsWrapper from '../Lambdas/LambdaDetails/LambdaDetailsWrapper';

import CreateApiRule from '../ApiRules/CreateApiRule/CreateApiRule';

import ApiRules from 'components/ApiRules/ApiRules';
import ApiRuleDetails from 'components/ApiRules/ApiRuleDetails/ApiRuleDetails';
import EditApiRule from 'components/ApiRules/EditApiRule/EditApiRule';

import ApplicationList from 'components/Applications/ApplicationList/ApplicationList';
import ApplicationDetails from 'components/Applications/ApplicationDetails/ApplicationDetails';
import ApiDetails from 'components/Apis/ApiDetails/ApiDetails';
import EditEventApi from 'components/Apis/EditEventApi/EditEventApi';
import EditApi from 'components/Apis/EditApi/EditApi';

export default function App() {
  return (
    <NotificationProvider>
      <Switch>
        <Route path="/preload" component={() => null} />
        <Route path="/namespaces" component={NamespaceList} />

        <Route path="/lambdas" exact component={Lambdas} />
        <Route path="/lambda/:name" component={RoutedLambdaDetails} />

        <Route exact path="/applications" component={ApplicationList} />
        <Route
          exact
          path="/application/:appId"
          component={RoutedApplicationDetails}
        />
        <Route
          exact
          path="/application/:appId/api/:apiId"
          component={RoutedApiDetails}
        />
        <Route
          exact
          path="/application/:appId/api/:apiId/edit"
          component={RoutedEditApi}
        />
        <Route
          exact
          path="/application/:appId/eventApi/:eventApiId"
          component={RoutedEventApiDetails}
        />
        <Route
          exact
          path="/application/:appId/eventApi/:eventApiId/edit"
          component={RoutedEditEventApi}
        />

        <Route exact path="/apirules" component={ApiRules} />
        <Route exact path="/apirules/create" component={CreateApiRule} />
        <Route
          exact
          path="/apirules/details/:apiName"
          component={RoutedApiRuleDetails}
        />
        <Route
          exact
          path="/apirules/edit/:apiName"
          component={RoutedEditApiRule}
        />
      </Switch>
    </NotificationProvider>
  );
}

function RoutedLambdaDetails({ match }) {
  return <LambdaDetailsWrapper lambdaName={match.params.name} />;
}

function RoutedApiRuleDetails({ match }) {
  return <ApiRuleDetails apiName={match.params.apiName} />;
}

function RoutedEditApiRule({ match }) {
  return <EditApiRule apiName={match.params.apiName} />;
}

function RoutedApplicationDetails({ match }) {
  return <ApplicationDetails appId={match.params.appId} />;
}

function RoutedApiDetails({ match }) {
  return <ApiDetails appId={match.params.appId} apiId={match.params.apiId} />;
}

function RoutedEditApi({ match }) {
  return <EditApi appId={match.params.appId} apiId={match.params.apiId} />;
}

function RoutedEventApiDetails({ match }) {
  return (
    <ApiDetails
      appId={match.params.appId}
      eventApiId={match.params.eventApiId}
    />
  );
}

function RoutedEditEventApi({ match }) {
  return (
    <EditEventApi
      appId={match.params.appId}
      eventApiId={match.params.eventApiId}
    />
  );
}
