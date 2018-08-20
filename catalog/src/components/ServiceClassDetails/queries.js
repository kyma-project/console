import gql from 'graphql-tag';

export const GET_SERVICE_CLASS = gql`
  query GetServiceClass($name: String!) {
    serviceClass(name: $name) {
      name
      externalName
      displayName
      creationTimestamp
      description
      documentationUrl
      providerDisplayName
      tags
      content
      apiSpec
      asyncApiSpec
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
