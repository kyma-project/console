import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withTitle } from 'react-shared';

import LambdaDetails from '../Lambdas/LambdaDetails';

import { FUNCTIONS_WINDOW_TITLE } from 'components/Lambdas/constants';
import {
  getComponentForList,
  getComponentForDetails,
} from 'shared/getComponents';

export default function App() {
  return (
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route
        exact
        path="/namespaces/:namespaceId/:resourceType/:resourceName"
        component={RoutedResourceDetails}
      />
      <Route
        exact
        path="/namespaces/:namespaceId/:resourceType"
        component={RoutedResourcesList}
      />
      <Route
        exact
        path="/:resourceType/:resourceName"
        component={RoutedResourceDetails}
      />
      <Route exact path="/:resourceType" component={RoutedResourcesList} />

      <Route
        path="/lambda/:name"
        render={withTitle(FUNCTIONS_WINDOW_TITLE, LambdaDetails)}
      />
    </Switch>
  );
}

function RoutedResourcesList({ match }) {
  const queryParams = new URLSearchParams(window.location.search);
  const resourceUrl =
    queryParams.get('resourceApiPath') + window.location.pathname;

  const params = {
    hasDetailsView: queryParams.get('hasDetailsView') === 'true',
    resourceUrl,
    resourceType: match.params.resourceType,
    namespace: match.params.namespaceId,
  };

  const rendererName = params.resourceType + 'List';
  const rendererNameForCreate = params.resourceType + 'Create';

  return getComponentForList(rendererName, rendererNameForCreate, params);
}

function RoutedResourceDetails({ match }) {
  const queryParams = new URLSearchParams(window.location.search);
  const resourceUrl =
    queryParams.get('resourceApiPath') + window.location.pathname;

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
