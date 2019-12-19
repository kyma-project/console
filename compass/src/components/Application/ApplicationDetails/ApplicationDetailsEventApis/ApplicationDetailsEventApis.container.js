import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from '../../../../gql';
import { DELETE_EVENT_API } from './../../gql';

import ApplicationDetailsEventApis from './ApplicationDetailsEventApis.component';

export default compose(
  graphql(DELETE_EVENT_API, {
    props: props => ({
      deleteEventDefinition: apiId => {
        props.mutate({ variables: { id: apiId } });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsEventApis);
