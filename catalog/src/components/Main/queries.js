import gql from 'graphql-tag';

const serviceClassesQGL = `
  name
  description
  displayName
  externalName
  imageUrl
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
      activated(namespace: $namespace)
    }
    serviceClasses(namespace: $namespace) {
      ${serviceClassesQGL}
      instances {
        name
      }
      activated
    }
  }
`;
