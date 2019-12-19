import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import AssignScenarioModal from '../../../Shared/AssignScenario/AssignScenarioModal.container';
import { SET_APPLICATION_SCENARIOS } from './../../gql';

export default compose(
  graphql(SET_APPLICATION_SCENARIOS, {
    props: props => ({
      updateScenarios: async (applicationId, scenarios) => {
        await props.mutate({
          variables: {
            id: applicationId,
            scenarios: scenarios,
          },
        });
      },
    }),
  }),
)(AssignScenarioModal);
