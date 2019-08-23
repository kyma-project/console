import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from './../../../../gql';
import { DELETE_EVENT_API, DELETE_API } from '../../../Application/gql';

import EditApiHeader from './EditApiHeader.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(DELETE_API, {
    props: props => ({
      deleteApi: async apiId => {
        await props.mutate({ variables: { id: apiId } });
      },
    }),
  }),
  graphql(DELETE_EVENT_API, {
    props: props => ({
      deleteEventApi: async eventApiId => {
        await props.mutate({ variables: { id: eventApiId } });
      },
    }),
  }),
)(EditApiHeader);
