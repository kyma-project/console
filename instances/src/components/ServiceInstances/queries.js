import gql from 'graphql-tag';
import { SERVICE_INSTANCE_DETAILS_FRAGMENT } from '../DataProvider/fragments';

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

export const ALL_ITEMS_QUERY = gql`
  query allItems($environment: String!) {
    serviceInstances(environment: $environment) @client {
      ...serviceInstanceDetails
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;

export const FILTERED_ITEMS_QUERY = gql`
  query filteredItems {
    filteredItems @client {
      name
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;
