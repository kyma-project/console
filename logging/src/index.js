import React from 'react';
import { bootstrap } from '@kyma-project/common';

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
    enableNotifications: false,
    enableSubscriptions: false,
    services,
  });
})();
