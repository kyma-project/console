import gql from 'graphql-tag';

export const UPDATE_EVENT_API = gql`
  mutation updateEventAPI($id: ID!, $in: EventAPIDefinitionInput!) {
    updateEventAPI(id: $id, in: $in) {
      id
      name
    }
  }
`;
