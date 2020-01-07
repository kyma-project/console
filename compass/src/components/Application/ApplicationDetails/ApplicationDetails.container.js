import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { UNREGISTER_APPLICATION_MUTATION } from './../../Applications/gql';
import { GET_APPLICATION } from './../gql';

import ApplicationDetails from './ApplicationDetails.component';
export default compose(
  graphql(GET_APPLICATION, {
    name: 'applicationQuery',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          id: props.applicationId,
        },
      };
    },
  }),
  graphql(UNREGISTER_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      deleteApplicationMutation: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
)(ApplicationDetails);
