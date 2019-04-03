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

export const GET_SERVICE_CLASS = gql`
  query getServiceClass($name: String!, $namespace: String!) {
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
      # clusterDocsTopic {
      #   name
      #   groupName
      #   displayName
      #   description
      #   assets {
      #     name
      #     type
      #     files {
      #       url
      #       metadata
      #     }
      #     status {
      #       phase
      #       reason
      #       message
      #     }
      #   }
      # }
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
      # docsTopic{
      #   name
      #   groupName
      #   assets {
      #     name
      #     type
          
      #   }
      # }
    }
  }
`;
