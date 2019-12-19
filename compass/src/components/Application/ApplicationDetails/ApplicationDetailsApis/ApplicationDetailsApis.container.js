import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from '../../../../gql';
import { DELETE_API } from './../../gql';

import ApplicationDetailsApis from './ApplicationDetailsApis.component';

export default compose(
  graphql(DELETE_API, {
    props: props => ({
      deleteAPIDefinition: async apiId => {
        await props.mutate({ variables: { id: apiId } });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsApis);
