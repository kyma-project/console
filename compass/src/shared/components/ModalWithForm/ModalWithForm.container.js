import { graphql, compose } from 'react-apollo';

import { SEND_NOTIFICATION } from '../../../gql';

import ModalWithForm from './ModalWithForm.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ModalWithForm);
