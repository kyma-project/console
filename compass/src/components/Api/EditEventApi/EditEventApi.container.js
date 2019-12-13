import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from './../../../gql';
import { GET_APPLICATION_WITH_EVENT_APIS } from './../gql';
import { UPDATE_EVENT_API } from './gql';

import EditApi from './EditEventApi.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(GET_APPLICATION_WITH_EVENT_APIS, {
    name: 'eventApiDataQuery',
    options: ({ applicationId }) => {
      return {
        variables: {
          applicationId,
        },
      };
    },
  }),
  graphql(UPDATE_EVENT_API, {
    props: ({ mutate }) => ({
      updateEventApi: async (id, input) => {
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
