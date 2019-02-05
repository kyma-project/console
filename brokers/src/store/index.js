import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createTransformerLink } from 'apollo-client-transform';
import { onError } from 'apollo-link-error';

import builder from './../commons/builder';
import resolvers from './resolvers';
import defaults from './defaults';
import { getURL } from './../commons/api-url';
import { getLinkTransformers } from './transformers';

export function createApolloClient() {
  const graphqlApiUrl = getURL(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

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

  const cache = new InMemoryCache();

  const errorLink = onError(({operation, response, graphQLErrors, networkError}) => {
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
  });

  const stateLink = withClientState({
    cache,
    defaults,
    resolvers,
  });

  const linkTransformers = getLinkTransformers();
  const transformerLink = createTransformerLink(linkTransformers);
  const enhancedAuthHttpLink = transformerLink.concat(authHttpLink);

  const client = new ApolloClient({
    uri: graphqlApiUrl,
    cache,
    link: ApolloLink.from([stateLink, errorLink, enhancedAuthHttpLink]),
    connectToDevTools: true
  });

  return client;
}