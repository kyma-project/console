import React from 'react';
import ReactDOM from 'react-dom';
import LuigiClient from '@kyma-project/luigi-client';

import {
  LOCAL_STORAGE_SHOW_SYSTEM_NAMESPACES,
  SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT,
} from './shared/constants';

import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';

import { preloadingStrategy } from '@kyma-project/common';

import './index.scss';
import App from './components/App/App';
import builder from './commons/builder';

import { createKymaApolloClient, createCompassApolloClient } from './apollo';

export const CompassGqlContext = React.createContext(null);

function setupLocalStorageVariables() {
  LuigiClient.addCustomMessageListener(
    SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT,
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
}

preloadingStrategy(async () => {
  builder.addEventListeners(() => {
    const kymaClient = createKymaApolloClient();
    const compassClient = createCompassApolloClient();

    setupLocalStorageVariables();

    ReactDOM.render(
      <ApolloProvider client={kymaClient}>
        <CompassGqlContext.Provider value={compassClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CompassGqlContext.Provider>
      </ApolloProvider>,
      document.getElementById('root'),
    );
  });
});
