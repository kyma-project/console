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
  query serviceClasses($namespace: String!) {
    clusterServiceClasses {
      ${serviceClassesQGL}

  instances(namespace: $namespace) {
    name
  }
    }
    serviceClasses(namespace: $namespace) {
      ${serviceClassesQGL}

  instances {
    name
  }
    }
  }
`;
