import gql from 'graphql-tag';

export const SERVICE_CLASSES_QUERY = gql`
  query serviceClasses {
    serviceClasses {
      name
      description
      displayName
      externalName
      imageUrl
      activated
      providerDisplayName
      tags
    }
  }
`;
