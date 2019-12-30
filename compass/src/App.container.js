import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { GET_NOTIFICATION, CLEAR_NOTIFICATION } from './gql';

import App from './App.component';

export default compose(
  graphql(GET_NOTIFICATION, {
    name: 'notification',
  }),
  graphql(CLEAR_NOTIFICATION, {
    name: 'clearNotification',
  }),
)(App);
