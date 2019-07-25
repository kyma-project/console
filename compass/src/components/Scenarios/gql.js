import gql from 'graphql-tag';

export const GET_SCENARIOS_LABEL_SCHEMA = gql`
  query {
    labelDefinition(key : "scenarios"){
      schema 
    }
  }
`;
