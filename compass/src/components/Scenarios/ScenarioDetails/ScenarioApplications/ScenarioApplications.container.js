import { graphql, compose } from 'react-apollo';
import {
  GET_APPLICATIONS_FOR_SCENARIO,
  SET_APPLICATION_SCENARIOS,
} from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import ScenarioApplications from './ScenarioApplications.component';

export default compose(
  graphql(SET_APPLICATION_SCENARIOS, {
    props: ({ mutate }) => ({
      removeApplicationFromScenario: async (applicationID, scenarios) =>
        await mutate({
          variables: {
            applicationID,
            scenarios,
          },
        }),
    }),
  }),
  graphql(GET_APPLICATIONS_FOR_SCENARIO, {
    name: 'getApplicationsForScenario',
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
