import gql from 'graphql-tag';

export const GET_APPLICATIONS = gql`
  query {
    applications {
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

export const SET_APPLICATION_SCENARIOS = gql`
  mutation setApplicationLabel($id: ID!, $scenarios: Any!) {
    setApplicationLabel(
      applicationID: $id
      key: "scenarios"
      value: $scenarios
    ) {
      key
      value
    }
  }
`;
