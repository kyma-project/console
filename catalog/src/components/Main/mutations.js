import gql from 'graphql-tag';

export const FILTER_SERVICE_CLASS_MUTATION = gql`
  mutation filterServiceClasses {
    filterServiceClasses @client
  }
`;

export const SET_ACTIVE_FILTERS_MUTATION = gql`
  mutation setActiveFilters($key: String!, $value: String) {
    setActiveFilters(key: $key, value: $value) @client
  }
`;
