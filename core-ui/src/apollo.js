import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';

import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import React, { useEffect, useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import {
  useMicrofrontendContext,
  isSubscriptionOperation,
  useConfig,
} from 'react-shared';

const errorLink = onError(
  ({ operation, response, graphQLErrors, networkError }) => {
    if (process.env.REACT_APP_ENV !== 'production') {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }

      if (networkError) console.log('[Network error]:', networkError);
    }
  },
);

const modifyHeaders = modifiers =>
  setContext((_, { oldHeaders }) => ({
    headers: modifiers.reduce((acc, m) => m(acc), oldHeaders),
  }));

const setHeader = (header, value) => headers => ({
  ...headers,
  [header]: value,
});

const setAuthorization = token => setHeader('authorization', `Bearer ${token}`);

export function createKymaApolloClient(fromConfig, token) {
  const graphqlApiUrl = 'http://localhost:3000/graphql';

  const httpLink = createHttpLink({
    uri: graphqlApiUrl,
  });

  const authLink = modifyHeaders([setAuthorization(token)]);
  const authHttpLink = authLink.concat(httpLink);

  const wsLink = new WebSocketLink({
    token,
    uri: 'ws://localhost:3000/graphql',
    options: {
      reconnect: true,
    },
  });

  const link = split(isSubscriptionOperation, wsLink, authHttpLink);

  return new ApolloClient({
    uri: graphqlApiUrl,
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.id || object.name || null,
    }),
  });
}

export const ApolloClientProvider = ({ children, createClient, provider }) => {
  const context = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!context.idToken) {
      return;
    }
    const client = createClient(fromConfig, context.idToken);
    setClient(client);
    return () => client.stop();
  }, [context.idToken, createClient, setClient, fromConfig]);

  const Provider = provider ? provider : ApolloProvider;
  return client && <Provider client={client}>{children}</Provider>;
};

class WebSocketLink extends ApolloLink {
  constructor(paramsOrClient) {
    super();

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      this.subscriptionClient = new SubscriptionClient(
        paramsOrClient.uri,
        paramsOrClient.options,
        null,
        ['graphql-ws', paramsOrClient.token],
      );
    }
  }

  request(operation) {
    return this.subscriptionClient.request(operation);
  }
}
