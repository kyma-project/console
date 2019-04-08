import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo-hooks';

import App from './core/App';
import 'fiori-fundamentals/dist/fiori-fundamentals.min.css';

import nestServices from './services/nest';
import NotificationsService from './services/Notifications.service';
import QueriesService from './services/Queries.service';
import MutationsService from './services/Mutations.service';
import SubscriptionsService from './services/Subscriptions.service';
import FiltersService from './services/Filters.service';
import ConfigurationsService from './services/Configurations.service';
import LabelsService from './services/Labels.service';
import UrlsService from './services/Urls.service';

import appInitializer from './core/app-initializer';
import { createApolloClient } from './core/apollo-client';

const Services = nestServices(
  NotificationsService.Provider,
  QueriesService.Provider,
  MutationsService.Provider,
  FiltersService.Provider,
  ConfigurationsService.Provider,
  LabelsService.Provider,
  UrlsService.Provider,
  SubscriptionsService.Provider,
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
