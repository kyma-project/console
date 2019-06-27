import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { COMPASS_GRAPHQL_ENDPOINT } from './config/config';
import LuigiClient from '@kyma-project/luigi-client'; // this is NOT unused

const gqlClient = new ApolloClient({
  uri: COMPASS_GRAPHQL_ENDPOINT,
});

ReactDOM.render(
  <ApolloProvider client={gqlClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
