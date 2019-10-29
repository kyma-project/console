import { graphql, compose } from 'react-apollo';
import { UPDATE_SCENARIOS, GET_SCENARIOS_LABEL_SCHEMA } from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import ScenarioDetailsHeader from './ScenarioDetailsHeader.component';

function removeScenario(schema, scenarioName) {
  const schemaObject = JSON.parse(schema);
  schemaObject.items.enum = schemaObject.items.enum.filter(
    s => s !== scenarioName,
  );
  return JSON.stringify(schemaObject);
}

export default compose(
  graphql(GET_SCENARIOS_LABEL_SCHEMA, {
    name: 'getScenariosSchema',
  }),
  graphql(UPDATE_SCENARIOS, {
    props: props => ({
      deleteScenarioMutation: async (scenarioName, labelDefinition) => {
        const newSchema = removeScenario(labelDefinition.schema, scenarioName);
        const input = {
          key: 'scenarios',
          schema: newSchema,
        };
        await props.mutate({ variables: { in: input } });
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ScenarioDetailsHeader);
