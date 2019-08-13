import { compose, graphql } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import RuntimeScenarioDecorator from './RuntimeScenarioDecorator';

import RuntimeScenarios from './RuntimeScenarios.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(RuntimeScenarioDecorator(RuntimeScenarios));
