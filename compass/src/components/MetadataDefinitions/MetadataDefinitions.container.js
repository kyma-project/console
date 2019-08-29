import { graphql, compose } from 'react-apollo';
import { GET_LABEL_DEFINITIONS, DELETE_LABEL_DEFINITION } from './gql';

import MetadataDefinitions from './MetadataDefinitions.component';

export default compose(
  graphql(GET_LABEL_DEFINITIONS, {
    name: 'labelDefinitions',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(DELETE_LABEL_DEFINITION, {
    props: ({ mutate }) => ({
      deleteLabelDefinition: key =>
        mutate({
          variables: {
            key,
          },
        }),
    }),
  }),
)(MetadataDefinitions);
