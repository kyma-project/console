import React from 'react';
import { graphql, compose } from 'react-apollo';

import {
  SERVICE_INSTANCES_QUERY,
  ACTIVE_FILTERS_QUERY,
  ALL_FILTERS_QUERY,
  FILTERED_ITEMS_QUERY,
} from './queries';
import {
  FILTER_INSTANCES_MUTATION,
  SET_ACTIVE_FILTERS_MUTATION,
  SERVICE_INSTANCES_DELETE_MUTATION,
} from './mutations';

import ServiceInstances from './ServiceInstances.component';

import builder from '../../commons/builder';

export default compose(
  graphql(SERVICE_INSTANCES_QUERY, {
    name: 'serviceInstances',
    options: () => ({
      fetchPolicy: 'network-only',
      variables: {
        environment: builder.getCurrentEnvironmentId(),
      },
    }),
  }),
  graphql(SERVICE_INSTANCES_DELETE_MUTATION, {
    props: ({ mutate }) => ({
      deleteServiceInstance: name =>
        mutate({
          variables: {
            name,
            environment: builder.getCurrentEnvironmentId(),
          },
        }),
    }),
  }),
  graphql(FILTER_INSTANCES_MUTATION, {
    name: 'filterItems',
  }),
  graphql(SET_ACTIVE_FILTERS_MUTATION, {
    name: 'setActiveFilters',
  }),
)(
  compose(
    graphql(FILTERED_ITEMS_QUERY, {
      name: 'filteredItems',
      options: {
        fetchPolicy: 'cache-and-network',
      },
    }),
    graphql(ACTIVE_FILTERS_QUERY, {
      name: 'activeFilters',
      options: {
        fetchPolicy: 'cache-and-network',
      },
    }),
    graphql(ALL_FILTERS_QUERY, {
      name: 'allFilters',
      options: {
        fetchPolicy: 'cache-and-network',
      },
    }),
  )(props => (
    <ServiceInstances
      {...props}
      filterClassesAndSetActiveFilters={(key, value) => {
        props.setActiveFilters({ variables: { key, value } });
        props.filterItems();
      }}
    />
  )),
);
