import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';

import { preloadingStrategy } from '@kyma-project/common';

import './index.scss';
import App from './components/App/App';
import builder from './commons/builder';

import { createApolloClient } from './apollo';

preloadingStrategy(async () => {
  await builder.init();
  const client = createApolloClient();

  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  );
});
