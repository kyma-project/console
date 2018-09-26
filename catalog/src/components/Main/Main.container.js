import React from 'react';
import { graphql, compose } from 'react-apollo';

import { SERVICE_CLASSES_QUERY } from './queries';
import {
  FILTER_SERVICE_CLASS_MUTATION,
  SET_ACTIVE_FILTERS_MUTATION,
} from './mutations';

import MainPage from './Main.component';

export default compose(
  graphql(SERVICE_CLASSES_QUERY, {
    name: 'clusterServiceClasses',
    options: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  }),
  graphql(FILTER_SERVICE_CLASS_MUTATION, {
    name: 'filterClasses',
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
