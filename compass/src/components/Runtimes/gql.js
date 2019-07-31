import gql from 'graphql-tag';

export const ADD_RUNTIME = gql`
  mutation CreateRuntime($in: RuntimeInput!) {
    createRuntime(in: $in) {
      id
      name
      labels
    }
  }
`;

export const DELETE_RUNTIME = gql`
  mutation DeleteRuntime($id: ID!) {
    deleteRuntime(id: $id) {
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
