import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { ADD_RUNTIME } from '../gql';

import CreateRuntimeForm from './CreateRuntimeForm.component';

export default compose(
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
