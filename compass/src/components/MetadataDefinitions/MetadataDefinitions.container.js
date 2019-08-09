import { graphql, compose } from 'react-apollo';
import { GET_LABEL_DEFINITIONS } from './gql';

import MetadataDefinitions from './MetadataDefinitions.component';

export default compose(
  graphql(GET_LABEL_DEFINITIONS, {
    name: 'labelDefinitions',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
)(MetadataDefinitions);
