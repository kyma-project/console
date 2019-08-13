import { compose, graphql } from 'react-apollo';
import AssignScenarioModal from '../../../Shared/AssignScenario/AssignScenarioModal.component';
import { SEND_NOTIFICATION } from '../../../../gql';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(AssignScenarioModal);
