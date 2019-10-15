import { graphql, compose } from 'react-apollo';
import { GET_APPLICATIONS, SET_APPLICATION_SCENARIO } from './../../../gql';
import { SEND_NOTIFICATION } from '../../../../../gql';

import AssignApplicationsToScenarioModal from './AssignApplicationsToScenarioModal.component';

export default compose(
  graphql(SET_APPLICATION_SCENARIO, {
    props: ({ mutate }) => ({
      updateApplicationLabels: (applicationId, scenarios) =>
        mutate({
          variables: {
            id: applicationId,
            scenarios,
          },
        }),
    }),
  }),
  graphql(GET_APPLICATIONS, {
    name: 'allApplicationsQuery',
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(AssignApplicationsToScenarioModal);
