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
  openApiSpec
  odataSpec
`;

const plansQGL = `
  name
  instanceCreateParameterSchema
  displayName
  externalName
`;

const docsTopic = `
      name
      groupName
      displayName
      description
`;

export const GET_SERVICE_CLASS = gql`
  query getServiceClass($name: String!, $namespace: String!,$filterExtensions: [String!]) {
    clusterServiceClass(name: $name) {
      ${serviceClassQGL}
      plans {
        ${plansQGL}
        relatedClusterServiceClassName
      }
      instances(namespace: $namespace) {
        name
      }
      activated(namespace: $namespace)
      clusterDocsTopic {
        ${docsTopic}
          assets {
             name
             type
             files(filterExtensions: $filterExtensions){
              url
              metadata
          }
        } 
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
      }
      activated
      docsTopic {
         ${docsTopic}
          assets {
             name
             type
             files(filterExtensions: $filterExtensions){
              url
              metadata
          }
        } 
      }
      clusterDocsTopic{
        ${docsTopic}
          assets {
             name
             type
             files(filterExtensions: $filterExtensions){
              url
              metadata
          }
        } 
      }
 
    }
  }
`;
