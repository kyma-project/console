import React from 'react';
import ReactDOM from 'react-dom';
import LuigiClient from '@kyma-project/luigi-client';

import { LOCAL_STORAGE_SHOW_SYSTEM_NAMESPACES } from './shared/constants';

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

  LuigiClient.addCustomMessageListener(
    'showSystemNamespacesChangedEvent',
    msg =>
      localStorage.setItem(
        LOCAL_STORAGE_SHOW_SYSTEM_NAMESPACES,
        msg.showSystemNamespaces,
      ),
  );

  localStorage.setItem(
    LOCAL_STORAGE_SHOW_SYSTEM_NAMESPACES,
    LuigiClient.getContext().showSystemNamespaces,
  );

  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  );
});
