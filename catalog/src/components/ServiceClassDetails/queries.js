import gql from 'graphql-tag';

const serviceClassQGL = `
  name
  externalName
  displayName
  creationTimestamp
  description
  longDescription
  documentationUrl
  supportUrl
  imageUrl
  providerDisplayName
  tags
  labels
  content
  asyncApiSpec
  apiSpec
`;

const plansQGL = `
  name
  instanceCreateParameterSchema
  displayName
  externalName
`;

export const GET_SERVICE_CLASS = gql`
  query getServiceClass($name: String!, $environment: String!) {
    clusterServiceClass(name: $name) {
      ${serviceClassQGL}
      plans {
        ${plansQGL}
        relatedClusterServiceClassName
      }
    }
    serviceClass(name: $name, environment: $environment) {
      ${serviceClassQGL}
      environment
      plans {
        ${plansQGL}
        environment
        relatedServiceClassName
      }
    }
  }
`;
