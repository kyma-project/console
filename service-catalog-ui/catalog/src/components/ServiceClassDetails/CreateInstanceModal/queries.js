import gql from 'graphql-tag';

export const checkInstanceExist = gql`
  query serviceInstance($name: String!, $namespace: String!) {
    serviceInstance(name: $name, namespace: $namespace) {
      name
    }
  }
`;
