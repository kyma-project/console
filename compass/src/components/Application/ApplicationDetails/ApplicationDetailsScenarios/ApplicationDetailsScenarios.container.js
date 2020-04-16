import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SEND_NOTIFICATION } from '../../../../gql';
import ApplicationDetailsScenarios from './ApplicationDetailsScenarios.component';
import ApplicationScenarioDecorator from './ApplicationScenarioDecorator';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationScenarioDecorator(ApplicationDetailsScenarios));
