import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { REGISTER_RUNTIME } from '../gql';

import RegisterRuntimeForm from './RegisterRuntimeForm.component';

export default compose(
  graphql(REGISTER_RUNTIME, {
    props: ({ mutate, error }) => ({
      addRuntime: data =>
        mutate({
          variables: {
            in: data,
          },
        }),
    }),
  }),
)(RegisterRuntimeForm);
