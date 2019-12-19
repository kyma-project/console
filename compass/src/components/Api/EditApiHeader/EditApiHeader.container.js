import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { DELETE_API_DEFINITION, DELETE_EVENT_DEFINITION } from './../gql';

import EditApiHeader from './EditApiHeader.component';

export default compose(
  graphql(DELETE_API_DEFINITION, {
    props: props => ({
      deleteApi: async apiId => {
        await props.mutate({ variables: { id: apiId } });
      },
    }),
  }),
  graphql(DELETE_EVENT_DEFINITION, {
    props: props => ({
      deleteEventApi: async eventApiId => {
        await props.mutate({ variables: { id: eventApiId } });
      },
    }),
  }),
)(EditApiHeader);
