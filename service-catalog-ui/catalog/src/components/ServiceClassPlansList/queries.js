import gql from 'graphql-tag';

const serviceClassGQL = `
  name
  externalName
  displayName
  labels
`;

const plansGQL = `
  name
  description
  displayName
  externalName
  clusterAssetGroup{
    assets{
      type
    }
  }
`;

export const getServiceClassPlans = gql`
  query getServiceClassPlans($name: String!, $namespace: String!) {
    clusterServiceClass(name: $name) {
      ${serviceClassGQL}
      plans {
        ${plansGQL}
        relatedClusterServiceClassName
      }
    }
    serviceClass(name: $name, namespace: $namespace) {
      ${serviceClassGQL}
      namespace
      plans {
        ${plansGQL}
        namespace
        relatedServiceClassName
        assetGroup{
            assets{
              type
            }
          }
      }
    }
  }
`;
