import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import builder from './commons/builder';
import { createApolloClient } from './store';
// eslint-disable-line no-unused-vars
import LuigiClient from '@kyma-project/luigi-client'; //used on lower levels

const client = createApolloClient();

(async () => {
  await builder.init();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
