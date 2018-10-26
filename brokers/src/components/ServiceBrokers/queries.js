import gql from 'graphql-tag';

export const BROKERS_QUERY = gql`
  query ServiceBrokers($environment: String!) {
    serviceBrokers(environment: $environment) {
      name
      environment
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
