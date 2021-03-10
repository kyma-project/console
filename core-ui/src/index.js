import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { preloadingStrategy } from '@kyma-project/common';
import './index.scss';
import App from './components/App/App';
import { Microfrontend } from 'react-shared';

import { ApolloClientProvider, createKymaApolloClient } from './apollo';

preloadingStrategy(async () => {
  const isNpx = window.location.origin === 'http://localhost:3001';

  ReactDOM.render(
    <Microfrontend env={process.env}>
      <ApolloClientProvider createClient={createKymaApolloClient}>
        <BrowserRouter basename={isNpx ? '/core-ui' : '/'}>
          <App />
        </BrowserRouter>
      </ApolloClientProvider>
    </Microfrontend>,
    document.getElementById('root'),
  );
});
