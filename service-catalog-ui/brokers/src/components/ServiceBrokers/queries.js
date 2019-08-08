import gql from 'graphql-tag';

export const BROKERS_QUERY = gql`
  query ServiceBrokers($namespace: String!) {
    serviceBrokers(namespace: $namespace) {
      name
      namespace
      creationTimestamp
      url
      labels
      status {
        ready
        reason
        message
      }
    }
  }
`;
