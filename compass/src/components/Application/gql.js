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
`;

export const ADD_API = gql`
  mutation addAPI($applicationID: ID!, $in: APIDefinitionInput!) {
    addAPIDefinition(applicationID: $applicationID, in: $in) {
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
  mutation addEventDefinition($applicationID: ID!, $in: EventDefinitionInput!) {
    addEventDefinition(applicationID: $applicationID, in: $in) {
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
    deleteAPIDefinition(id: $id) {
      id
      name
      description
    }
  }
`;

export const DELETE_EVENT_API = gql`
  mutation deleteEventAPI($id: ID!) {
    deleteEventDefinition(id: $id) {
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
  mutation requestOneTimeTokenForApplication($id: ID!) {
    requestOneTimeTokenForApplication(id: $id) {
      token
      connectorURL
    }
  }
`;
