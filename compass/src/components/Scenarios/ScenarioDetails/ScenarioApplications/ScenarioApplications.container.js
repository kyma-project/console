import { graphql, compose } from 'react-apollo';
import {
  GET_APPLICATIONS_AND_SCENARIO_APPLICATIONS,
  SET_APPLICATION_SCENARIO,
  REMOVE_APPLICATION_FROM_SCENARIO,
} from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import ScenarioApplications from './ScenarioApplications.component';

export default compose(
  graphql(GET_APPLICATIONS_AND_SCENARIO_APPLICATIONS, {
    name: 'getApplicationsAndScenarioApplications',
    options: ({ scenarioName }) => {
      const filter = {
        key: 'scenarios',
        query: `$[*] ? (@ == "${scenarioName}" )`,
      };
      return {
        variables: {
          filter: [filter],
        },
      };
    },
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ScenarioApplications);
