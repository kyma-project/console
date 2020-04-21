import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

import builder from './commons/builder';
import { getApiUrl as getURL } from '@kyma-project/common';

import { SubscriptionClient } from 'subscriptions-transport-ws';

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

  const httpLink = createHttpLink({ uri: graphqlApiUrl });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: builder.getBearerToken() || null,
      },
    };
  });
  const authHttpLink = authLink.concat(httpLink);
  const link = split(isSubscriptionOperation, wsLink, httpLink);

  const cache = new InMemoryCache();

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

        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }
    },
  );

  const client = new ApolloClient({
    uri: graphqlApiUrl,
    cache,
    link: ApolloLink.from([errorLink, link]),
    connectToDevTools: true,
  });

  return client;
}

class WebSocketLink extends ApolloLink {
  constructor(paramsOrClient) {
    super();

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      const bearerToken = builder.getBearerToken();
      const protocols = ['graphql-ws'];

      const token = bearerToken ? bearerToken.split(' ')[1] : null;
      if (token) {
        protocols.push(token);
      }

      this.subscriptionClient = new SubscriptionClient(
        paramsOrClient.uri,
        paramsOrClient.options,
        null,
        protocols,
      );
    }
  }

  request(operation) {
    return this.subscriptionClient.request(operation);
  }
}
