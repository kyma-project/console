import gql from 'graphql-tag';

export const CHECK_INSTANCE_EXISTS = gql`
  query serviceInstance($name: String!, $namespace: String!) {
    serviceInstance(name: $name, namespace: $namespace) {
      name
    }
  }
`;
