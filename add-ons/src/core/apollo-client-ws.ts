import { ApolloLink, Operation, Observable, FetchResult } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import appInitializer from './app-initializer';

export class WebSocketLink extends ApolloLink {
  subscriptionClient: SubscriptionClient;

  constructor(paramsOrClient: SubscriptionClient | any) {
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

  request(operation: Operation): Observable<FetchResult> | null {
    return this.subscriptionClient.request(operation) as Observable<
      FetchResult
    >;
  }
}

function getWrappedWebsocket() {
  const w = window as any;
  const NativeWebSocket = w['WebSocket'] || w['MozWebSocket'];
  const customWs: any = (url: string) => {
    const bearerToken = appInitializer.getBearerToken();
    const token = bearerToken ? bearerToken.split(' ')[1] : null;
    const protocols = ['graphql-ws', token];
    return new NativeWebSocket(url, protocols);
  };

  customWs.OPEN = NativeWebSocket.OPEN;
  customWs.CONNECTING = NativeWebSocket.CONNECTING;
  customWs.CLOSED = NativeWebSocket.CLOSED;

  return customWs;
}
