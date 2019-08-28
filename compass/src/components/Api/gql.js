import gql from 'graphql-tag';

export const GET_APPLICATION_WITH_APIS = gql`
  query Application($applicationId: ID!) {
    application(id: $applicationId) {
      name
      id
      apis {
        data {
          id
          name
          description
          targetURL
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

export const GET_APPLICATION_WITH_EVENT_APIS = gql`
  query Application($applicationId: ID!) {
    application(id: $applicationId) {
      name
      id
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

export const DELETE_API = gql`
  mutation deleteApi($id: ID!) {
    deleteAPI(id: $id) {
      name
    }
  }
`;

export const DELETE_EVENT_API = gql`
  mutation deleteEventApi($id: ID!) {
    deleteEventAPI(id: $id) {
      name
    }
  }
`;
