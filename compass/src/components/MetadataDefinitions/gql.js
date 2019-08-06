import gql from 'graphql-tag';

export const GET_LABEL_DEFINITIONS = gql`
  query {
    labelDefinitions {
      key
      schema
    }
  }
`;
