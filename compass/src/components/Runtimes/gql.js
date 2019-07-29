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

// TODO: add filtering, pagination etc.
export const GET_RUNTIMES = gql`
  query {
    runtimes {
      data {
        id
        name
        description
      }
    }
  }
`;

// no pagination, filtering etc. Just all names.
export const GET_ALL_RUNTIME_NAMES = gql`
  query {
    runtimes {
      data {
        name
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
