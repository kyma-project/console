import gql from 'graphql-tag';

export const GET_SERVICE_CLASS = gql`
  query GetServiceClass($name: String!) {
    serviceClass(name: $name) {
      name
      externalName
      displayName
      creationTimestamp
      description
      longDescription
      documentationUrl
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
        relatedServiceClassName
        externalName
      }
    }
  }
`;
