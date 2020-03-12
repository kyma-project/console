import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { withScalars } from 'apollo-link-scalars';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';
import defaults from './defaults';

const COMPASS_GRAPHQL_ENDPOINT = window.clusterConfig.compassApiUrl;

function handleUnauthorized() {
  window.parent.postMessage('unauthorized', '*');
}

export function createApolloClient(schema, authHttpLink) {
  if (!schema) throw Error("Can't create client without schema");

  const typesMap = {
    Labels: {
      serialize: parsed => JSON.stringify(parsed),
      parseValue: raw => JSON.parse(raw),
    },
  };

  const scalarsLink = withScalars({ schema, typesMap });

  const cache = new InMemoryCache();

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError && networkError.statusCode === 401) {
      return handleUnauthorized();
    }

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

  const client = new ApolloClient({
    uri: COMPASS_GRAPHQL_ENDPOINT,
    cache,
    link: ApolloLink.from([stateLink, errorLink, scalarsLink, authHttpLink]),
    connectToDevTools: true,
  });

  return client;
}

export function createAuthHttpLink(tenant, token) {
  const httpLink = createHttpLink({
    uri: COMPASS_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        tenant,
        authorization: token,
      },
    };
  });
  return authLink.concat(httpLink);
}

export async function fetchSchema(link, setSchema) {
  if (!link) return;

  const schema = await introspectSchema(link);
  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });
  setSchema(executableSchema);
}
