import gql from 'graphql-tag';

export const SERVICE_CLASSES_QUERY = gql`
  query clusterServiceClasses {
    clusterServiceClasses {
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
