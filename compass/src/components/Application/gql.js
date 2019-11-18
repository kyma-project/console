import gql from 'graphql-tag';

export const GET_APPLICATIONS = gql`
  query {
    applications {
      data {
        id
        name
        description
      }
    }
  }
`;

export const GET_APPLICATION = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id
      description
      name
      labels
      healthCheckURL
      status {
        condition
      }
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

export const ADD_API = gql`
  mutation addAPI($applicationID: ID!, $in: APIDefinitionInput!) {
    addAPI(applicationID: $applicationID, in: $in) {
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
  mutation addEventAPI($applicationID: ID!, $in: EventAPIDefinitionInput!) {
    addEventAPI(applicationID: $applicationID, in: $in) {
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

export const DELETE_API = gql`
  mutation deleteAPI($id: ID!) {
    deleteAPI(id: $id) {
      id
      name
      description
    }
  }
`;

export const DELETE_EVENT_API = gql`
  mutation deleteEventAPI($id: ID!) {
    deleteEventAPI(id: $id) {
      id
      name
      description
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
      id
    }
  }
`;

export const CONNECT_APPLICATION = gql`
  mutation generateOneTimeTokenForApplication($id: ID!) {
    generateOneTimeTokenForApplication(id: $id) {
      token
      connectorURL
    }
  }
`;
