import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import {
  GenericList,
  PageHeader,
  handleDelete,
  useNotification,
  handleSubscriptionArrayEvent,
} from 'react-shared';
import { Button } from 'fundamental-react';
import { OAUTH_DOC_URL } from 'shared/constants';

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { GET_OAUTH_CLIENTS } from 'gql/queries';
import { DELETE_OAUTH_CLIENT } from 'gql/mutations';
import { OAUTH_CLIENT_EVENT_SUBSCRIPTION } from 'gql/subscriptions';

import ClientStatus from '../Status/OAuthClientStatus';
import ClientLink from './OAuthClientLink';

OAuthClientsList.propTypes = { namespace: PropTypes.string.isRequired };

export default function OAuthClientsList({ namespace }) {
  const notificationManager = useNotification();

  const [clients, setClients] = React.useState([]);

  const { data, loading, error } = useQuery(GET_OAUTH_CLIENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace },
    onCompleted: data => setClients(data.oAuth2Clients),
  });

  useSubscription(OAUTH_CLIENT_EVENT_SUBSCRIPTION, {
    variables: { namespace },
    onSubscriptionData: ({ subscriptionData }) => {
      const { type, client } = subscriptionData.data.oAuth2ClientEvent;
      handleSubscriptionArrayEvent(clients, setClients, type, client);
    },
  });

  const [deleteClient] = useMutation(DELETE_OAUTH_CLIENT);

  const headerRenderer = () => ['Name', 'Secret', 'Status'];

  const rowRenderer = client => [
    <ClientLink name={client.name} />,
    client.spec.secretName,
    <ClientStatus error={client.error} />,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry =>
        handleDelete(
          'OAuth Client',
          entry.name,
          entry.name,
          () => deleteClient({ variables: { namespace, name: entry.name } }),
          () =>
            notificationManager.notifySuccess({
              content: `OAuth Client ${entry.name} deleted`,
            }),
        ),
    },
  ];

  const extraHeaderContent = (
    <Button
      glyph="add"
      onClick={() => LuigiClient.linkManager().navigate('create')}
    >
      Create OAuth Client
    </Button>
  );

  const description = (
    <span>
      {'See the "OAuth2 and OpenID Connect server" section in the '}
      <span
        className="link"
        onClick={() => LuigiClient.linkManager().navigate(OAUTH_DOC_URL)}
      >
        documentation
      </span>
      {' to find out more.'}
    </span>
  );

  return (
    <>
      <PageHeader title="OAuth Clients" description={description} />
      <GenericList
        extraHeaderContent={extraHeaderContent}
        notFoundMessage="There are no OAuth clients in this Namespace"
        actions={actions}
        entries={clients || data.oAuth2Clients}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        serverDataLoading={loading}
        serverDataError={error}
        textSearchProperties={['name', 'spec.secretName']}
      />
    </>
  );
}
