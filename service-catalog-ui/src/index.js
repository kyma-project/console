import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { preloadingStrategy } from '@kyma-project/common';
import './index.scss';
import builder from './builder';

import { createKymaApolloClient } from './apollo';
import App from 'components/App/App';

preloadingStrategy(async () => {
  builder.addEventListeners(() => {
    const kymaClient = createKymaApolloClient();

    ReactDOM.render(
      <ApolloProvider client={kymaClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>,
      document.getElementById('root'),
    );
  });
});
