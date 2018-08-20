import { graphql, compose } from 'react-apollo';

import { SERVICE_INSTANCE_QUERY } from './queries';
import { SERVICE_INSTANCES_DELETE_MUTATION } from '../ServiceInstances/mutations';

import ServiceInstanceDetails from './ServiceInstanceDetails.component';

import builder from '../../commons/builder';

export default compose(
  graphql(SERVICE_INSTANCE_QUERY, {
    name: 'serviceInstance',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          environment: builder.getCurrentEnvironmentId(),
          name: props.match.params.name,
        },
      };
    },
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
)(ServiceInstanceDetails);
