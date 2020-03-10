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
          apiDefinitions {
            totalCount
          }
          eventDefinitions {
            totalCount
          }
        }
      }
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
