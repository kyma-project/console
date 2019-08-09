import { graphql, compose } from 'react-apollo';
import {
  GET_LABEL_DEFINITIONS,
  GET_LABEL_DEFINITION,
  UPDATE_LABEL_DEFINITION,
} from '../gql';

import { SEND_NOTIFICATION } from '../../../gql';

import MetadataDefinitionDetails from './MetadataDefinitionDetails.component';

export default compose(
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
  graphql(UPDATE_LABEL_DEFINITION, {
    props: ({ mutate, error }) => ({
      updateLabelDefinition: data =>
        mutate({
          variables: {
            in: data,
          },
        }),
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(MetadataDefinitionDetails);
