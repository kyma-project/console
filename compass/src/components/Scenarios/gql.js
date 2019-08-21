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

export const SET_RUNTIME_SCENARIOS = gql`
  mutation setRuntimeLabel($id: ID!, $scenarios: Any!) {
    setRuntimeLabel(runtimeID: $id, key: "scenarios", value: $scenarios) {
      key
      value
    }
  }
`;
