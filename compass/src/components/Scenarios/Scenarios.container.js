import { graphql, compose } from 'react-apollo';
import { GET_SCENARIOS_LABEL_SCHEMA } from './gql';

import Scenarios from './Scenarios.component';

export default compose(
  graphql(GET_SCENARIOS_LABEL_SCHEMA, {
    name: 'scenarioLabelSchema',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
)(Scenarios);
