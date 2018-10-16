import { compose, graphql } from 'react-apollo';
import { BROKERS_QUERY } from './queries';
import { prepareTopicsList } from '../../commons/yaml.js';
import builder from '../../../../instances/src/commons/builder';
import ServiceBrokers from './ServiceBrokers.component';

export default compose(
  graphql(BROKERS_QUERY, {
    name: 'serviceInstances',
    options: () => ({
      fetchPolicy: 'network-only',
      variables: {
        environment: builder.getCurrentEnvironmentId(),
      },
    }),
  }),
)(ServiceBrokers);
