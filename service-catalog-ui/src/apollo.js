import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { getApiUrl as getURL } from '@kyma-project/common';
import builder from './builder';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

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
    response.errors = null;
  },
);

export function createKymaApolloClient() {
  const graphqlApiUrl = getURL(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

  const httpLink = createHttpLink({
    uri: graphqlApiUrl,
  });

  const authLink = setContext((_, { oldHeaders }) => {
    const newHeaders = {
      ...oldHeaders,
      authorization: builder.getBearerToken() || null,
    };
    return {
      headers: newHeaders,
    };
  });
  const authHttpLink = authLink.concat(httpLink);

  const wsLink = new WebSocketLink({
    uri: getURL('subscriptionsApiUrl'),
    options: {
      reconnect: true,
    },
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authHttpLink,
  );

  return new ApolloClient({
    uri: graphqlApiUrl,
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.name || null,
    }),
    defaultOptions: {
      query: { fetchPolicy: 'cache-and-network' },
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
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
