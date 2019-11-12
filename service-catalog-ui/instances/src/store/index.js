import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from './ws';
import { getMainDefinition } from 'apollo-utilities';

import builder from './../commons/builder';
import { getApiUrl as getURL } from '@kyma-project/common';

export function isSubscriptionOperation({ query }) {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  );
}

export function createApolloClient() {
  const graphqlApiUrl = getURL(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

  const wsLink = new WebSocketLink({
    uri: getURL('subscriptionsApiUrl'),
    options: {
      reconnect: true,
    },
  });

  const httpLink = new HttpLink({
    uri: graphqlApiUrl,
    headers: {
      authorization: builder.getBearerToken() || null,
    },
  });

  const link = split(isSubscriptionOperation, wsLink, httpLink);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      fetchPolicy: 'no-cache',
    },
  });
}
