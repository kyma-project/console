import React from 'react';
import { compose, graphql } from 'react-apollo';

import {
  FILTERED_CLASSES_QUERY,
  CLASS_ACTIVE_FILTERS_QUERY,
  CLASS_ACTIVE_TAGS_FILTERS_QUERY,
  CLASS_FILTERS_QUERY,
} from './queries';

import { SET_ACTIVE_TAGS_FILTERS_MUTATION } from './mutations';

import ServiceClassList from './ServiceClassList.component';

import builder from '../../commons/builder';

export default compose(
  graphql(FILTERED_CLASSES_QUERY, {
    name: 'classList',
    options: () => {
      return {
        variables: {
          environment: builder.getCurrentEnvironmentId(),
        },
        options: {
          fetchPolicy: 'cache-and-network',
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
    options: () => {
      return {
        variables: {
          environment: builder.getCurrentEnvironmentId(),
        },
        options: {
          fetchPolicy: 'cache-and-network',
        },
      };
    },
  }),

  graphql(CLASS_ACTIVE_TAGS_FILTERS_QUERY, {
    name: 'activeTagsFilters',
    options: {
      fetchPolicy: 'cache-and-network',
    },
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
