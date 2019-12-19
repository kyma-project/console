import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from '../../../../gql';
import { ADD_API, ADD_EVENT_API } from '../../gql';

import CreateAPIModal from './CreateAPIModal.component';

export default compose(
  graphql(ADD_API, {
    props: props => ({
      addAPIDefinition: async (apiData, applicationID) => {
        await props.mutate({
          variables: { applicationID, in: apiData },
        });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
  graphql(ADD_EVENT_API, {
    props: props => ({
      addEventDefinition: async (apiData, applicationID) => {
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
