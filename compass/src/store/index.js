import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

import { COMPASS_GRAPHQL_ENDPOINT } from '../config/config';
import builder from '../commons/builder';

import resolvers from './resolvers';
import defaults from './defaults';

export function createApolloClient() {
  const httpLink = createHttpLink({ uri: COMPASS_GRAPHQL_ENDPOINT });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        tenant: builder.getTenant(),
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

  const stateLink = withClientState({
    cache,
    defaults,
    resolvers,
  });

  const client = new ApolloClient({
    uri: COMPASS_GRAPHQL_ENDPOINT,
    cache,
    link: ApolloLink.from([stateLink, errorLink, authHttpLink]),
    connectToDevTools: true,
    resolvers: {},
  });

  return client;
}
