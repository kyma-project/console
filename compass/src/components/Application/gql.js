import gql from 'graphql-tag';

export const GET_APPLICATIONS = gql`
  query {
    applications {
      data {
        id
        name
        providerName
        description
      }
    }
  }
`;

export const GET_APPLICATION = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id
      providerName
      description
      name
      labels
      healthCheckURL
      status {
        condition
      }
      packages {
        data {
          id
          name
          description
          defaultInstanceAuth {
            credential {
              __typename
            }
          }
        }
      }
    }
  }
`;

export const ADD_API = gql`
  mutation addAPIDefinition($apiPackageId: ID!, $in: APIDefinitionInput!) {
    addAPIDefinitionToPackage(packageID: $apiPackageId, in: $in) {
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
  }
`;

export const ADD_EVENT_API = gql`
  mutation addEventDefinition($apiPackageId: ID!, $in: EventDefinitionInput!) {
    addEventDefinitionToPackage(packageID: $apiPackageId, in: $in) {
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
  }
`;

export const SET_APPLICATION_SCENARIOS = gql`
  mutation setApplicationLabel($id: ID!, $scenarios: Any!) {
    setApplicationLabel(
      applicationID: $id
      key: "scenarios"
      value: $scenarios
    ) {
      key
      value
    }
  }
`;

export const UPDATE_APPLICATION = gql`
  mutation updateApplication($id: ID!, $in: ApplicationUpdateInput!) {
    updateApplication(id: $id, in: $in) {
      name
      providerName
      id
    }
  }
`;

export const CONNECT_APPLICATION = gql`
  mutation requestOneTimeTokenForApplication($id: ID!) {
    requestOneTimeTokenForApplication(id: $id) {
      rawEncoded
      legacyConnectorURL
    }
  }
`;
