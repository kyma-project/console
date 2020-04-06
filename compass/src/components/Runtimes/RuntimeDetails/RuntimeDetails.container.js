import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { GET_RUNTIME } from '../gql';
import RuntimeDetails from './RuntimeDetails.component';

export default compose(
  graphql(GET_RUNTIME, {
    name: 'runtimeQuery',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          id: props.runtimeId,
        },
      };
    },
  }),
)(RuntimeDetails);
