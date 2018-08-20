import { compose, graphql } from 'react-apollo';

import {
  FILTERED_CLASSES_QUERY,
  CLASS_ACTIVE_FILTERS_QUERY,
  CLASS_FILTERS_QUERY,
} from './queries';

import ServiceClassList from './ServiceClassList.component';

export default compose(
  graphql(FILTERED_CLASSES_QUERY, {
    name: 'classList',
    options: {
      fetchPolicy: 'cache-and-network',
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
)(ServiceClassList);
