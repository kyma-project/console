import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NamespaceDetails from '../NamespaceDetails/NamespaceDetails';
import NamespaceList from '../NamespaceList/NamespaceList';
import Lambdas from '../Lambdas/Lambdas';
import LambdaDetails from '../Lambdas/LambdaDetails';

import CreateApiRule from '../ApiRules/CreateApiRule/CreateApiRule';

import ApiRules from 'components/ApiRules/ApiRules';
import ApiRuleDetails from 'components/ApiRules/ApiRuleDetails/ApiRuleDetails';
import EditApiRule from 'components/ApiRules/EditApiRule/EditApiRule';

import ServiceDetails from 'components/Services/ServiceDetails/ServiceDetails';

import OAuthClientsList from 'components/OAuthClients/List/OAuthClientsList';
import CreateOAuthClient from 'components/OAuthClients/Create/CreateOAuthClient';
import OAuthClientsDetails from 'components/OAuthClients/Details/OAuthClientDetails';
import EditOAuthClient from 'components/OAuthClients/Edit/EditOAuthClient';

export default function App() {
  return (
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route
        path="/home/namespaces/:namespace/details"
        component={RoutedNamespaceDetails}
      />
      <Route path="/namespaces" component={NamespaceList} />

      <Route
        path="/home/namespaces/:namespaceId/services/details/:serviceName"
        component={RoutedServiceDetails}
      />

      <Route
        exact
        path="/home/namespaces/:namespaceId/oauth-clients"
        component={RoutedOAuthClientsList}
      />
      <Route
        path="/home/namespaces/:namespaceId/oauth-clients/create"
        component={RoutedCreateOAuthClients}
      />
      <Route
        exact
        path="/home/namespaces/:namespaceId/oauth-clients/details/:clientName"
        component={RoutedOAuthClientDetails}
      />
      <Route
        path="/home/namespaces/:namespaceId/oauth-clients/details/:clientName/edit"
        component={RoutedEditOAuthClients}
      />

      <Route path="/lambdas" exact component={Lambdas} />
      <Route path="/lambda/:name" component={LambdaDetails} />

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

function RoutedEditOAuthClients({ match }) {
  return (
    <EditOAuthClient
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
