import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  withTitle,
  useMicrofrontendContext,
  getComponentFor,
  ResourcesList as GenericResourcesList,
  ResourceDetails as GenericResourceDetails,
} from 'react-shared';

import NamespaceDetails from '../NamespaceDetails/NamespaceDetails';

import Lambdas from '../Lambdas/Lambdas';
import LambdaDetails from '../Lambdas/LambdaDetails';

import CreateApiRule from '../ApiRules/CreateApiRule/CreateApiRule';
import ApiRules from 'components/ApiRules/ApiRules';
import ApiRuleDetails from 'components/ApiRules/ApiRuleDetails/ApiRuleDetails';
import EditApiRule from 'components/ApiRules/EditApiRule/EditApiRule';

import SecretList from 'components/Secrets/Secrets';
import SecretDetails from 'components/Secrets/Details/SecretDetails';

import { FUNCTIONS_WINDOW_TITLE } from 'components/Lambdas/constants';
import {
  API_RULES_TITLE,
  NAMESPACE_DETAILS_TITLE,
  SECRETS_TITLE,
} from 'shared/constants';

import * as PredefinedRenderers from 'components/Predefined';

export default function App() {
  return (
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route
        path="/home/namespaces/:namespace/details"
        render={withTitle(NAMESPACE_DETAILS_TITLE, RoutedNamespaceDetails)}
      />

      <Route path="/home/:resourceType" component={RoutedResourcesList} />
      <Route
        exact
        path="/home/:resourceType/:resourceName"
        component={RoutedResourceDetails}
      />
      <Route
        exact
        path="/home/namespaces/:namespaceId/:resourceType"
        component={RoutedResourcesList}
      />
      <Route
        exact
        path="/home/namespaces/:namespaceId/:resourceType/:resourceName"
        component={RoutedResourceDetails}
      />
      <Route exact path="/home/:resourceType" component={RoutedResourcesList} />

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

export const getComponentForList = getComponentFor(
  PredefinedRenderers,
  GenericResourcesList,
);

export const getComponentForDetails = getComponentFor(
  PredefinedRenderers,
  GenericResourceDetails,
);

function RoutedResourcesList({ match }) {
  const queryParams = new URLSearchParams(window.location.search);
  const resourceUrl =
    queryParams.get('resourceApiPath') +
    window.location.pathname.replace('/home', ''); //TODO improve it

  const params = {
    hasDetailsView: queryParams.get('hasDetailsView') === 'true',
    resourceUrl,
    resourceType: match.params.resourceType,
    namespace: match.params.namespaceId,
  };

  const rendererName =
    params.resourceType[0].toUpperCase() +
    params.resourceType.substr(1) +
    'List';

  return getComponentForList(rendererName, params);
}

function RoutedResourceDetails({ match }) {
  const context = useMicrofrontendContext();
  const resourceUrl =
    context?.resourceApiPath + window.location.pathname.replace('/home', ''); //TODO improve it

  const params = {
    resourceUrl,
    resourceType: match.params.resourceType,
    resourceName: match.params.resourceName,
    namespace: match.params.namespaceId,
  };

  const rendererName =
    params.resourceType[0].toUpperCase() +
    params.resourceType.substr(1) +
    'Details';

  return getComponentForDetails(rendererName, params);
}

function RoutedNamespaceDetails({ match }) {
  return <NamespaceDetails name={match.params.namespace} />;
}

function RoutedApiRuleDetails({ match }) {
  return <ApiRuleDetails apiName={match.params.apiName} />;
}

function RoutedEditApiRule({ match }) {
  return <EditApiRule apiName={match.params.apiName} />;
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
