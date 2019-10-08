import { MockLink, MockSubscriptionLink } from '@apollo/react-testing';
import { isSubscriptionOperation } from '../store';
import { ApolloLink } from 'apollo-link';

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
