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
