import { graphql, compose } from 'react-apollo';
import { GET_APPLICATIONS, GET_RUNTIMES } from './../../gql';

import CreateScenarioForm from './CreateScenarioForm.component';

export default compose(
  graphql(GET_APPLICATIONS, {
    name: 'applicationsQuery',
  }),
  graphql(GET_RUNTIMES, {
    name: 'runtimesQuery',
  }),
)(CreateScenarioForm);
