import { compose, graphql } from 'react-apollo';
import AssignScenarioModal from './../../../Shared/AssignScenarioModal/AssignScenarioModal.component';
import { GET_SCENARIOS } from './../../../Shared/gql';
import { SET_RUNTIME_SCENARIOS } from './../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

export default compose(
  graphql(GET_SCENARIOS, {
    name: 'scenariosQuery',
  }),
  graphql(SET_RUNTIME_SCENARIOS, {
    props: props => ({
      updateScenarios: async (runtimeId, scenarios) => {
        await props.mutate({
          variables: {
            id: runtimeId,
            scenarios: scenarios,
          },
        });
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(AssignScenarioModal);
