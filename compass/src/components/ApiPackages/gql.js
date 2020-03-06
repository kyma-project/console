import gql from 'graphql-tag';

export const CREATE_API_PACKAGE = gql`
  mutation addPackage($applicationId: ID!, $in: PackageCreateInput!) {
    addPackage(applicationID: $applicationId, in: $in) {
      name
    }
  }
`;
