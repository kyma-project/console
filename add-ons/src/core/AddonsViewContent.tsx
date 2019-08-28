import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo-hooks';

import { Spinner } from '@kyma-project/react-components';

import App from './App';
import appInitializer from './app-initializer';
import { createApolloClient } from './apollo-client';

import nestServices from '../services/nest';
import {
  NotificationsProvider,
  QueriesProvider,
  MutationsProvider,
  SubscriptionsProvider,
  FiltersProvider,
  ConfigurationsProvider,
  LabelsProvider,
  UrlsProvider,
} from '../services';

const Services = nestServices(
  NotificationsProvider,
  QueriesProvider,
  MutationsProvider,
  FiltersProvider,
  ConfigurationsProvider,
  LabelsProvider,
  UrlsProvider,
  SubscriptionsProvider,
);

function AddonsViewContent() {
  const [contextPresent, setContextPresent] = useState(false);

  appInitializer.init().then(() => {
    setContextPresent(true);
  });

  return contextPresent ? (
    <ApolloProvider client={createApolloClient()}>
      <Services>
        <App />
      </Services>
    </ApolloProvider>
  ) : (
    <Spinner />
  );
}

export default AddonsViewContent;
