import React from 'react';
import { compose, graphql } from 'react-apollo';

import {
  FILTERED_CLASSES_QUERY,
  CLASS_ACTIVE_FILTERS_QUERY,
  CLASS_ACTIVE_TAGS_FILTERS_QUERY,
  CLASS_FILTERS_QUERY,
  FILTERED_CLASSES_COUNTS_QUERY,
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
  graphql(FILTERED_CLASSES_COUNTS_QUERY, {
    name: 'filteredClassesCounts',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
)(props => <ServiceClassList {...props} />);
