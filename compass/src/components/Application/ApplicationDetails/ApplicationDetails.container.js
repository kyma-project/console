import { graphql, compose } from 'react-apollo';

import { DELETE_APPLICATION_MUTATION } from './../../Applications/gql';
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
  graphql(DELETE_APPLICATION_MUTATION, {
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
