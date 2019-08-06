import { compose, graphql } from 'react-apollo';
import { GET_SCENARIOS } from './../gql';
import AssignScenarioForm from './AssignScenarioForm.component';

export default compose(
  graphql(GET_SCENARIOS, {
    name: 'availableScenariosQuery',
  }),
)(AssignScenarioForm);
