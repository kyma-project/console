import gql from 'graphql-tag';

export const ADD_RUNTIME = gql`
  mutation CreateRuntime($in: RuntimeInput!) {
    createRuntime(in: $in) {
      id
      description
      name
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
