import gql from 'graphql-tag';

export const ADD_RUNTIME = gql`
  mutation CreateRuntime($in: RuntimeInput!) {
    createRuntime(in: $in) {
      id
      name
      description
      labels
    }
  }
`;

export const GET_RUNTIMES = gql`
  query {
    runtimes(
      filter: [
        {
          label: "group"
          values: ["production", "experimental"]
          operator: ANY
        }
      ]
    ) {
      data {
        id
        name
        description
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
      annotations
    }
  }
`;
