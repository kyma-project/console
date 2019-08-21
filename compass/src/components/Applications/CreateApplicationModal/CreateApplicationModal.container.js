import { graphql, compose } from 'react-apollo';

import { CREATE_APPLICATION_MUTATION, CHECK_APPLICATION_EXISTS } from '../gql';
import { SEND_NOTIFICATION } from '../../../gql';
import { GET_SCENARIOS_LABEL_SCHEMA } from '../../Scenarios/gql';

import CreateApplicationModal from './CreateApplicationModal.component';

export default compose(
  graphql(CHECK_APPLICATION_EXISTS, {
    name: 'existingApplications',
    options: props => {
      return {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      };
    },
  }),
  graphql(CREATE_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      addApplication: data =>
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
  graphql(GET_SCENARIOS_LABEL_SCHEMA, {
    name: 'scenariosQuery',
  }),
)(CreateApplicationModal);
