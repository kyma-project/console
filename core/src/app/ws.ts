import { ApolloLink } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import LuigiClient from '@kyma-project/luigi-client';

export class WebSocketLink extends ApolloLink {
  subscriptionClient: SubscriptionClient;
  constructor(paramsOrClient) {
    super();

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
}
