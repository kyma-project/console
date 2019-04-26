import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { createTransformerLink } from 'apollo-client-transform';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from './apollo-client-ws';

import appInitializer from './app-initializer';

function getGraphQLEndpoint(endpoint: string): string {
  const config = {
    graphqlApiUrlLocal: 'http://localhost:3000/graphql',
    subscriptionsApiUrlLocal: 'ws://localhost:3000/graphql',
  };

  const clusterConfig = (window as any)['clusterConfig'];
  return { ...clusterConfig, ...config }[endpoint];
}

export function createApolloClient() {
  const graphqlApiUrl = getGraphQLEndpoint(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

  const httpLink = createHttpLink({ uri: graphqlApiUrl });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: appInitializer.getBearerToken() || null,
      },
    };
  });

  const subscriptionsApiUrl = getGraphQLEndpoint(
    process.env.REACT_APP_LOCAL_API
      ? 'subscriptionsApiUrlLocal'
      : 'subscriptionsApiUrl',
  );
  const wsLink = new WebSocketLink({
    uri: subscriptionsApiUrl,
    options: {
      reconnect: true,
    },
  });
  const cache = new InMemoryCache();

  const authHttpLink = authLink.concat(httpLink);
  const errorLink = onError(
    ({ operation, response, graphQLErrors, networkError }) => {
      if (process.env.REACT_APP_ENV !== 'production') {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            // tslint:disable-next-line
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        }

        // tslint:disable-next-line
        if (networkError) console.error(`[Network error]: ${networkError}`);
      }
    },
  );
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authHttpLink,
  );

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, link]),
    cache,
    connectToDevTools: true,
  });

  return client;
}
