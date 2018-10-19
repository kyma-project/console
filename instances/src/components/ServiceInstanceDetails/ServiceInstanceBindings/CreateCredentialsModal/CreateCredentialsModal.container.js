import { graphql, withApollo, compose } from 'react-apollo';

import { SEND_NOTIFICATION } from './mutations';

import CreateCredentialsModal from './CreateCredentialsModal.component';

const CreateCredentialsContainerWithCompose = compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateCredentialsModal);

export default withApollo(CreateCredentialsContainerWithCompose);
