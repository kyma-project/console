import { ApolloLink, Operation, Observable, FetchResult } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { appInitializer } from '../core';

export class WebSocketLink extends ApolloLink {
  subscriptionClient: SubscriptionClient;

  constructor(paramsOrClient: SubscriptionClient | any) {
    super();

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      const bearerToken = appInitializer.getBearerToken();
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

  request(operation: Operation): Observable<FetchResult> | null {
    return this.subscriptionClient.request(operation) as Observable<
      FetchResult
    >;
  }
}
