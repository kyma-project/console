import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from './../../../gql';

import EditApi from './EditApi.component';
import { GET_API_DATA, UPDATE_API, UPDATE_EVENT_API } from './gql';
export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(GET_API_DATA, {
    name: 'apiDataQuery',
    options: props => {
      return {
        variables: {
          id: props.applicationId,
        },
      };
    },
  }),
  graphql(UPDATE_API, {
    props: ({ mutate }) => ({
      updateAPI: async (id, input) => {
        mutate({
          variables: {
            id,
            in: input,
          },
        });
      },
    }),
  }),
  graphql(UPDATE_EVENT_API, {
    props: ({ mutate }) => ({
      updateEventAPI: async (id, input) => {
        mutate({
          variables: {
            id,
            in: input,
          },
        });
      },
    }),
  }),
)(EditApi);
