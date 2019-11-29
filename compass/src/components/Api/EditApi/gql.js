import gql from 'graphql-tag';

export const GET_API_DATA = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id
      name
      apiDefinitions {
        data {
          id
          name
          description
          targetURL
          defaultAuth {
            credential {
              ... on OAuthCredentialData {
                clientId
                clientSecret
                url
              }
            }
          }
          spec {
            data
            format
            type
          }
          group
        }
        totalCount
      }
      eventDefinitions {
        data {
          id
          name
          description
          spec {
            data
            format
            type
          }
          group
        }
        totalCount
      }
    }
  }
`;

export const UPDATE_API_DEFINITION = gql`
  mutation updateAPIDefinition($id: ID!, $in: APIDefinitionInput!) {
    updateAPIDefinition(id: $id, in: $in) {
      id
      name
    }
  }
`;

export const UPDATE_EVENT_DEFINITION = gql`
  mutation updateEventDefinition($id: ID!, $in: EventDefinitionInput!) {
    updateEventDefinition(id: $id, in: $in) {
      id
      name
    }
  }
`;
