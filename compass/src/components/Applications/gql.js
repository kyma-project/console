import gql from 'graphql-tag';

export const GET_APPLICATIONS = gql`
  query {
    applications {
      data {
        id
        name
        description
        labels
        status {
          condition
        }
        apis {
          totalCount
        }
        eventAPIs {
          totalCount
        }
      }
    }
  }
`;

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

export const DELETE_APPLICATION_MUTATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
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
