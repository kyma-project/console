import ApplicationScenarioDisplay from './ApplicationScenarioDisplay.component';
import { compose, graphql } from 'react-apollo';
import { SET_APPLICATION_SCENARIOS } from './../../gql';

export default compose(
  graphql(SET_APPLICATION_SCENARIOS, {
    props: props => ({
      setScenarios: async (applicationId, scenarios) => {
        await props.mutate({
          variables: {
            id: applicationId,
            scenarios: scenarios,
          },
        });
        props.result.client.reFetchObservableQueries();
      },
    }),
  }),
)(ApplicationScenarioDisplay);
