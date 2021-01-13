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

import Services from 'components/Services/Services';
import ServiceDetails from 'components/Services/ServiceDetails/ServiceDetails';

import OAuthClientsList from 'components/OAuthClients/List/OAuthClientsList';
import CreateOAuthClient from 'components/OAuthClients/Create/CreateOAuthClient';
import OAuthClientsDetails from 'components/OAuthClients/Details/OAuthClientDetails';

import GlobalPermissions from 'components/Permissions/PermissionList/GlobalPermissions';
import ClusterRoleDetails from 'components/Permissions/RoleDetails/ClusterRoleDetails';
import NamespacePermissions from 'components/Permissions/PermissionList/NamespacePermissions';
import RoleDetails from 'components/Permissions/RoleDetails/RoleDetails';
import SecretList from 'components/Secrets/Secrets';
import SecretDetails from 'components/Secrets/Details/SecretDetails';

import { FUNCTIONS_WINDOW_TITLE } from 'components/Lambdas/constants';
import {
  API_RULES_TITLE,
  OAUTH_CLIENTS_TITLE,
  NAMESPACE_DETAILS_TITLE,
  NAMESPACES_TITLE,
  SERVICES_TITLE,
  SECRETS_TITLE,
} from 'shared/constants';

export default function App() {
  return (
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route
        path="/home/namespaces/:namespace/details"
        render={withTitle(NAMESPACE_DETAILS_TITLE, RoutedNamespaceDetails)}
      />
      <Route
        path="/namespaces"
        render={withTitle(NAMESPACES_TITLE, NamespaceList)}
      />

      <Route
        exact
        path="/home/namespaces/:namespaceId/services"
        render={withTitle(SERVICES_TITLE, RoutedServicesList)}
      />
      <Route
        path="/home/namespaces/:namespaceId/services/details/:serviceName"
        render={withTitle(SERVICES_TITLE, RoutedServiceDetails)}
      />

      <Route
        path="/home/global-permissions"
        exact
        render={withTitle('Global Permissions', GlobalPermissions)}
      />
      <Route
        path="/home/global-permission/roles/:roleName"
        render={withTitle('Global Permissions', RoutedClusterRoleDetails)}
      />
      <Route
        path="/home/namespaces/:namespaceId/permissions"
        exact
        render={withTitle('Permissions', RoutedNamespacePermissions)}
      />
      <Route
        path="/home/namespaces/:namespaceId/permissions/roles/:roleName"
        exact
        render={withTitle('Permissions', RoutedRoleDetails)}
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
        render={withTitle(OAUTH_CLIENTS_TITLE, RoutedOAuthClientsList)}
      />
      <Route
        path="/home/namespaces/:namespaceId/oauth-clients/create"
        render={withTitle(OAUTH_CLIENTS_TITLE, RoutedCreateOAuthClients)}
      />
      <Route
        path="/home/namespaces/:namespaceId/oauth-clients/details/:clientName"
        render={withTitle(OAUTH_CLIENTS_TITLE, RoutedOAuthClientDetails)}
      />

      <Route
        exact
        path="/apirules"
        render={withTitle(API_RULES_TITLE, ApiRules)}
      />
      <Route
        exact
        path="/apirules/create"
        render={withTitle(API_RULES_TITLE, CreateApiRule)}
      />
      <Route
        exact
        path="/apirules/details/:apiName"
        render={withTitle(API_RULES_TITLE, RoutedApiRuleDetails)}
      />
      <Route
        exact
        path="/apirules/edit/:apiName"
        render={withTitle(API_RULES_TITLE, RoutedEditApiRule)}
      />

      <Route
        exact
        path="/home/namespaces/:namespaceId/secrets"
        render={withTitle(SECRETS_TITLE, RoutedSecretList)}
      />
      <Route
        exact
        path="/home/namespaces/:namespaceId/secrets/details/:name"
        render={withTitle(SECRETS_TITLE, RoutedSecretDetails)}
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

function RoutedServicesList({ match }) {
  return <Services namespace={match.params.namespaceId} />;
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

function RoutedNamespacePermissions({ match }) {
  return <NamespacePermissions namespaceId={match.params.namespaceId} />;
}

function RoutedRoleDetails({ match }) {
  return (
    <RoleDetails
      roleName={match.params.roleName}
      namespaceId={match.params.namespaceId}
    />
  );
}

function RoutedClusterRoleDetails({ match }) {
  return <ClusterRoleDetails roleName={match.params.roleName} />;
}

function RoutedSecretList({ match }) {
  return <SecretList namespace={match.params.namespaceId} />;
}

function RoutedSecretDetails({ match }) {
  return (
    <SecretDetails
      namespace={match.params.namespaceId}
      name={match.params.name}
    />
  );
}
