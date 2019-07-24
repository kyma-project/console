import { graphql, compose } from 'react-apollo';
import { GET_APPLICATIONS, DELETE_APPLICATION_MUTATION } from './gql';

import Applications from './Applications.component';

export default compose(
  graphql(GET_APPLICATIONS, {
    name: 'applications',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(DELETE_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      deleteApplication: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
)(Applications);
