import gql from 'graphql-tag';

export const GET_APPLICATION = gql`
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
