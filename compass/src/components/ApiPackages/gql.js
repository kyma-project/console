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

//todo tego chyba tez nie trzeba calego?
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
        defaultInstanceAuth {
          credential {
            __typename
          }
        }
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
  }
`;
