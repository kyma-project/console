import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import handlePreload from '../../preloadHandling';

import './index.css';

import App from './components/App/App.container';

import builder from './commons/builder';

import { createApolloClient } from './store';

handlePreload(async () => {
  await builder.init();
  const client = createApolloClient();
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root'),
  );
});
