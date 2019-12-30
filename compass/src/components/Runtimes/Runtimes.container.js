import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { GET_RUNTIMES, REGISTER_RUNTIME, UNREGISTER_RUNTIME } from './gql';

import Runtimes from './Runtimes.component';

export default compose(
  graphql(GET_RUNTIMES, {
    name: 'runtimes',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(REGISTER_RUNTIME, {
    props: ({ mutate }) => ({
      registerRuntime: data =>
        mutate({
          variables: {
            in: data,
          },
        }),
    }),
  }),
  graphql(UNREGISTER_RUNTIME, {
    props: ({ mutate }) => ({
      unregisterRuntime: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
)(Runtimes);
