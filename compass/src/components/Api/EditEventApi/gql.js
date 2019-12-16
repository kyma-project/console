import gql from 'graphql-tag';

export const UPDATE_EVENT_DEFINITION = gql`
  mutation updateEventDefinition($id: ID!, $in: EventDefinitionInput!) {
    updateEventDefinition(id: $id, in: $in) {
      id
      name
    }
  }
`;
