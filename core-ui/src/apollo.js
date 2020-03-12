import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { getApiUrl as getURL } from '@kyma-project/common';
import builder from './commons/builder';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { withScalars } from 'apollo-link-scalars';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

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

export async function createCompassApolloClient() {
  const graphqlApiUrl = getURL('compassApiUrl');

  //TODO: should be removed once management plane API is able to resolve tenant from token
  const tenant = getURL('compassDefaultTenant');

  const httpLink = new HttpLink({
    uri: graphqlApiUrl,
    headers: {
      authorization: builder.getBearerToken() || null,
      tenant,
    },
  });

  const scalarsLink = await createScalarsLink(httpLink);

  return new ApolloClient({
    link: ApolloLink.from([errorLink, scalarsLink, httpLink]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.name || null,
    }),
  });
}

async function createScalarsLink(httpLink) {
  const typesMap = {
    Labels: {
      serialize: parsed => JSON.stringify(parsed),
      parseValue: raw => JSON.parse(raw),
    },
  };

  const schema = await introspectSchema(httpLink);
  const executableSchema = makeRemoteExecutableSchema({
    schema,
    httpLink,
  });

  return withScalars({ schema: executableSchema, typesMap });
}

export function createKymaApolloClient() {
  const graphqlApiUrl = getURL(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

  const httpLink = new HttpLink({
    uri: graphqlApiUrl,
    headers: {
      authorization: builder.getBearerToken() || null,
    },
  });

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
    httpLink,
  );

  return new ApolloClient({
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.name || null,
    }),
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
