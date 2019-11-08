import { graphql, compose } from 'react-apollo';
import { fromRenderProps } from 'recompose';
import {
  GET_APPLICATIONS_FOR_SCENARIO,
  SET_APPLICATION_SCENARIOS,
  createEqualityQuery,
} from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import ScenarioApplications from './ScenarioApplications.component';
import ScenarioNameContext from './../ScenarioNameContext';

export default compose(
  fromRenderProps(ScenarioNameContext.Consumer, scenarioName => ({
    scenarioName,
  })),
  graphql(SET_APPLICATION_SCENARIOS, {
    props: ({ mutate }) => ({
      removeApplicationFromScenario: async (id, scenarios) =>
        await mutate({
          variables: {
            id,
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
        query: createEqualityQuery(scenarioName),
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
