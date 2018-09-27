import gql from 'graphql-tag';

export const GET_SERVICE_CLASS = gql`
  query GetServiceClass($name: String!) {
    clusterServiceClass(name: $name) {
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
      content
      asyncApiSpec
      apiSpec
      plans {
        name
        instanceCreateParameterSchema
        displayName
        relatedClusterServiceClassName
        externalName
      }
    }
  }
`;
