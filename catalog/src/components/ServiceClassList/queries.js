import gql from 'graphql-tag';

export const FILTERED_CLASSES_QUERY = gql`
  query filteredServiceClasses {
    filteredServiceClasses @client {
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

export const CLASS_FILTERS_QUERY = gql`
  query clusterServiceClassFilters {
    clusterServiceClassFilters @client {
      name
      isMore
      values @client {
        name
        value
        count
      }
    }
  }
`;

export const CLASS_ACTIVE_FILTERS_QUERY = gql`
  query activeServiceClassFilters {
    activeServiceClassFilters @client {
      provider
      tag
    }
  }
`;

export const CLASS_ACTIVE_TAGS_FILTERS_QUERY = gql`
  query activeTagsFilters {
    activeTagsFilters @client {
      provider {
        first
        isMore
        offset
      }
      tag {
        first
        isMore
        offset
      }
      search
    }
  }
`;
