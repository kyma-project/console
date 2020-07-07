import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { preloadingStrategy } from '@kyma-project/common';
import './index.scss';
import App from './components/App/App';
import { Microfrontend } from 'react-shared';

import { ApolloClientProvider, createKymaApolloClient } from './apollo';

preloadingStrategy(async () => {
  ReactDOM.render(
    <Microfrontend env={process.env}>
      <ApolloClientProvider createClient={createKymaApolloClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloClientProvider>
    </Microfrontend>,
    document.getElementById('root'),
  );
});
