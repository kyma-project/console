import React from 'react';
import { graphql, compose } from 'react-apollo';

import {
  ACTIVE_FILTERS_QUERY,
  ALL_FILTERS_QUERY,
  FILTERED_ITEMS_QUERY,
  ALL_ITEMS_QUERY,
} from './queries';
import {
  FILTER_INSTANCES_MUTATION,
  SET_ACTIVE_FILTERS_MUTATION,
  SERVICE_INSTANCES_DELETE_MUTATION,
} from './mutations';

import ServiceInstances from './ServiceInstances.component';

import builder from '../../commons/builder';

const ServiceInstanceContainer = props => {
  return (
    <ServiceInstances
      {...props}
      filterClassesAndSetActiveFilters={(key, value) => {
        console.log('filterClassesAndSetActiveFilters', key, value )
        props.setActiveFilters({ variables: { key, value } });
        props.filterItems();
      }}
    />
  );
};

export default compose(
  graphql(SERVICE_INSTANCES_DELETE_MUTATION, {
    props: ({ mutate }) => ({
      deleteServiceInstance: name =>
        mutate({
          variables: {
            name,
            namespace: builder.getCurrentEnvironmentId(),
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
  graphql(ALL_ITEMS_QUERY, {
    name: 'allItems',
    options: () => ({
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
      },
    }),
  }),
  graphql(FILTERED_ITEMS_QUERY, {
    name: 'filteredItems',
  }),
  graphql(ACTIVE_FILTERS_QUERY, {
    name: 'activeFilters',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(ALL_FILTERS_QUERY, {
    name: 'allFilters',
  }),
)(ServiceInstanceContainer);
