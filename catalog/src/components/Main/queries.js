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
  instances {
    name
  }
`;

export const SERVICE_CLASSES_QUERY = gql`
  query serviceClasses($namespace: String!) {
    clusterServiceClasses {
      ${serviceClassesQGL}
    }
    serviceClasses(namespace: $namespace) {
      ${serviceClassesQGL}
    }
  }
`;
