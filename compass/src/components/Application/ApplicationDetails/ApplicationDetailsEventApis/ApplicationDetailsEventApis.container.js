import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import { DELETE_EVENT_API } from './../../gql';

import ApplicationDetailsEventApis from './ApplicationDetailsEventApis.component';

export default compose(
  graphql(DELETE_EVENT_API, {
    props: props => ({
      deleteEventAPI: apiId => {
        props.mutate({ variables: { id: apiId } });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsEventApis);
