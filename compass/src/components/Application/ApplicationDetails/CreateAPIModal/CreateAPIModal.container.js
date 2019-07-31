import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import { ADD_API, ADD_EVENT_API } from '../../gql';

import CreateAPIModal from './CreateAPIModal.component';

export default compose(
  graphql(ADD_API, {
    props: props => ({
      addAPI: async (apiData, applicationID) => {
        await props.mutate({
          variables: { applicationID, in: apiData },
        });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(ADD_EVENT_API, {
    props: props => ({
      addEventAPI: async (apiData, applicationID) => {
        await props.mutate({
          variables: { applicationID, in: apiData },
        });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateAPIModal);
