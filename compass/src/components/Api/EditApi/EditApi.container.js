import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from './../../../gql';
import { GET_APPLICATION_WITH_APIS } from '../gql';
import { UPDATE_API } from './gql';

import EditApi from './EditApi.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(GET_APPLICATION_WITH_APIS, {
    name: 'apiDataQuery',
    options: ({ applicationId }) => {
      return {
        variables: {
          applicationId,
        },
      };
    },
  }),
  graphql(UPDATE_API, {
    props: ({ mutate }) => ({
      updateApi: async (id, input) => {
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
