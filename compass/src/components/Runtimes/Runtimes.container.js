import { graphql, compose } from 'react-apollo';
import { GET_RUNTIMES, ADD_RUNTIME, DELETE_RUNTIME } from './gql';

import Runtimes from './Runtimes.component';

export default compose(
  graphql(GET_RUNTIMES, {
    name: 'runtimes',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(ADD_RUNTIME, {
    props: ({ mutate }) => ({
      addRuntime: data =>
        mutate({
          variables: {
            in: data,
          },
        }),
    }),
  }),
  graphql(DELETE_RUNTIME, {
    props: ({ mutate }) => ({
      deleteRuntime: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
)(Runtimes);
