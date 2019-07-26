import { graphql, compose } from 'react-apollo';

import { ADD_RUNTIME, GET_ALL_RUNTIME_NAMES } from '../gql';

import CreateRuntimeForm from './CreateRuntimeForm.component';

export default compose(
  graphql(GET_ALL_RUNTIME_NAMES, {
    name: 'getRuntimeNames',
    options: props => {
      return {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      };
    },
  }),
  graphql(ADD_RUNTIME, {
    props: ({ mutate, error }) => ({
      addRuntime: data =>
        mutate({
          variables: {
            in: data,
          },
        }),
    }),
  }),
)(CreateRuntimeForm);
