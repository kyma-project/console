import gql from 'graphql-tag';

export const GET_API_DATA = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id
      name
      apis {
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
      eventAPIs {
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

export const UPDATE_API = gql`
  mutation updateAPI($id: ID!, $in: APIDefinitionInput!) {
    updateAPI(id: $id, in: $in) {
      id
      name
    }
  }
`;

export const UPDATE_EVENT_API = gql`
  mutation updateEventAPI($id: ID!, $in: EventAPIDefinitionInput!) {
    updateEventAPI(id: $id, in: $in) {
      id
      name
    }
  }
`;
