import gql from 'graphql-tag';

export const DELETE_API_PACKAGE = gql`
  mutation deletePackage($id: ID!) {
    deletePackage(id: $id) {
      id
    }
  }
`;

export const CREATE_API_PACKAGE = gql`
  mutation addPackage($applicationId: ID!, $in: PackageCreateInput!) {
    addPackage(applicationID: $applicationId, in: $in) {
      name
    }
  }
`;

export const GET_API_PACKAGE = gql`
  query Application($applicationId: ID!, $apiPackageId: ID!) {
    application(id: $applicationId) {
      name
      id
      package(id: $apiPackageId) {
        id
        name
        description
        instanceAuthRequestInputSchema
        instanceAuths {
          id
          auth {
            credential {
              __typename
            }
          }
          status {
            condition
            reason
            message
          }
        }
        apiDefinitions {
          data {
            id
            name
            description
            targetURL
          }
        }
        eventDefinitions {
          data {
            id
            name
            description
          }
        }
      }
    }
  }
`;
