import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

import builder from './commons/builder';

import { createApolloClient } from './store';
import App from './components/App/App.component';

const client = createApolloClient();

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
    ReactDOM.render(
      <BrowserRouter>
        <ApolloProvider client={client}>
          <App/>
        </ApolloProvider>
      </BrowserRouter>,
      document.getElementById('root'),
    );
  })();
}