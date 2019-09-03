import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

import App from './components/App/App.container';

import builder from './commons/builder';

import { createApolloClient } from './store';

const path = new URL(window.location.href).pathname;

if (path === '/preload') {
  window.addEventListener('popstate', function listenToPopState() {
    window.removeEventListener('popstate', listenToPopState);
    start();
  });
} else {
  start();
}

function start() {
  (async () => {
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
  })();
}