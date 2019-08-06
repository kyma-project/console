import gql from 'graphql-tag';

export const GET_LABEL_DEFINITIONS = gql`
  query {
    labelDefinitions {
      key
      schema
    }
  }
`;

export const GET_LABEL_DEFINITION = gql`
  query($key: String!) {
    labelDefinition(key: $key) {
      key
      schema
    }
  }
`;
