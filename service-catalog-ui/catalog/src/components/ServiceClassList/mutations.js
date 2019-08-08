import gql from 'graphql-tag';

export const CLEAR_ACTIVE_FILTERS_MUTATION = gql`
  mutation clearAllActiveFilters {
    clearAllActiveFilters @client
  }
`;

export const SET_ACTIVE_TAGS_FILTERS_MUTATION = gql`
  mutation setActiveTagsFilters($key: String!, $value: String) {
    setActiveTagsFilters(key: $key, value: $value) @client
  }
`;
