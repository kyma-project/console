import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient } from './store';
import { useApplicationContext } from 'react-shared';

const DEFAULT_TENANT_ID = '3e64ebae-38b5-46a0-b1ed-9ccee153a0ae';

export const ApolloClientProvider = ({ children }) => {
  const context = useApplicationContext();

  const getTenantId = () => {
    if (!context.tenants) {
      return DEFAULT_TENANT_ID;
    }

    const tenantName = context.tenantName;
    const currentTenant = context.tenants.find(t => t.name === tenantName);
    if (!currentTenant) {
      return context.defaultTenantId;
    } else {
      return currentTenant.id;
    }
  };

  const getToken = () => `Bearer ${context.idToken}`;

  if (!Object.keys(context).length) {
    return <p>Loading...</p>;
  }

  const client = createApolloClient(getTenantId(), getToken());
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
