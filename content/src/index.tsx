import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';

import { App } from './core/App';
import {
  QueriesProvider,
  NavigationProvider,
  ClusterAssetGroupsProvider,
} from './services';

(async () => {
  const services = [
    QueriesProvider,
    NavigationProvider,
    ClusterAssetGroupsProvider,
  ];

  await bootstrap({
    app: <App />,
    services,
    requiredBackendModules: [BackendModules.RAFTER],
    enableNotifications: false,
    enableSubscriptions: false,
  });
})();
