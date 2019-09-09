import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';

import { App } from './core/App';
import {
  QueriesProvider,
  NavigationProvider,
  DocsTopicsProvider,
} from './services';

(async () => {
  const services = [QueriesProvider, NavigationProvider, DocsTopicsProvider];

  await bootstrap({
    app: <App />,
    services,
    requiredBackendModules: [
      BackendModules.ASSET_STORE,
      BackendModules.HEADLESS_CMS,
    ],
    enableNotifications: false,
    enableSubscriptions: false,
  });
})();
