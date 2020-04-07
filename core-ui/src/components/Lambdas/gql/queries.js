import gql from 'graphql-tag';

export const GET_EVENT_ACTIVATIONS = gql`
  query EventActivations($namespace: String!) {
    eventActivations(namespace: $namespace) {
      name
      displayName
      sourceId
      events {
        eventType
        version
        description
        schema
      }
    }
  }
`;

export const GET_EVENT_TRIGGERS = gql`
  query EventTriggers($namespace: String!, $subscriber: SubscriberInput) {
    triggers(namespace: $namespace, subscriber: $subscriber) {
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
`;
