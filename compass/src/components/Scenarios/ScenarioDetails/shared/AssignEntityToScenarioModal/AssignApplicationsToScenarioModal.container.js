import { graphql, compose } from 'react-apollo';
import { withProps } from 'recompose';
import { GET_APPLICATIONS, SET_APPLICATION_SCENARIOS } from './../../../gql';
import { SEND_NOTIFICATION } from '../../../../../gql';

import AssignEntityToScenarioModal from './AssignEntityToScenarioModal.component';

export default compose(
  graphql(SET_APPLICATION_SCENARIOS, {
    props: ({ mutate }) => ({
      updateEntitiesLabels: (applicationId, scenarios) =>
        mutate({
          variables: {
            id: applicationId,
            scenarios,
          },
        }),
    }),
  }),
  graphql(GET_APPLICATIONS, {
    name: 'allEntitiesQuery',
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  withProps({
    entityName: 'applications',
  }),
)(AssignEntityToScenarioModal);
