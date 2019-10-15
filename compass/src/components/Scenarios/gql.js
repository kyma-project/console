import gql from 'graphql-tag';

export const GET_SCENARIOS_LABEL_SCHEMA = gql`
  query {
    labelDefinition(key: "scenarios") {
      schema
    }
  }
`;

export const CREATE_SCENARIOS_LABEL = gql`
  mutation createLabelDefinition($in: LabelDefinitionInput!) {
    createLabelDefinition(in: $in) {
      key
      schema
    }
  }
`;

export const UPDATE_SCENARIOS = gql`
  mutation updateLabelDefinition($in: LabelDefinitionInput!) {
    updateLabelDefinition(in: $in) {
      key
      schema
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query {
    applications {
      data {
        name
        id
        labels
      }
    }
  }
`;

export const GET_RUNTIMES = gql`
  query {
    runtimes {
      data {
        name
        id
        labels
      }
    }
  }
`;

export const SET_APPLICATION_SCENARIO = gql`
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

export const SET_RUNTIME_SCENARIO = gql`
  mutation setRuntimeLabel($id: ID!, $scenarios: Any!) {
    setRuntimeLabel(runtimeID: $id, key: "scenarios", value: $scenarios) {
      key
      value
    }
  }
`;

export const GET_APPLICATIONS_FOR_SCENARIO = gql`
  query applicationsForScenario($filter: [LabelFilter!]) {
    applications(filter: $filter) {
      data {
        name
        id
        labels
        apis {
          totalCount
        }
        eventAPIs {
          totalCount
        }
      }
    }
  }
`;

export const SET_APPLICATION_SCENARIOS = gql`
  mutation setApplicationLabels($applicationID: ID!, $scenarios: Any!) {
    setApplicationLabel(
      applicationID: $applicationID
      key: "scenarios"
      value: $scenarios
    ) {
      key
      value
    }
  }
`;
