import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';
import { NotificationContainer } from '@kyma-project/components';

import App from './core/App';

import {
  QueriesProvider,
  MutationsProvider,
  FiltersProvider,
  ConfigurationsProvider,
  LabelsProvider,
  UrlsProvider,
  SubscriptionsProvider,
} from './services';
import { LuigiContextProvider } from './services/LuigiContext.service';

(async () => {
  const services = [
    LuigiContextProvider,
    QueriesProvider,
    MutationsProvider,
    FiltersProvider,
    ConfigurationsProvider,
    LabelsProvider,
    UrlsProvider,
    SubscriptionsProvider,
  ];

  await bootstrap({
    app: (
      <>
        <NotificationContainer />
        <App />
      </>
    ),
    requiredBackendModules: [
      BackendModules.SERVICE_CATALOG,
      BackendModules.SERVICE_CATALOG_ADDONS,
    ],
    enableNotifications: true,
    enableSubscriptions: true,
    services,
  });
})();
