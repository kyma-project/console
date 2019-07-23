import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';

import CreateAPIModal from './CreateAPIModal.component';

export default compose(
  // graphql(CREATE_APPLICATION_MUTATION, {
  //   props: ({ mutate }) => ({
  //     addApplication: data =>
  //       mutate({
  //         variables: {
  //           in: data,
  //         },
  //       }),
  //   }),
  // }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateAPIModal);
