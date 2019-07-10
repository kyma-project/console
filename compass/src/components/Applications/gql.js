import gql from "graphql-tag";

export const GET_APPLICATIONS = gql`
  query {
    applications {
      data {
        id
        name
        description
        labels
      }
    }
  }
`;
