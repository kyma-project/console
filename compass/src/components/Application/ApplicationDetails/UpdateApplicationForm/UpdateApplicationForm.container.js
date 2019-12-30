import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { GET_APPLICATIONS, UPDATE_APPLICATION } from '../../gql';

import UpdateApplicationForm from './UpdateApplicationForm.component';

export default compose(
  graphql(GET_APPLICATIONS, {
    name: 'applicationsQuery',
  }),
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
