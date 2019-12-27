import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from './../../../gql';
import { GET_APPLICATION_WITH_API_DEFINITIONS } from '../gql';
import { UPDATE_API_DEFINITION } from './gql';

import EditApi from './EditApi.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(GET_APPLICATION_WITH_API_DEFINITIONS, {
    name: 'apiDataQuery',
    options: ({ applicationId }) => {
      return {
        variables: {
          applicationId,
        },
      };
    },
  }),
  graphql(UPDATE_API_DEFINITION, {
    props: ({ mutate }) => ({
      updateApiDefinition: async (id, input) => {
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
