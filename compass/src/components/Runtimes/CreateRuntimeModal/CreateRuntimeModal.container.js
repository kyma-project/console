import { graphql, compose } from 'react-apollo';

import { SEND_NOTIFICATION } from '../../../gql';

import CreateRuntimeModal from './CreateRuntimeModal.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateRuntimeModal);
