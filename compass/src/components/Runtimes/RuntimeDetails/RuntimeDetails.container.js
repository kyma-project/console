import { graphql, compose } from 'react-apollo';

import { GET_RUNTIME, DELETE_RUNTIME } from '../gql';

import RuntimeDetails from './RuntimeDetails.component'

export default compose(
  graphql(GET_RUNTIME, {
    name: 'runtimeQuery',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          id: props.runtimeId,
        },
      };
    },
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
)(RuntimeDetails);
