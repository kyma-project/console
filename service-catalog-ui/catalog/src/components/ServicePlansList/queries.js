import gql from 'graphql-tag';

const serviceClassQGL = `
  name
  externalName
  displayName
  labels
`;

const plansQGL = `
  name
  displayName
  externalName
`;

export const getServiceClassPlans = gql`
  query getServiceClassPlans($name: String!, $namespace: String!) {
    clusterServiceClass(name: $name) {
      ${serviceClassQGL}
      plans {
        ${plansQGL}
        relatedClusterServiceClassName
      }

      activated(namespace: $namespace)
    }
    serviceClass(name: $name, namespace: $namespace) {
      ${serviceClassQGL}
      namespace
      plans {
        ${plansQGL}
        namespace
        relatedServiceClassName
      }
      activated
    }
  }
`;
