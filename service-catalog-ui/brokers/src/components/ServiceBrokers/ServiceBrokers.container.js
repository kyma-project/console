import { compose, graphql } from 'react-apollo';
import { BROKERS_QUERY } from './queries';
import ServiceBrokers from './ServiceBrokers.component';

import builder from '../../commons/builder';

export default compose(
  graphql(BROKERS_QUERY, {
    name: 'serviceBrokers',
    options: () => ({
      fetchPolicy: 'network-only',
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
      },
    }),
  }),
)(ServiceBrokers);
