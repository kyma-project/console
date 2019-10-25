import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import { preloadingStrategy } from '@kyma-project/common';

import './index.css';

import App from './components/App/App.container';

import builder from './commons/builder';

import { createApolloClient } from './store';

preloadingStrategy(async () => {
  builder.initOrContextUpdate(() => {
    const client = createApolloClient();
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>,
      document.getElementById('root'),
    );
  });
});
