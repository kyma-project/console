import ApplicationScenarioModal from './ApplicationScenarioModal.component';
import { compose, graphql } from 'react-apollo';
import { GET_SCENARIOS } from '../../../gql';

export default compose(
  graphql(GET_SCENARIOS, {
    name: "scenariosQuery"
  })
)(ApplicationScenarioModal);
