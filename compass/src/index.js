import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.container';
import { ApplicationContextProvider } from 'react-shared';
import { preloadingStrategy } from '@kyma-project/common';
import { ApolloClientProvider } from './ApolloClientProvider';

preloadingStrategy(async () => {
  ReactDOM.render(
    <ApplicationContextProvider>
      <ApolloClientProvider>
        <App />
      </ApolloClientProvider>
    </ApplicationContextProvider>,
    document.getElementById('root'),
  );
});
