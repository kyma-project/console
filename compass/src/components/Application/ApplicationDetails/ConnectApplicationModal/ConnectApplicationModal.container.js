import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { CONNECT_APPLICATION } from '../../gql';

import ConnectApplicationModal from './ConnectApplicationModal.component';

export default compose(
  graphql(CONNECT_APPLICATION, {
    props: ({ mutate }) => ({
      connectApplicationMutation: id =>
        mutate({
          variables: {
            id,
          },
        }),
    }),
  }),
)(ConnectApplicationModal);
