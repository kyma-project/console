import gql from 'graphql-tag';

const serviceClassesQGL = `
  name
  description
  displayName
  externalName
  imageUrl
  activated
  providerDisplayName
  tags
  labels
`;

export const SERVICE_CLASSES_QUERY = gql`
  query serviceClasses($environment: String!) {
    clusterServiceClasses {
      ${serviceClassesQGL}
    }
    serviceClasses(environment: $environment) {
      ${serviceClassesQGL}
    }
  }
`;
