import { compose, graphql } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import RuntimeScenarioDecorator from './RuntimeScenarioDecorator';

import AssignScenarioModal from './../../../Shared/AssignScenario/AssignScenarioModal.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(RuntimeScenarioDecorator(AssignScenarioModal));
