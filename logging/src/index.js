import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';

import { HttpServiceProvider } from './services/httpService';
import { QueryTransformServiceProvider } from './services/queryTransformService';
import { PodSubscriptionServiceProvider } from './services/podSubscriptionService';

import App from './App';

(async () => {
  const services = [
    HttpServiceProvider,
    QueryTransformServiceProvider,
    PodSubscriptionServiceProvider,
  ];

  await bootstrap({
    app: (
      <>
        <App />
      </>
    ),
    requiredBackendModules: [BackendModules.GRAFANA],
    enableNotifications: false,
    enableSubscriptions: false,
    services,
  });
})();
