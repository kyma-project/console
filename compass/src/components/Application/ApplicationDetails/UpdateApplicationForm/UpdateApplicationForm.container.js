import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { UPDATE_APPLICATION } from '../../gql';

import UpdateApplicationForm from './UpdateApplicationForm.component';

export default compose(
  graphql(UPDATE_APPLICATION, {
    props: ({ mutate }) => ({
      updateApplication: (id, input) =>
        mutate({
          variables: {
            id,
            in: input,
          },
        }),
    }),
  }),
)(UpdateApplicationForm);
