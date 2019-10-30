import { graphql, compose } from 'react-apollo';

import {
  GET_APPLICATIONS_AND_LABELS,
  UPDATE_APPLICATION,
  SET_APPLICATION_LABEL,
  REMOVE_APPLICATION_LABEL,
} from '../../gql';

import UpdateApplicationForm from './UpdateApplicationForm.component';

export default compose(
  graphql(GET_APPLICATIONS_AND_LABELS, {
    name: 'applicationsAndLabelsQuery',
  }),
  graphql(UPDATE_APPLICATION, {
    props: ({ mutate }) => ({
      updateApplication: (id, input) =>
        mutate({
          variables: {
            id,
            in: input,
          },
        }),
    }),
  }),
  graphql(SET_APPLICATION_LABEL, {
    props: ({ mutate }) => ({
      setApplicationLabel: (id, key, value) =>
        mutate({
          variables: {
            applicationID: id,
            key,
            value,
          },
        }),
    }),
  }),
  graphql(REMOVE_APPLICATION_LABEL, {
    props: ({ mutate }) => ({
      removeApplicationLabel: (id, key) =>
        mutate({
          variables: {
            applicationID: id,
            key,
          },
        }),
    }),
  }),
)(UpdateApplicationForm);
