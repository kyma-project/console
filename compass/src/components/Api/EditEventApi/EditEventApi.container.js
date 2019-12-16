import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from './../../../gql';
import { GET_APPLICATION_WITH_EVENT_DEFINITIONS } from './../gql';
import { UPDATE_EVENT_DEFINITION } from './gql';

import EditApi from './EditEventApi.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(GET_APPLICATION_WITH_EVENT_DEFINITIONS, {
    name: 'eventApiDataQuery',
    options: ({ applicationId }) => {
      return {
        variables: {
          applicationId,
        },
      };
    },
  }),
  graphql(UPDATE_EVENT_DEFINITION, {
    props: ({ mutate }) => ({
      updateEventDefinition: async (id, input) => {
        return mutate({
          variables: {
            id,
            in: input,
          },
        });
      },
    }),
  }),
)(EditApi);
