import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';

import { Spinner } from '@kyma-project/react-components';

import App from './App.container';

import builder from '../../commons/builder';
import { createApolloClient } from '../../store';

function CatalogViewContent() {
  const [contextPresent, setContextPresent] = useState(false);

  builder.init().then(() => {
    setContextPresent(true);
  });

  return contextPresent ? (
    <ApolloProvider client={createApolloClient()}>
      <App />
    </ApolloProvider>
  ) : (
    <Spinner />
  );
}

export default CatalogViewContent;
