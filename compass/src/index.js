import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.container';
import { ApolloProvider } from 'react-apollo';
import builder from './commons/builder';
import { createApolloClient } from './store';

(async () => {
  await builder.init();
  const client = createApolloClient();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );
})();
