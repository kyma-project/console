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
`;

const plansQGL = `
  name
  instanceCreateParameterSchema
  displayName
  externalName
`;

const assetGroupQGL = `
  name
  groupName
  displayName
  description
  assets {
    name
    parameters
    type
    files(filterExtensions: $filterExtensions) {
      url
      metadata
    }
  }
`;

export const getServiceClass = gql`
  query getServiceClass($name: String!, $namespace: String!,$filterExtensions: [String!]) {
    clusterServiceClass(name: $name) {
      ${serviceClassQGL}
      plans {
        ${plansQGL}
        relatedClusterServiceClassName
      }
      instances(namespace: $namespace) {
        name
        status {
          type
        }
      }
      activated(namespace: $namespace)
      clusterAssetGroup {
        ${assetGroupQGL} 
      }
    }
    serviceClass(name: $name, namespace: $namespace) {
      ${serviceClassQGL}
      namespace
      plans {
        ${plansQGL}
        namespace
        relatedServiceClassName
      }
      instances {
        name
        status {
          type
        }
      }
      activated
      assetGroup {
        ${assetGroupQGL} 
      }
      clusterAssetGroup {
        ${assetGroupQGL} 
      }
    }
  }
`;
