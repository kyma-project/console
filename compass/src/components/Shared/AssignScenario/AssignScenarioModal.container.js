import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from './../../../gql';
import { GET_SCENARIOS } from './../../Shared/gql';

import AssignScenarioModal from './AssignScenarioModal.component';

export default compose(
  graphql(GET_SCENARIOS, {
    name: 'availableScenariosQuery',
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(AssignScenarioModal);
