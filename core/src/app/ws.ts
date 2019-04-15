import { ApolloLink, FetchResult } from 'apollo-link';
import { SubscriptionClient, Operation } from 'subscriptions-transport-ws';
import LuigiClient from '@kyma-project/luigi-client';

export class WebSocketLink extends ApolloLink {
  subscriptionClient: SubscriptionClient;
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

  request(operation: Operation): FetchResult {
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
    const token = LuigiClient.getEventData().idToken;
    const protocols = ['graphql-ws', token];
    return new NativeWebSocket(url, protocols);
  };
  customWs.OPEN = NativeWebSocket.OPEN;
  customWs.CONNECTING = NativeWebSocket.CONNECTING;
  customWs.CLOSED = NativeWebSocket.CLOSED;

  return customWs;
}
