import { graphql, compose } from 'react-apollo';
import { withProps } from 'recompose'

import { GET_APPLICATION_WITH_EVENT_APIS, DELETE_EVENT_API } from '../gql';
import EventApiDetails from './EventApiDetails.component';

export default compose(
  graphql(GET_APPLICATION_WITH_EVENT_APIS, {
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
  graphql(DELETE_EVENT_API, {
    props: ({ mutate }) => ({
      deleteEventApi: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
  withProps((props) => ({
    eventApiId: props.eventApiId
  }))
)(EventApiDetails);
