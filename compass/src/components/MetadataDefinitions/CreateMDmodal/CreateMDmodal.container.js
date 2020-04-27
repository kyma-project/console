import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { CREATE_LABEL_DEFINITION, GET_LABEL_DEFINITIONS } from '../gql';
import { SEND_NOTIFICATION } from '../../../gql';

import CreateMDmodal from './CreateMDmodal.component';

export default compose(
  graphql(GET_LABEL_DEFINITIONS, {
    name: 'labelNamesQuery',
  }),
  graphql(CREATE_LABEL_DEFINITION, {
    props: props => ({
      createLabel: async labelInput => {
        const input = {
          ...labelInput,
          schema: labelInput.schema ? JSON.stringify(labelInput.schema) : null,
        };
        await props.mutate({ variables: { in: input } });
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateMDmodal);
