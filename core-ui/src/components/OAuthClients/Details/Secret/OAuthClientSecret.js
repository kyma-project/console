import React from 'react';
import PropTypes from 'prop-types';

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { GET_SECRET } from 'gql/queries';
import { SECRET_EVENT_SUBSCRIPTION } from 'gql/subscriptions';

import { Button, Panel, FormItem, FormLabel } from 'fundamental-react';
import { Spinner, handleSubscriptionEvent } from 'react-shared';
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
  const [secret, setSecret] = React.useState(null);
  const [isEncoded, setEncoded] = React.useState(true);

  const { loading, error } = useQuery(GET_SECRET, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
    onCompleted: data => setSecret(data.secret),
  });

  useSubscription(SECRET_EVENT_SUBSCRIPTION, {
    variables: { namespace },
    onSubscriptionData: ({ subscriptionData }) => {
      const { type, secret } = subscriptionData.data.secretEvent;
      handleSubscriptionEvent(type, setSecret, secret, s => s.name === name);
    },
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
    if (!secret) {
      return <SecretWrapper>Secret not found.</SecretWrapper>;
    }
    if (!secret.data.client_id) {
      return <SecretWrapper>Invalid secret.</SecretWrapper>;
    }

    return (
      <>
        <SecretComponent
          name="Client Id"
          value={secret.data.client_id}
          showEncoded={isEncoded}
        />
        <SecretComponent
          name="Client Secret"
          value={secret.data.client_secret}
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
            option="light"
            glyph={isEncoded ? 'show' : 'hide'}
            disabled={!secret?.data.client_id}
            onClick={() => setEncoded(!isEncoded)}
          >
            {isEncoded ? 'Decode' : 'Hide decoded'}
          </Button>
        </Panel.Actions>
      </Panel.Header>
      {body()}
    </Panel>
  );
}
