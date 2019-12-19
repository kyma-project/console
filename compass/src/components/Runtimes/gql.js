import gql from 'graphql-tag';

export const REGISTER_RUNTIME = gql`
  mutation RegisterRuntime($in: RuntimeInput!) {
    registerRuntime(in: $in) {
      id
      name
      labels
    }
  }
`;

export const UNREGISTER_RUNTIME = gql`
  mutation UnregisterRuntime($id: ID!) {
    unregisterRuntime(id: $id) {
      id
      name
      labels
    }
  }
`;

// TODO: add filtering, pagination etc.
export const GET_RUNTIMES = gql`
  query {
    runtimes {
      data {
        id
        name
        description
        status {
          condition
        }
        labels
      }
    }
  }
`;

export const GET_RUNTIME = gql`
  query Runtime($id: ID!) {
    runtime(id: $id) {
      id
      name
      description
      status {
        condition
      }
      labels
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

export const DELETE_SCENARIO_LABEL = gql`
  mutation deleteRuntimeLabel($id: ID!) {
    deleteRuntimeLabel(runtimeID: $id, key: "scenarios") {
      key
      value
    }
  }
`;
