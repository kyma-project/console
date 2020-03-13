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

export const UPDATE_API_PACKAGE = gql`
  mutation updatePackage($id: ID!, $in: PackageUpdateInput!) {
    updatePackage(id: $id, in: $in) {
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
        defaultInstanceAuth {
          credential {
            ... on OAuthCredentialData {
              clientId
              clientSecret
              url
              __typename
            }
            ... on BasicCredentialData {
              username
              password
              __typename
            }
          }
        }
        instanceAuths {
          id
          context
          inputParams
          status {
            condition
            reason
            message
            timestamp
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
