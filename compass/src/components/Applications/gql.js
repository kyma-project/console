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

export const CHECK_APPLICATION_EXISTS = gql`
  query applications($filter: [LabelFilter!]) {
    applications(filter: $filter) {
      data {
        name
      }
    }
  }
`;
