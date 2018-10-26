import gql from 'graphql-tag';

const serviceClassQGL = `
  displayName
  externalName
  name
`;

const servicePlanQGL = `
  displayName
  externalName
  name
`;

export const SERVICE_INSTANCES_QUERY = gql`
  query ServiceInstances($environment: String!) {
    serviceInstances(environment: $environment) {
      name
      labels
      planSpec
      status {
        type
        message
      }
      serviceClass {
        ${serviceClassQGL}
      }
      clusterServiceClass {
        ${serviceClassQGL}
      }
      servicePlan {
        ${servicePlanQGL}
      }
      clusterServicePlan {
        ${servicePlanQGL}
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
    }
  }
`;
