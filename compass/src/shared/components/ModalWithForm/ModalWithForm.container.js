import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from '../../../gql';

import ModalWithForm from './ModalWithForm.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ModalWithForm);
