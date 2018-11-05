import { ApolloLink } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import builder from '../commons/builder';

export class WebSocketLink extends ApolloLink {
  constructor(paramsOrClient) {
    super();

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      this.subscriptionClient = new SubscriptionClient(
        paramsOrClient.uri,
        paramsOrClient.options,
        getWrappedWebsocket(),
      );
    }
  }

  request(operation) {
    return this.subscriptionClient.request(operation);
  }
}

/**
 * TODO: Remove this function once the PR is merged
 * https://github.com/apollographql/subscriptions-transport-ws/pull/477
 */
function getWrappedWebsocket() {
  const NativeWebSocket = window.WebSocket || window.MozWebSocket;
  const customWs = url => {
    const bearerToken = builder.getBearerToken();
    const token = bearerToken ? bearerToken.split(' ')[1] : null;
    const protocols = ['graphql-ws', token];
    return new NativeWebSocket(url, protocols);
  };
  customWs.OPEN = NativeWebSocket.OPEN;
  customWs.CONNECTING = NativeWebSocket.CONNECTING;
  customWs.CLOSED = NativeWebSocket.CLOSED;

  return customWs;
}
