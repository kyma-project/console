import gql from 'graphql-tag';

export const DELETE_NAMESPACE = gql`
  mutation deleteNamespace($name: String!) {
    deleteNamespace(name: $name) {
      name
    }
  }
`;
