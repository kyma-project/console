import { graphql, compose } from 'react-apollo';

import { GET_NOTIFICATION } from './queries';
import { CLEAR_NOTIFICATION } from './mutations';

import App from './App.component';

export default compose(
  graphql(GET_NOTIFICATION, {
    name: 'notification',
  }),
  graphql(CLEAR_NOTIFICATION, {
    name: 'clearNotification',
  }),
)(App);
