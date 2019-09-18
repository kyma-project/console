import { graphql, compose } from 'react-apollo';
import { CREATE_LABEL } from './../gql';
import { GET_LABEL_DEFINITIONS } from '../../MetadataDefinitions/gql';
import { SEND_NOTIFICATION } from '../../../gql';

import CreateLabelModal from './CreateLabelModal.component';

export default compose(
  graphql(GET_LABEL_DEFINITIONS, {
    name: 'labelNamesQuery',
  }),
  graphql(CREATE_LABEL, {
    props: props => ({
      createLabel: async labelInput => {
        const input = {
          ...labelInput,
          schema: JSON.stringify(labelInput.schema),
        };
        await props.mutate({ variables: { in: input } });
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateLabelModal);
