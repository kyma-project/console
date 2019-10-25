import { graphql, withApollo } from 'react-apollo';
import { compose } from 'recompose';

import { GET_SERVICE_CLASS } from './queries';
import { CREATE_SERVICE_INSTANCE } from './mutations';

import ServiceClassDetails from './ServiceClassDetails.component';

import builder from '../../commons/builder';
const filterExtensions = ['md', 'xml', 'json', 'yml', 'yaml'];

const ServiceClassDetailsWithCompose = compose(
  graphql(GET_SERVICE_CLASS, {
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          name: props.match.params.name,
          namespace: builder.getCurrentEnvironmentId(),
          fileExtensions: filterExtensions,
        },
      };
    },
    name: 'serviceClass',
  }),
  graphql(CREATE_SERVICE_INSTANCE, {
    name: 'createServiceInstance',
  }),
)(ServiceClassDetails);

export default withApollo(ServiceClassDetailsWithCompose);
