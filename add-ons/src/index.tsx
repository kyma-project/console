import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';
import { NotificationContainer } from '@kyma-project/components';
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
        <ReactShared.Microfrontend env={process.env}>
          <App />
        </ReactShared.Microfrontend>
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
