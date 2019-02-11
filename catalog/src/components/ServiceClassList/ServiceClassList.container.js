import React from 'react';
import { compose, graphql } from 'react-apollo';

import {
  FILTERED_CLASSES_QUERY,
  CLASS_ACTIVE_FILTERS_QUERY,
  CLASS_ACTIVE_TAGS_FILTERS_QUERY,
  CLASS_FILTERS_QUERY,
} from './queries';

import {
  CLEAR_ACTIVE_FILTERS_MUTATION,
  SET_ACTIVE_TAGS_FILTERS_MUTATION,
} from './mutations';

import ServiceClassList from './ServiceClassList.component';

import builder from '../../commons/builder';

export default compose(
  graphql(FILTERED_CLASSES_QUERY, {
    name: 'classList',
    options: () => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          namespace: builder.getCurrentEnvironmentId(),
        },
      };
    },
  }),
  graphql(CLASS_ACTIVE_FILTERS_QUERY, {
    name: 'activeClassFilters',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(CLASS_FILTERS_QUERY, {
    name: 'classFilters',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),

  graphql(CLASS_ACTIVE_TAGS_FILTERS_QUERY, {
    name: 'activeTagsFilters',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(CLEAR_ACTIVE_FILTERS_MUTATION, {
    name: 'clearAllActiveFilters',
  }),
  graphql(SET_ACTIVE_TAGS_FILTERS_MUTATION, {
    name: 'setActiveTagsFilters',
  }),
)(props => (
  <ServiceClassList
    {...props}
    filterTagsAndSetActiveFilters={(key, value) => {
      props.setActiveTagsFilters({ variables: { key, value } });
    }}
  />
));
