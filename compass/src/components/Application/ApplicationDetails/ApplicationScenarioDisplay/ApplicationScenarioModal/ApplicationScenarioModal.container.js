import ApplicationScenarioModal from './ApplicationScenarioModal.component';
import { compose, graphql } from 'react-apollo';
import { GET_SCENARIOS, SET_APPLICATION_SCENARIOS } from '../../../gql';

export default compose(
  graphql(GET_SCENARIOS, {
    name: 'scenariosQuery',
  }),
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
)(ApplicationScenarioModal);
