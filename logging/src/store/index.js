import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

import builder from './builder';

const GRAPHQL_ENDPOINT = window.clusterConfig.graphqlApiUrl;

export function createApolloClient() {
  const httpLink = createHttpLink({
    uri: GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: builder.getBearerToken() || null,
      },
    };
  });
  const authHttpLink = authLink.concat(httpLink);

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

        if (networkError) console.log(`[Network error]: ${networkError}`);
      }
    },
  );

  const client = new ApolloClient({
    uri: GRAPHQL_ENDPOINT,
    cache,
    link: ApolloLink.from([errorLink, authHttpLink]),
    connectToDevTools: true,
  });

  return client;
}
