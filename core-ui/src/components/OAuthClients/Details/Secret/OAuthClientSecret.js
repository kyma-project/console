import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SECRET } from 'gql/queries';

import { Panel, FormItem, FormLabel } from 'fundamental-react';
import { Spinner } from 'react-shared';
import './OAuthClientSecret.scss';

OAuthClientSecret.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function OAuthClientSecret({ namespace, name }) {
  const { data, loading, error } = useQuery(GET_SECRET, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
  });

  const body = () => {
    const SecretWrapper = ({ children }) => (
      <div className="oauth-client-secret-wrapper">{children}</div>
    );

    if (loading) {
      return (
        <SecretWrapper>
          <Spinner />
        </SecretWrapper>
      );
    }
    if (error) {
      return <SecretWrapper>{`Error ${error.message}`}</SecretWrapper>;
    }
    if (!data.secret) {
      return <SecretWrapper>Secret not found.</SecretWrapper>;
    }
    if (!data.secret.client_id) {
      return <SecretWrapper>Invalid secret.</SecretWrapper>;
    }

    return (
      <>
        <FormItem>
          <FormLabel>Client ID</FormLabel>
          {data.secret.data.client_id}
        </FormItem>
        <FormItem>
          <FormLabel>Client Secret</FormLabel>
          {data.secret.data.client_secret}
        </FormItem>
      </>
    );
  };

  return (
    <Panel className="fd-has-margin-m oauth-client-panel">
      <Panel.Header>
        <Panel.Head title={`Secret ${name}`} />
      </Panel.Header>
      {body()}
    </Panel>
  );
}
