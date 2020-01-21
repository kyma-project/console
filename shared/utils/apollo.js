import { MockLink, MockSubscriptionLink } from '@apollo/react-testing';
import { ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

export function isSubscriptionOperation({ query }) {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  );
}

export function createMockLink(mocks, addTypename = true) {
  const subscriptionLink = new MockSubscriptionLink();
  const link = ApolloLink.split(
    isSubscriptionOperation,
    subscriptionLink,
    new MockLink(mocks, addTypename),
  );
  return {
    link,
    sendEvent: subscriptionLink.simulateResult.bind(subscriptionLink),
  };
}
