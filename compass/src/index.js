import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.container';
import { ApplicationContextProvider } from 'react-shared';
import { ApolloClientProvider } from './ApolloClientProvider';

(async () => {
  ReactDOM.render(
    <ApplicationContextProvider>
      <ApolloClientProvider>
        <App />
      </ApolloClientProvider>
    </ApplicationContextProvider>,
    document.getElementById('root'),
  );
})();
