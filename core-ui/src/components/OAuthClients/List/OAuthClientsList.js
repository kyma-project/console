import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import {
  GenericList,
  PageHeader,
  handleDelete,
  useNotification,
} from 'react-shared';
import { Button } from 'fundamental-react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_OAUTH_CLIENTS } from 'gql/queries';
import { DELETE_OAUTH_CLIENT } from 'gql/mutations';

import ClientStatus from '../Status/OAuthClientStatus';
import ClientLink from './OAuthClientLink';

OAuthClientsList.propTypes = { namespace: PropTypes.string.isRequired };

export default function OAuthClientsList({ namespace }) {
  const notificationManager = useNotification();

  const { data, loading, error } = useQuery(GET_OAUTH_CLIENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace },
  });

  const [deleteClient] = useMutation(DELETE_OAUTH_CLIENT, {
    refetchQueries: () => [
      {
        query: GET_OAUTH_CLIENTS,
        variables: { namespace },
      },
    ],
  });

  const headerRenderer = () => ['Name', 'Status'];

  const rowRenderer = client => [
    <ClientLink name={client.name} />,
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

  return (
    <>
      <PageHeader title="OAuth Clients" />
      <GenericList
        extraHeaderContent={extraHeaderContent}
        notFoundMessage="There are no OAuth clients in this Namespace"
        actions={actions}
        entries={(data && data.oAuth2Clients) || []}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        serverDataLoading={loading}
        serverDataError={error}
      />
    </>
  );
}
