import { graphql, compose } from 'react-apollo';

import { GET_SERVICE_CLASS } from './queries';
import { CREATE_SERVICE_INSTANCE } from './mutations';

import ServiceClassDetails from './ServiceClassDetails.component';

import builder from '../../commons/builder';

export default compose(
  graphql(GET_SERVICE_CLASS, {
    options: props => {
      return {
        variables: {
          name: props.match.params.name,
          environment: builder.getCurrentEnvironmentId(),
        },
        options: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
      };
    },
    name: 'serviceClass',
  }),
  graphql(CREATE_SERVICE_INSTANCE, {
    name: 'createServiceInstance',
  }),
)(ServiceClassDetails);
