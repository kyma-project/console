import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import { DELETE_API } from './../../gql';

import ApplicationDetailsApis from './ApplicationDetailsApis.component';

export default compose(
  graphql(DELETE_API, {
    props: props => ({
      deleteAPI: async apiId => {
        await props.mutate({ variables: { id: apiId } });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsApis);
