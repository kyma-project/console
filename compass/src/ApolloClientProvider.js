import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient, fetchSchema, createAuthHttpLink } from './store';
import { useApplicationContext } from 'react-shared';

export const ApolloClientProvider = ({ children }) => {
  const context = useApplicationContext();

  const getTenantId = () => context.tenantId;
  const getToken = () => `Bearer ${context.idToken}`;

  if (!Object.keys(context).length) {
    return <p>Loading...</p>;
  }

  const link = createAuthHttpLink(getTenantId(), getToken());

  return <ClientProvider link={link}>{children}</ClientProvider>;
};

const ClientProvider = ({ children, link }) => {
  const [schema, setSchema] = React.useState(null);
  React.useEffect(() => {
    if (schema) return;
    fetchSchema(link, setSchema);
  }, [link, schema]);

  if (!schema) {
    return <p>Loading...</p>;
  }

  const client = createApolloClient(schema, link);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
