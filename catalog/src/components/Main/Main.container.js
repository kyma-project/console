import React from 'react';
import { graphql, compose } from 'react-apollo';

import { SERVICE_CLASSES_QUERY } from './queries';
import {
  FILTER_SERVICE_CLASS_MUTATION,
  SET_ACTIVE_FILTERS_MUTATION,
} from './mutations';

import builder from '../../commons/builder';

import MainPage from './Main.component';

export default compose(
  graphql(SERVICE_CLASSES_QUERY, {
    name: 'serviceClasses',
    options: () => {
      return {
        variables: {
          namespace: builder.getCurrentEnvironmentId(),
        },
        options: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
      };
    },
  }),
  graphql(FILTER_SERVICE_CLASS_MUTATION, {
    name: 'filterClasses',
    options: () => {
      return {
        variables: {
          namespace: builder.getCurrentEnvironmentId(),
        },
      };
    },
  }),
  graphql(SET_ACTIVE_FILTERS_MUTATION, {
    name: 'setActiveFilters',
  }),
)(props => (
  <MainPage
    {...props}
    filterClassesAndSetActiveFilters={(key, value) => {
      props.setActiveFilters({ variables: { key, value } });
      props.filterClasses();
    }}
  />
));
