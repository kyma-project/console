import { graphql, compose } from 'react-apollo';
import { withProps } from 'recompose'

import { GET_APPLICATION_WITH_APIS, DELETE_API } from './../gql';
import ApiDetails from './ApiDetails.component';

export default compose(
  graphql(GET_APPLICATION_WITH_APIS, {
    name: 'applicationQuery',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          applicationId: props.applicationId,
        },
      };
    },
  }),
  graphql(DELETE_API, {
    props: ({ mutate }) => ({
      deleteApi: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
  withProps((props) => ({
    apiId: props.apiId
  }))
)(ApiDetails);
