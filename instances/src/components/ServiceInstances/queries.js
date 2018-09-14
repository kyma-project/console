import gql from 'graphql-tag';

export const SERVICE_INSTANCES_QUERY = gql`
  query ServiceInstances($environment: String!) {
    serviceInstances(environment: $environment) {
      name
      labels
      servicePlanSpec
      status {
        type
        message
      }
      serviceClass {
        displayName
        externalName
        name
      }
      servicePlan {
        displayName
        externalName
        name
      }
      serviceBindingUsages {
        name
      }
    }
  }
`;

export const ACTIVE_FILTERS_QUERY = gql`
  query activeFilters {
    activeFilters @client {
      search
      labels
    }
  }
`;

export const ALL_FILTERS_QUERY = gql`
  query allFilters {
    allFilters @client {
      name
      values @client {
        name
        value
        count
      }
    }
  }
`;

export const FILTERED_ITEMS_QUERY = gql`
  query filteredItems {
    filteredItems @client {
      name
      labels
      status {
        type
        message
      }
      serviceClass {
        displayName
        externalName
        name
      }
      servicePlan {
        displayName
        externalName
        name
      }
    }
  }
`;
