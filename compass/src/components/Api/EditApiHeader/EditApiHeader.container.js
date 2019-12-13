import { graphql, compose } from 'react-apollo';
import { DELETE_API, DELETE_EVENT_API } from './../gql';

import EditApiHeader from './EditApiHeader.component';

export default compose(
  graphql(DELETE_API, {
    props: props => ({
      deleteApi: async apiId => {
        await props.mutate({ variables: { id: apiId } });
      },
    }),
  }),
  graphql(DELETE_EVENT_API, {
    props: props => ({
      deleteEventApi: async eventApiId => {
        await props.mutate({ variables: { id: eventApiId } });
      },
    }),
  }),
)(EditApiHeader);
