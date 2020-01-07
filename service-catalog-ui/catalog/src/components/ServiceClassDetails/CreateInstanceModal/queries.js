import gql from 'graphql-tag';

export const checkInstanceExist = gql`
  query serviceInstances($namespace: String!) {
    serviceInstances(namespace: $namespace) {
      name
    }
  }
`;
