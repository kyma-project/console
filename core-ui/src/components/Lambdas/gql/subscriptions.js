import gql from 'graphql-tag';

export const EVENT_TRIGGER_EVENT_SUBSCRIPTION = gql`
  subscription triggerEvent($namespace: String!, $subscriber: SubscriberInput) {
    triggerEvent(namespace: $namespace, subscriber: $subscriber) {
      type
      trigger {
        name
        namespace
        broker
        filterAttributes
        status {
          reason
          status
        }
      }
    }
  }
`;
