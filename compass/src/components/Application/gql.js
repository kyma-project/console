import gql from 'graphql-tag';

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

export const GET_APPLICATIONS = gql`
  query {
    applications(
      filter: [
        {
          label: "group"
          values: ["production", "experimental"]
          operator: ANY
        }
      ]
    ) {
      data {
        id
        name
        description
      }
    }
  }
`;

export const GET_APPLICATION = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id
      description
      name
      labels
      status {
        condition
      }
      apis {
        data {
          id
          name
          description
          targetURL
          spec {
            data
            format
            type
          }
          group
        }
        totalCount
      }
      eventAPIs {
        data {
          id
          name
          description
          spec {
            data
            format
            type
          }
          group
        }
        totalCount
      }
    }
  }
`;
