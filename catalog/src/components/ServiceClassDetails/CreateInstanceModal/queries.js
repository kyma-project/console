import gql from 'graphql-tag';

export const CHECK_INSTANCE_EXISTS = gql`
  query serviceInstance($name: String!, $environment: String!) {
    serviceInstance(name: $name, environment: $environment) {
      name
    }
  }
`;
