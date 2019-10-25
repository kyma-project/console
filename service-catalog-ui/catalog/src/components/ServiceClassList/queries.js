import gql from 'graphql-tag';

const serviceClassesQGL = `
  name
  description
  displayName
  externalName
  imageUrl
  providerDisplayName
  tags
  labels
`;

export const getAllServiceClasses = gql`
  query serviceClasses($namespace: String!) {
    clusterServiceClasses {
      ${serviceClassesQGL}
      instances(namespace: $namespace) {
        name
      }
      activated(namespace: $namespace)
    }
    serviceClasses(namespace: $namespace) {
      ${serviceClassesQGL}
      instances {
        name
      }
      activated
    }
  }
`;

const activeTagsFiltersQGL = `
  first
  isMore
  offset
`;

export const FILTERED_CLASSES_QUERY = gql`
  query filteredServiceClasses {
    filteredServiceClasses @client {
      name
      displayName
      externalName
    }
  }
`;

export const FILTERED_CLASSES_COUNTS_QUERY = gql`
  query filteredServiceClassesCounts {
    filteredClassesCounts @client {
      local
      notLocal
    }
  }
`;

export const CLASS_FILTERS_QUERY = gql`
  query serviceClassFilters {
    serviceClassFilters @client {
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
      basic
      provider
      tag
      connectedApplication
    }
  }
`;

export const CLASS_ACTIVE_TAGS_FILTERS_QUERY = gql`
  query activeTagsFilters {
    activeTagsFilters @client {
      basic {
        ${activeTagsFiltersQGL}
      }
      provider {
        ${activeTagsFiltersQGL}
      }
      tag {
        ${activeTagsFiltersQGL}
      }
      connectedApplication {
        ${activeTagsFiltersQGL}
      }
      search
    }
  }
`;
