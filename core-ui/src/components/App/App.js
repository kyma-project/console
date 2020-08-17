import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withTitle } from 'react-shared';

import NamespaceDetails from '../NamespaceDetails/NamespaceDetails';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';
import LambdaDetails from '../Lambdas/LambdaDetails';

import CreateApiRule from '../ApiRules/CreateApiRule/CreateApiRule';

import ApiRules from 'components/ApiRules/ApiRules';
import ApiRuleDetails from 'components/ApiRules/ApiRuleDetails/ApiRuleDetails';
import EditApiRule from 'components/ApiRules/EditApiRule/EditApiRule';

import ServiceDetails from 'components/Services/ServiceDetails/ServiceDetails';
import { FUNCTIONS_WINDOW_TITLE } from 'components/Lambdas/constants';

import OAuthClientsList from 'components/OAuthClients/List/OAuthClientsList';
import CreateOAuthClient from 'components/OAuthClients/Create/CreateOAuthClient';
import OAuthClientsDetails from 'components/OAuthClients/Details/OAuthClientDetails';

export default function App() {
  return (
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route
        path="/home/namespaces/:namespace/details"
        render={withTitle('Namespace Details', RoutedNamespaceDetails)}
      />
      <Route
        path="/namespaces"
        render={withTitle('Namespaces', NamespaceList)}
      />

      <Route
        path="/home/namespaces/:namespaceId/services/details/:serviceName"
        render={withTitle('Services', RoutedServiceDetails)}
      />

      <Route
        path="/lambdas"
        exact
        render={withTitle(FUNCTIONS_WINDOW_TITLE, Lambdas)}
      />
      <Route
        path="/lambda/:name"
        render={withTitle(FUNCTIONS_WINDOW_TITLE, LambdaDetails)}
      />

      <Route
        exact
        path="/home/namespaces/:namespaceId/oauth-clients"
        render={withTitle('OAuth Clients', RoutedOAuthClientsList)}
      />
      <Route
        path="/home/namespaces/:namespaceId/oauth-clients/create"
        render={withTitle('OAuth Clients', RoutedCreateOAuthClients)}
      />
      <Route
        path="/home/namespaces/:namespaceId/oauth-clients/details/:clientName"
        render={withTitle('OAuth Clients', RoutedOAuthClientDetails)}
      />

      <Route exact path="/apirules" render={withTitle('API Rules', ApiRules)} />
      <Route
        exact
        path="/apirules/create"
        render={withTitle('API Rules', CreateApiRule)}
      />
      <Route
        exact
        path="/apirules/details/:apiName"
        render={withTitle('API Rules', RoutedApiRuleDetails)}
      />
      <Route
        exact
        path="/apirules/edit/:apiName"
        render={withTitle('API Rules', RoutedEditApiRule)}
      />
    </Switch>
  );
}

function RoutedNamespaceDetails({ match }) {
  return <NamespaceDetails name={match.params.namespace} />;
}

function RoutedOAuthClientsList({ match }) {
  return <OAuthClientsList namespace={match.params.namespaceId} />;
}

function RoutedCreateOAuthClients({ match }) {
  return <CreateOAuthClient namespace={match.params.namespaceId} />;
}

function RoutedOAuthClientDetails({ match }) {
  return (
    <OAuthClientsDetails
      namespace={match.params.namespaceId}
      name={match.params.clientName}
    />
  );
}

function RoutedServiceDetails({ match }) {
  return (
    <ServiceDetails
      namespaceId={match.params.namespaceId}
      serviceName={match.params.serviceName}
    />
  );
}

function RoutedApiRuleDetails({ match }) {
  return <ApiRuleDetails apiName={match.params.apiName} />;
}

function RoutedEditApiRule({ match }) {
  return <EditApiRule apiName={match.params.apiName} />;
}
