import gql from 'graphql-tag';

export const GET_RUNTIMES = gql`
  query GetRuntimes($after: PageCursor) {
    runtimes(first: 30, after: $after) {
      data {
        id
        name
        description
        status {
          condition
        }
        labels
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
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
