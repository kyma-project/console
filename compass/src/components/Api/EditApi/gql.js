import gql from 'graphql-tag';

export const UPDATE_API_DEFINITION = gql`
  mutation updateAPIDefinition($id: ID!, $in: APIDefinitionInput!) {
    updateAPIDefinition(id: $id, in: $in) {
      id
      name
    }
  }
`;
