import gql from "graphql-tag";

export const CREATE_APPLICATION_MUTATION = gql`
  mutation createApplication($in: ApplicationInput!) {
    createApplication(in: $in) {
      name
      description
      labels
      id
    }
  }
`;
