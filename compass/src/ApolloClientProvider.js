import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient } from './store';
import { useApplicationContext } from 'react-shared';

export const ApolloClientProvider = ({ children }) => {
  const context = useApplicationContext();

  const getTenantId = () => {
    return context.tenantId;
  };

  const getToken = () => `Bearer ${context.idToken}`;

  if (!Object.keys(context).length) {
    return <p>Loading...</p>;
  }

  const client = createApolloClient(getTenantId(), getToken());
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
