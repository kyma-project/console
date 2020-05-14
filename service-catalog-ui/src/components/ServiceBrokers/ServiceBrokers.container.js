import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { BROKERS_QUERY } from './queries';
import ServiceBrokers from './ServiceBrokers.component';

import LuigiClient from '@kyma-project/luigi-client';

export default compose(
  graphql(BROKERS_QUERY, {
    name: 'serviceBrokers',
    options: () => ({
      fetchPolicy: 'network-only',
      variables: {
        namespace: LuigiClient.getContext().namespaceId,
      },
    }),
  }),
)(ServiceBrokers);
