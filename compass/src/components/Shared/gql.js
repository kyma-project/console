import gql from 'graphql-tag';

export const GET_SCENARIOS = gql`
  query {
    scenarios: labelDefinition(key: "scenarios") {
      schema
    }
  }
`;
