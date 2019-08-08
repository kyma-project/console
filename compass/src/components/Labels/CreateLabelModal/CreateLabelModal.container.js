import { graphql, compose } from 'react-apollo';
import { GET_LABEL_NAMES, CREATE_LABEL } from './../gql';
import { SEND_NOTIFICATION } from '../../../gql';

import CreateLabelModal from './CreateLabelModal.component';

export default compose(
  graphql(GET_LABEL_NAMES, {
    name: 'labelNamesQuery',
  }),
  graphql(CREATE_LABEL, {
    props: props => ({
      createLabel: async labelInput => {
        await props.mutate({ variables: { in: labelInput } });
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateLabelModal);
