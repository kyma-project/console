import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import App from './App';
import builder from './store/builder';

import { createApolloClient } from './store/index';
const client = createApolloClient();


(async () => {
  await builder.init();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );
})();
