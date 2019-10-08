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

// todo https://stackoverflow.com/questions/52366794/apollo-client-how-to-insert-a-fragment-in-a-gql-template
// todo https://www.apollographql.com/docs/react/data/fragments/
export const GET_APPLICATIONS_AND_SCENARIO_APPLICATIONS = gql`
  query getApplicationsAndScenarioApplications($filter: [LabelFilter!]) {
    scenarioApplications: applications(filter: $filter) {
      data {
        name
        id
        apis {
          totalCount
        }
        eventAPIs {
          totalCount
        }
      }
    }
    applications: applications {
      data {
        name
        id
        apis {
          totalCount
        }
        eventAPIs {
          totalCount
        }
        labels
      }
    }
  }
`;

// export const GET_RUNTIMES_AND_SCENARIO_RUNTIMES = gql`
// query {
//   runtimes {
//     data {
//       name
//       id
//       labels
//     }
//   }
// }
// `;

// export const REMOVE_APPLICATION_FROM_SCENARIO = gql`{
//   mutation removeApplicationFromScenario($applicationId: ID!, $scenarioName: String!) {
//     deleteApplicationLabel(id: $applicationId, key: $scenarioName) {
//       name
//     }
//   }
// }`;

// export const REMOVE_RUNTIME_FROM_SCENARIO = gql`{
//   mutation removeRuntimeFromScenario($runtimeId: ID!, $scenarioName: String!) {
//     deleteRuntimeLabel(id: $runtimeId, key: $scenarioName) {
//       name
//     }
//   }
// }`;
