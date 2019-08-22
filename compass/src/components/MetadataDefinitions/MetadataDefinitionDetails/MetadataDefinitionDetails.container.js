import { graphql, compose } from 'react-apollo';

import {
  DELETE_LABEL_DEFINITION,
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
  graphql(DELETE_LABEL_DEFINITION, {
    props: ({ mutate }) => ({
      deleteLabelDefinition: key =>
        mutate({
          variables: {
            key: key,
          },
        }),
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(MetadataDefinitionDetails);
