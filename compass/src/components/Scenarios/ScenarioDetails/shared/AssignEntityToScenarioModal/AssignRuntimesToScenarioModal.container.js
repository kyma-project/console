import { graphql, compose } from 'react-apollo';
import { withProps } from 'recompose';
import { GET_RUNTIMES, SET_RUNTIME_SCENARIOS } from '../../../gql';
import { SEND_NOTIFICATION } from '../../../../../gql';

import AssignEntityToScenarioModal from './AssignEntityToScenarioModal.component';

export default compose(
  graphql(SET_RUNTIME_SCENARIOS, {
    props: ({ mutate }) => ({
      updateEntitiesLabels: (runtimeID, scenarios) =>
        mutate({
          variables: {
            id: runtimeID,
            scenarios,
          },
        }),
    }),
  }),
  graphql(GET_RUNTIMES, {
    name: 'allEntitiesQuery',
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  withProps({
    entityName: 'runtimes',
  }),
)(AssignEntityToScenarioModal);
