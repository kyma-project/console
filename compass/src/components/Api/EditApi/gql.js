import gql from 'graphql-tag';

export const UPDATE_API = gql`
  mutation updateAPI($id: ID!, $in: APIDefinitionInput!) {
    updateAPI(id: $id, in: $in) {
      id
      name
    }
  }
`;
