import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo-hooks';

import App from './core/App';
import 'fiori-fundamentals/dist/fiori-fundamentals.min.css';

import nestServices from './services/nest';
import {
  NotificationsProvider,
  QueriesProvider,
  MutationsProvider,
  SubscriptionsProvider,
  FiltersProvider,
  ConfigurationsProvider,
  LabelsProvider,
  UrlsProvider,
} from './services';

import appInitializer from './core/app-initializer';
import { createApolloClient } from './core/apollo-client';

const Services = nestServices(
  NotificationsProvider,
  QueriesProvider,
  MutationsProvider,
  SubscriptionsProvider,
  FiltersProvider,
  ConfigurationsProvider,
  LabelsProvider,
  UrlsProvider,
);

(async () => {
  await appInitializer.init();
  const client = createApolloClient();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Services>
        <App />
      </Services>
    </ApolloProvider>,
    document.getElementById('root'),
  );
})();
