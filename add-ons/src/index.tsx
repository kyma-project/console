import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';
import * as ReactShared from './react-shared';

import App from './core/App';
import './index.scss';

import {
  QueriesProvider,
  MutationsProvider,
  FiltersProvider,
  ConfigurationsProvider,
  LabelsProvider,
  UrlsProvider,
  SubscriptionsProvider,
  LuigiContextProvider,
} from './services';

(async () => {
  const services = [
    ReactShared.Microfrontend,
    LuigiContextProvider,
    QueriesProvider,
    MutationsProvider,
    FiltersProvider,
    ConfigurationsProvider,
    LabelsProvider,
    UrlsProvider,
    SubscriptionsProvider,
  ] as any[];

  await bootstrap({
    app: <App />,
    requiredBackendModules: [
      BackendModules.SERVICE_CATALOG,
      BackendModules.SERVICE_CATALOG_ADDONS,
    ],
    enableNotifications: false,
    enableSubscriptions: true,
    services,
  });
})();
