import { graphql, withApollo } from 'react-apollo';
import { compose } from 'recompose';

import { GET_NOTIFICATION } from './queries';
import { CLEAR_NOTIFICATION } from './mutations';

import App from './App.component';

const AppWithCompose = compose(
  graphql(GET_NOTIFICATION, {
    name: 'notification',
  }),
  graphql(CLEAR_NOTIFICATION, {
    name: 'clearNotification',
  }),
)(App);

export default withApollo(AppWithCompose);
