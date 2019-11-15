import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';

import { preloadingStrategy } from '@kyma-project/common';

import './index.css';

import App from './components/App/App';

import builder from './commons/builder';

import { createApolloClient } from './apollo';

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
