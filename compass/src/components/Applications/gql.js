import gql from 'graphql-tag';

export const GET_APPLICATIONS = gql`
  query {
    applications {
      data {
        id
        providerName
        name
        description
        labels
        status {
          condition
        }
        packages {
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
      providerName
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
      providerName
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

export const GET_TEMPLATES = gql`
  query applicationTemplates {
    applicationTemplates {
      data {
        id
        name
        applicationInput
        placeholders {
          name
          description
        }
      }
    }
  }
`;

export const REGISTER_APPLICATION_FROM_TEMPLATE = gql`
  mutation registerApplicationFromTemplate($in: ApplicationFromTemplateInput!) {
    registerApplicationFromTemplate(in: $in) {
      name
    }
  }
`;
