import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SECRET_DETAILS } from 'gql/queries';

import { ResourceNotFound, YamlEditorProvider } from 'react-shared';

import SecretData from './Secret/SecretData';
import Header from './SecretHeader';

SecretDetails.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function SecretDetails({ namespace, name }) {
  const [secret, setSecret] = React.useState(null);

  const { data, loading, error } = useQuery(GET_SECRET_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
  });

  React.useEffect(() => {
    if (data && data.secret) {
      setSecret(data.secret);
    }
  }, [data]);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;
  if (!data.secret)
    return (
      <ResourceNotFound
        resource="Secret"
        breadcrumb="Secrets"
        path="/"
        fromContext="Secret"
      />
    );

  return (
    <YamlEditorProvider>
      <Header secret={data.secret} />
      {secret && <SecretData secret={secret} />}
    </YamlEditorProvider>
  );
}
