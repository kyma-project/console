import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

import resolvers from './resolvers';
import defaults from './defaults';

import builder from './../commons/builder';
import { getURL } from './../commons/api-url';

export function createApolloClient() {
  const cache = new InMemoryCache();
  const graphqlApiUrl = getURL(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

  const client = new ApolloClient({
    uri: graphqlApiUrl,
    request: async operation => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: builder.getBearerToken() || null,
        },
      }));
    },
    cache: cache,
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log('Apollo GraphQLError:', graphQLErrors);
      }
      if (networkError) {
        console.log('Apollo NetworkError:', networkError);
      }
    },
    clientState: {
      defaults,
      resolvers,
    },
  });

  return client;
}
