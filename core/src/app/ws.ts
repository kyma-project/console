import { ApolloLink, Operation, Observable, FetchResult } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import * as LuigiClient from '@kyma-project/luigi-client';

export class WebSocketLink extends ApolloLink {
  subscriptionClient: SubscriptionClient;
  constructor(paramsOrClient) {
    super();
    console.log('core ws setup url', paramsOrClient.uri)
    const token = LuigiClient.getEventData().idToken;
    const protocols = ['graphql-ws', token];

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      this.subscriptionClient = new SubscriptionClient(
        paramsOrClient.uri,
        paramsOrClient.options,
        null,
        protocols
      );
    }

  }
  request(operation: Operation): Observable<FetchResult> | null {
    return this.subscriptionClient.request(operation) as Observable<FetchResult>
  }
}
