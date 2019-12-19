import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from './../../../gql';

import EditApi from './EditApi.component';
import {
  GET_API_DATA,
  UPDATE_API_DEFINITION,
  UPDATE_EVENT_DEFINITION,
} from './gql';
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
  graphql(UPDATE_API_DEFINITION, {
    props: ({ mutate }) => ({
      updateAPIDefinition: async (id, input) => {
        mutate({
          variables: {
            id,
            in: input,
          },
        });
      },
    }),
  }),
  graphql(UPDATE_EVENT_DEFINITION, {
    props: ({ mutate }) => ({
      updateEventDefinition: async (id, input) => {
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
