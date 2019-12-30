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
        apiDefinitions {
          totalCount
        }
        eventDefinitions {
          totalCount
        }
      }
    }
  }
`;

export const REGISTER_APPLICATION_MUTATION = gql`
  mutation registerApplication($in: ApplicationRegisterInput!) {
    registerApplication(in: $in) {
      name
      description
      labels
      id
    }
  }
`;

export const UNREGISTER_APPLICATION_MUTATION = gql`
  mutation unregisterApplication($id: ID!) {
    unregisterApplication(id: $id) {
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
