import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient } from './store';
import uuidv5 from 'uuid/v5';
import validate from 'uuid-validate';
import { useApplicationContext } from 'react-shared';

export const ApolloClientProvider = ({ children }) => {
  const context = useApplicationContext();

  const getTenant = () => {
    const NAMESPACE = '1b671a64-babe-b00b-face-da01ff1f3341';
    if (validate(context.tenantId)) {
      return context.tenantId;
    }
    return uuidv5(context.tenantId, NAMESPACE);
  };

  const getToken = () => `Bearer ${context.idToken}`;

  if (!Object.keys(context).length) {
    return <p>Loading...</p>;
  }

  const client = createApolloClient(getTenant(), getToken());
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
