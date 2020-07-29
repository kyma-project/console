import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SECRET } from 'gql/queries';

OAuthClientSecret.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function OAuthClientSecret({ namespace, name }) {
  const { data, loading, error } = useQuery(GET_SECRET, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
  });

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  return (
    <div>
      <p>OK {name}</p>
      <p>client_id: {data.secret ? data.secret.data.client_id : 'nie ma'}</p>
      <p>
        client_secret: {data.secret ? data.secret.data.client_secret : 'nie ma'}
      </p>
    </div>
  );
}
