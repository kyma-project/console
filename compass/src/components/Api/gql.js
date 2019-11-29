import gql from 'graphql-tag';

export const GET_APPLICATION_WITH_API_DEFINITIONS = gql`
  query Application($applicationId: ID!) {
    application(id: $applicationId) {
      name
      id
      apiDefinitions {
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

export const GET_APPLICATION_WITH_EVENT_DEFINITIONS = gql`
  query Application($applicationId: ID!) {
    application(id: $applicationId) {
      name
      id
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

export const DELETE_API_DEFINITION = gql`
  mutation deleteApi($id: ID!) {
    deleteAPIDefinition(id: $id) {
      name
    }
  }
`;

export const DELETE_EVENT_DEFINITION = gql`
  mutation deleteEventApi($id: ID!) {
    deleteEventDefinition(id: $id) {
      name
    }
  }
`;
