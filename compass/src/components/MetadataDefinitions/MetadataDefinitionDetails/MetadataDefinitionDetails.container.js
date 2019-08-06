import { graphql, compose } from 'react-apollo';
import { GET_LABEL_DEFINITIONS, GET_LABEL_DEFINITION } from '../gql';

import MetadataDefinitionDetails from './MetadataDefinitionDetails.component';

export default compose(
  graphql(GET_LABEL_DEFINITIONS, {
    name: 'labelDefinitions',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(GET_LABEL_DEFINITION, {
    name: 'metadataDefinition',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          key: props.definitionKey,
        },
      };
    },
  }),
)(MetadataDefinitionDetails);
