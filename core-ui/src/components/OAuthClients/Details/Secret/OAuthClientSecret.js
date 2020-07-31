import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SECRET } from 'gql/queries';

import { Button, Panel, FormItem, FormLabel } from 'fundamental-react';
import { Spinner } from 'react-shared';
import './OAuthClientSecret.scss';

const SecretComponent = ({ name, value, showEncoded }) => (
  <FormItem>
    <FormLabel>{name}</FormLabel>
    {showEncoded ? btoa(value) : value}
  </FormItem>
);

OAuthClientSecret.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function OAuthClientSecret({ namespace, name }) {
  const [isEncoded, setEncoded] = React.useState(true);

  const { data, loading, error, refetch } = useQuery(GET_SECRET, {
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
    if (!data.secret.data.client_id) {
      return <SecretWrapper>Invalid secret.</SecretWrapper>;
    }

    return (
      <>
        <SecretComponent
          name="Client Id"
          value={data.secret.data.client_id}
          showEncoded={isEncoded}
        />
        <SecretComponent
          name="Client Secret"
          value={data.secret.data.client_secret}
          showEncoded={isEncoded}
        />
      </>
    );
  };

  return (
    <Panel className="fd-has-margin-m oauth-client-panel">
      <Panel.Header>
        <Panel.Head title={`Secret ${name}`} />
        <Panel.Actions>
          <Button
            option="emphasized"
            disabled={!data?.secret?.data.client_id}
            onClick={() => setEncoded(!isEncoded)}
          >
            {isEncoded ? 'Decode' : 'Hide decoded'}
          </Button>
          <Button
            glyph="refresh"
            option="light"
            aria-label="refresh"
            onClick={() => refetch()}
          />
        </Panel.Actions>
      </Panel.Header>
      {body()}
    </Panel>
  );
}
