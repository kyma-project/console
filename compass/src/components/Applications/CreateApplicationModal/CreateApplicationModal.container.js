import { graphql, compose } from 'react-apollo';

import { CREATE_APPLICATION_MUTATION, CHECK_APPLICATION_EXISTS, SET_APPLICATION_SCENARIOS } from '../gql';
import { SEND_NOTIFICATION } from '../../../gql';

import CreateApplicationModal from './CreateApplicationModal.component';

export default compose(
  graphql(CHECK_APPLICATION_EXISTS, {
    name: 'existingApplications',
    options: props => {
      return {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      };
    },
  }),
  graphql(CREATE_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      addApplication: data =>
        mutate({
          variables: {
            in: data,
          },
        }),
    }),
  }),
  graphql(SET_APPLICATION_SCENARIOS, {
    props: props => ({
      updateScenarios: async (applicationId, scenarios) => {
        await props.mutate({
          variables: {
            id: applicationId,
            scenarios: scenarios,
          },
        });
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateApplicationModal);
